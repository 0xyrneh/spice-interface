/**
 * Prompt the user to add Ethereum as a network on Metamask, or switch to Ethereum if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (): Promise<boolean> => {
  const provider = (window as any).ethereum;

  if (provider) {
    const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1", 10);

    if (chainId === 5) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x5",
            },
          ],
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    if (chainId === 1) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0x1",
            },
          ],
        });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  } else {
    console.error(
      "Can't setup the Ethereum network on metamask because window.ethereum is undefined"
    );
    return false;
  }
  return false;
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string
) => {
  const tokenAdded = await (window as any).ethereum.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};
