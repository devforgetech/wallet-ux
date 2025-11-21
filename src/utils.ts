export function parseChainId(chainId: string | number) {
  if (typeof chainId === 'number') return chainId;
  if (typeof chainId === 'string' && chainId.startsWith('0x')) return parseInt(chainId, 16);
  return Number(chainId);
}
