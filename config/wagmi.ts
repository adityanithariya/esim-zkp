'use client';

import type { Config } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, createStorage, http } from 'wagmi';
import { cookieStorage } from 'wagmi';
import {
    rainbowWallet,
    walletConnectWallet,
    coinbaseWallet,
    metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';

declare module 'wagmi' {
    interface Register {
        config: typeof WagmiConfig;
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
        projectId: "123"
    }
);

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
});

export default WagmiConfig;
