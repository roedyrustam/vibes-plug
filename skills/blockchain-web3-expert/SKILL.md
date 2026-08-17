---
name: blockchain-web3-expert
description: "Expert guide for Web3 and blockchain dApp integration — viem, wagmi v2, ethers.js v6, RainbowKit, smart contract interactions, and EVM wallet state / Panduan ahli integrasi Web3 dan blockchain."
author: "vibes-plug-swarm"
---

# Blockchain & Web3 Expert (2026 Edition)

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>
## English

### Orchestration & Integration
- **`senior-frontend`**: React and Next.js frontend state for Web3 wallets.
- **`authentication-identity-expert`**: Sign-In with Ethereum (SIWE / ERC-4361).
- **`error-resilience-expert`**: Handling RPC node timeouts, network switches, and user transaction rejections.
- **`post-quantum-crypto-migrator`**: Future-proofing cryptographic signatures and hash functions.

### Description
Production-ready guide for building decentralized applications (dApps) on EVM-compatible blockchains. Covers typed smart contract interactions with **viem** and **wagmi v2**, wallet connectivity with **RainbowKit / AppKit**, gas estimation, transaction lifecycle management, ERC-20 / ERC-721 / ERC-1155 standards, and decentralized storage (IPFS/Arweave).

### Trigger Conditions
- Integrating crypto wallet connections (MetaMask, Coinbase Wallet, WalletConnect).
- Reading from and writing to Ethereum / Polygon / Arbitrum / Base smart contracts.
- Implementing Sign-In With Ethereum (SIWE) authentication.
- Minting, transferring, or querying ERC-20 tokens or NFTs.

---

### Core Architecture & Modern Patterns

#### 1. Wallet Connection & Config (`wagmi.config.ts`)
```typescript
import { http, createConfig } from 'wagmi';
import { mainnet, base, arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, base, arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID! }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
  },
});
```

#### 2. Contract Interaction Hook (Wagmi v2 + Viem)
```tsx
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';

const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
]);

export function TokenTransferCard({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSend = (recipient: `0x${string}`, amount: bigint) => {
    writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [recipient, amount],
    });
  };

  if (!isConnected) return <p>Please connect your wallet.</p>;

  return (
    <div>
      <p>Balance: {balance?.toString()}</p>
      {isPending && <p>Waiting for signature...</p>}
      {isConfirming && <p>Confirming transaction on-chain...</p>}
      {isSuccess && <p>Transfer completed successfully!</p>}
    </div>
  );
}
```

---

<a name="bahasa-indonesia"></a>
## Bahasa Indonesia

### Integrasi Orkestrasi
- **`senior-frontend`**: Integrasi komponen React dan Next.js untuk antarmuka dApp.
- **`authentication-identity-expert`**: Autentikasi Sign-In with Ethereum (SIWE).
- **`error-resilience-expert`**: Penanganan kegagalan RPC dan penolakan transaksi oleh pengguna.

### Deskripsi
Panduan produksi untuk membangun aplikasi terdesentralisasi (dApp) di jaringan EVM. Mencakup koneksi dompet Web3 via viem, wagmi v2, RainbowKit, interaksi smart contract type-safe, estimasi gas, dan standar token ERC-20/721.

### Kondisi Pemicu
- Mengintegrasikan koneksi dompet Web3 ke aplikasi web.
- Berinteraksi dengan smart contract di jaringan Ethereum, Base, Arbitrum, atau Polygon.
- Menerapkan login dengan dompet kripto (SIWE).
