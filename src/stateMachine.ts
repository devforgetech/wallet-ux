import { WalletUXState, WalletStateChangeCallback } from './types';

export class StateMachine {
  private _state: WalletUXState = 'idle';
  private listeners: WalletStateChangeCallback[] = [];

  get state(): WalletUXState {
    return this._state;
  }

  setState(newState: WalletUXState) {
    if (newState === this._state) return;
    this._state = newState;
    this.listeners.forEach(cb => cb(newState));
  }

  onChange(cb: WalletStateChangeCallback) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  reset() {
    this.setState('idle');
  }
}
