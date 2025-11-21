export type WalletUXState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'waitingForSignature'
  | 'waitingForTransaction'
  | 'pendingTransaction'
  | 'transactionSuccess'
  | 'transactionError'
  | 'switchingNetwork'
  | 'userRejected'
  | 'error'
  | 'disconnected';

export interface WalletUXConfig {
  provider: any; // EIP-1193 provider
}

export interface WalletStateChangeCallback {
  (state: WalletUXState): void;
}
