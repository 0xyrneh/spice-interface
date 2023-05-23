export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.GOERLI]: 'goerli',
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[];

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.MAINNET];

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [SupportedChainId.MAINNET] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];
