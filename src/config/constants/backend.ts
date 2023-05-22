export const backendServerUrl =
  process.env.NEXT_PUBLIC_BACKEND_SERVER_URL || "http://localhost:5000";
export const BACKEND_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

// vault API URLS
export const OFFCHAIN_VAULT_API = `${BACKEND_SERVER_URL}/api/off-chain-vaults`;

export const VAULT_LOANS = `${BACKEND_SERVER_URL}/api/vaults/loans`;
export const VAULT_RESULT_API = `${BACKEND_SERVER_URL}/api/vaults`;

// leverage API URLS
export const LEVERAGE_API_BASE = `${BACKEND_SERVER_URL}/api/loan`;
export const LEVERAGE_API_TERMS = `${LEVERAGE_API_BASE}/terms`;

// collection API URLS
export const COLLECTION_API_BASE = `${BACKEND_SERVER_URL}/api/collections`;

// reservoir API
export const RESERVOIR_API_BASE = "https://api.reservoir.tools";
export const RESERVOIR_API_TOKENS_BASE = `${RESERVOIR_API_BASE}/redirect/tokens`;
