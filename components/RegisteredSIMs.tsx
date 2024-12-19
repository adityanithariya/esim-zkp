'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Program } from '@coral-xyz/anchor'
import idl from '@idl/esim_zkp.json'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import type { EsimZkp } from '@type/esim_zkp'
import type { eSIM } from '@type/index'
import { formatPhoneNumber } from '@utils/index'
import clsx from 'clsx'
// import { watchAccount } from "@wagmi/core";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoWalletOutline } from 'react-icons/io5'
import { PiPlugsConnectedThin } from 'react-icons/pi'
import { TbReload } from 'react-icons/tb'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { toast } from 'react-toastify'
import Button from './ui/button'

const RegisteredSIMs = () => {
  // const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // const { data } = useSession()
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deleteSIM, setDeleteSIM] = useState<eSIM | null>(null)
  const { connection } = useConnection()
  const program = new Program<EsimZkp>(idl as EsimZkp)
  const [SIMs, setSIMs] = useState<eSIM[]>([])

  const setActive = async (phoneNumber: string, status: boolean) => {
    if (!publicKey) return
    setStatusLoading(true)
    try {
      const txId = await program.methods
        .setStatus(phoneNumber, status)
        .accounts({ user: publicKey })
        .rpc()
      await connection.confirmTransaction({
        signature: txId,
        ...(await connection.getLatestBlockhash()),
      })
      router.refresh()
    } catch (e) {
      console.log(e)
    } finally {
      setStatusLoading(false)
    }
  }

  // useEffect(() => {
  //   if (isAuthenticated && data?.address) router.refresh()
  // }, [isAuthenticated, data])

  const { publicKey } = useWallet()

  useEffect(() => {
    ;(async () => {
      if (publicKey) router.refresh()
    })()
  }, [publicKey, router])

  const fetchSIMs = async () => {
    if (!publicKey) return
    setLoading(true)
    const accounts = await program.account.esim.all([
      {
        memcmp: {
          offset: 8,
          bytes: publicKey.toBase58(),
        },
      },
    ])
    const SIMs: eSIM[] = []
    for (const data of accounts) {
      SIMs.push({
        phoneNumber: data.account.phoneNumber,
        active: data.account.active,
        gender: String.fromCharCode(data.account.gender) as 'M' | 'F',
        state: data.account.state,
        pincode: data.account.pincode,
        updatedAt: data.account.updatedAt.toNumber() * 1000,
        id: data.publicKey.toBase58(),
      })
    }
    console.log('sims:', SIMs)
    setSIMs(SIMs)
    setLoading(false)
  }

  useEffect(() => {
    fetchSIMs()
  }, [publicKey])
  const { connected } = useWallet()

  return connected ? (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-semibold text-xl">Registered eSIMs</h1>
        <button type="button" onClick={fetchSIMs} disabled={loading}>
          {loading ? (
            <div className="loader" />
          ) : (
            <TbReload className="size-5" />
          )}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {SIMs.length === 0 ? (
          <div className="h-[40vh] bg-white/10 flex items-center gap-2 justify-center rounded-md w-full text-sm">
            Register eSIM to view here!
          </div>
        ) : null}
        {SIMs.map((SIM) => (
          <div
            key={SIM.id}
            className="bg-white/10 border border-transparent hover:border-white/30 px-3 py-2 rounded-md group"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div>{formatPhoneNumber(SIM.phoneNumber)}</div>
                <div
                  className={clsx(
                    'px-1 text-xs h-fit rounded',
                    SIM.active ? 'bg-green-400' : 'bg-red-400',
                  )}
                >
                  {SIM.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="flex sm:gap-3 gap-0">
                {SIM.active ? (
                  <abbr title="Deactivate">
                    <button
                      type="button"
                      className={clsx(
                        'hover:bg-white/15 p-1 rounded',
                        !statusLoading &&
                          'md:opacity-0 sm:opacity-100 opacity-100 group-hover:opacity-100',
                      )}
                      onClick={() => setActive(SIM.phoneNumber, false)}
                      disabled={statusLoading}
                    >
                      {statusLoading ? (
                        <div className="loader" />
                      ) : (
                        <VscDebugDisconnect className="text-red-500 size-6" />
                      )}
                    </button>
                  </abbr>
                ) : (
                  <abbr title="Activate">
                    <button
                      type="button"
                      className="hover:bg-white/15 p-1 rounded md:opacity-0 sm:opacity-100 opacity-100 group-hover:opacity-100"
                      onClick={() => setActive(SIM.phoneNumber, true)}
                      disabled={statusLoading}
                    >
                      {statusLoading ? (
                        <div className="loader" />
                      ) : (
                        <PiPlugsConnectedThin className="text-green-500 size-6" />
                      )}
                    </button>
                  </abbr>
                )}
                <abbr title="Delete">
                  <button
                    type="button"
                    className="hover:bg-white/15 p-1 rounded md:opacity-0 sm:opacity-100 opacity-100 group-hover:opacity-100"
                    onClick={() => {
                      setDeleteSIM(SIM)
                      setOpenDeleteDialog(true)
                    }}
                  >
                    <AiOutlineDelete className="text-red-500 size-6" />
                  </button>
                </abbr>
              </div>
            </div>
            <abbr
              className="no-underline flex w-fit mb-2"
              title={new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZone: 'Asia/Kolkata',
                hour12: true,
              }).format(new Date(SIM.updatedAt))}
            >
              <div className="text-white/45 text-xs">
                {new Date(SIM.updatedAt).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </abbr>
          </div>
        ))}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Delete eSIM with phone number{' '}
                {deleteSIM?.phoneNumber &&
                  formatPhoneNumber(deleteSIM.phoneNumber)}
                ?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                eSIM and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              <Button
                className="w-full"
                onClick={async () => {
                  if (!deleteSIM || !publicKey) return
                  try {
                    const txId = await program.methods
                      .delete(deleteSIM.phoneNumber)
                      .accounts({ user: publicKey })
                      .rpc()
                    await connection.confirmTransaction({
                      signature: txId,
                      ...(await connection.getLatestBlockhash()),
                    })
                    toast.success('eSIM deleted successfully')
                    router.refresh()
                  } catch (e) {
                    console.log(e)
                  } finally {
                    setOpenDeleteDialog(false)
                  }
                  // await deleteDoc(doc(eSIMs, deleteSIM?.id));
                }}
              >
                Delete
              </Button>
              <Button
                className="!bg-transparent hover:!bg-white/10 w-full"
                onClick={() => setOpenDeleteDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  ) : (
    <button
      type="button"
      className="h-[50vh] bg-white/10 flex items-center gap-2 justify-center rounded-md w-card"
      onClick={openConnectModal}
    >
      <IoWalletOutline className="size-7" />
      <div>Connect Wallet to view eSIMs</div>
    </button>
  )
}

export default RegisteredSIMs
