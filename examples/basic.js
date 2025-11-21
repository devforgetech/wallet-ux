import { createWalletUX } from '../dist/index.js';

const wallet = createWalletUX({
  provider: window.ethereum,
});

wallet.onStateChange(state => {
  console.log('UX State:', state);
});

await wallet.connect();
