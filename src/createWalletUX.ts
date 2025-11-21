import { StateMachine } from './stateMachine';
import type { WalletUXConfig } from './types';

export function createWalletUX(config: WalletUXConfig) {
  const { provider } = config;

  if (!provider) {
    throw new Error('No EIP-1193 provider provided to createWalletUX()');
  }

  const state = new StateMachine();

  // Listen to basic EIP-1193 events (accounts, chain)
  provider.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) state.setState('disconnected');
    else if (state.state === 'idle') state.setState('connected');
    else state.setState('connected');
  });

  provider.on('chainChanged', () => {
    // If chain changes unexpectedly during a tx, consider that "switching"
    if (state.state !== 'idle') state.setState('switchingNetwork');
    setTimeout(() => state.setState('connected'), 300);
  });

  provider.on('disconnect', () => {
    state.setState('disconnected');
  });

  // HIGH-LEVEL ACTIONS --------------------------------------------------------

  async function connect() {
    try {
      state.setState('connecting');

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        state.setState('connected');
        return accounts[0];
      }

      state.setState('error');
      throw new Error('No account returned during connection');
    } catch (err: any) {
      if (err?.code === 4001) {
        state.setState('userRejected');
      } else {
        state.setState('error');
      }
      throw err;
    }
  }

  async function switchNetwork(chainId: number) {
    try {
      state.setState('switchingNetwork');

      const hex = '0x' + chainId.toString(16);

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex }],
      });

      state.setState('connected');
    } catch (err: any) {
      if (err?.code === 4001) {
        state.setState('userRejected');
      } else {
        state.setState('error');
      }
      throw err;
    }
  }

  async function sendTransaction(tx: any) {
    try {
      state.setState('waitingForSignature');

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });

      state.setState('pendingTransaction');

      // Poll for result
      let receipt = null;
      while (!receipt) {
        await new Promise(res => setTimeout(res, 1000));
        receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        });
      }

      if (receipt.status === '0x1' || receipt.status === 1) {
        state.setState('transactionSuccess');
      } else {
        state.setState('transactionError');
      }

      return receipt;
    } catch (err: any) {
      if (err?.code === 4001) {
        state.setState('userRejected');
      } else {
        state.setState('error');
      }
      throw err;
    }
  }

  function reset() {
    state.reset();
  }

  return {
    // state
    state: state.state,
    getState: () => state.state,
    onStateChange: state.onChange.bind(state),

    // actions
    connect,
    sendTransaction,
    switchNetwork,
    reset,
  };
}
