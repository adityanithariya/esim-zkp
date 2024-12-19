'use client'

import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import type { Config } from 'wagmi'
import { http, createConfig, createStorage } from 'wagmi'
import { cookieStorage } from 'wagmi'
import { sepolia } from 'wagmi/chains'

declare module 'wagmi' {
  interface Register {
    config: typeof WagmiConfig
  }
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        rainbowWallet,
        walletConnectWallet,
        coinbaseWallet,
      ],
    },
  ],
  {
    appName: 'Panda Pioneers',
    projectId: '123',
  },
)

const WagmiConfig: Config = createConfig({
  chains: [sepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sepolia.id]: http(),
  },
  connectors,
})

export default WagmiConfig
