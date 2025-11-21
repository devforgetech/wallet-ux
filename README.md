# ⚡ wallet-ux

### Universal Web3 Wallet UX State Machine (EIP-1193 Compatible)

`wallet-ux` is a tiny, zero-dependency TypeScript library that normalizes **user-facing wallet behavior** across all EIP-1193 providers.

It gives developers a consistent set of UX states like:

- `connecting`
- `connected`
- `waitingForSignature`
- `pendingTransaction`
- `userRejected`
- `transactionSuccess`
- `transactionError`
- `switchingNetwork`
- `disconnected`
- `error`

Something **no existing library** (wagmi, viem, ethers.js, web3.js) provides.

---

## 🚀 Features

- ⚡ **Universal UX state machine** for all wallets
- 🔌 Works with **MetaMask, Coinbase, Rabby, Frame, WalletConnect, Brave, OKX**
- 🧩 **Zero dependencies**
- 🟦 Full **TypeScript** support
- 🌍 Framework-agnostic (React/Vue/Svelte wrappers optional)
- 📦 Lightweight (< 5 KB)
- 🔁 Consistent behavior across all wallets

---

## 📦 Installation

```bash
npm install wallet-ux
```

---

## 📝 Usage

```ts
import { createWalletUX } from 'wallet-ux';

const wallet = createWalletUX({
  provider: window.ethereum,
});

wallet.onStateChange(state => {
  console.log('UX State:', state);
});

await wallet.connect();

await wallet.sendTransaction({
  to: '0x...',
  value: '0x1',
});
```

---

## 🎛 Available UX States

```
idle
connecting
connected
waitingForSignature
waitingForTransaction
pendingTransaction
transactionSuccess
transactionError
switchingNetwork
userRejected
error
disconnected
```

These states eliminate hundreds of lines of custom wallet-handling logic.

---

## 🔧 API Overview

### `createWalletUX({ provider })`

Returns:

```ts
{
  getState(): WalletUXState;
  onStateChange(cb: (state) => void): void;
  connect(): Promise<string>;
  sendTransaction(tx): Promise<any>;
  switchNetwork(chainId: number): Promise<void>;
  reset(): void;
}
```

---

## ⚛ React Hook (optional)

Install:

```bash
npm install wallet-ux-react
```

Usage:

```ts
const { state, connect } = useWalletUX(window.ethereum);
```

---

## 📚 Examples

See the `/examples` folder in the repo:

- `basic.js` – minimal integration example
- More framework examples coming soon

---

## 🤝 Contributing

PRs are welcome!  
If this project helps you, please ⭐ **star the repo** — it helps visibility and adoption.

---

## 📄 License

MIT License  
© 2025
