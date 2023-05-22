import { tokenIcons } from "@/config/constants/assets";

export interface TokenInfo {
  key: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  balance: number;
  icon: string;
}

export const tokenList: TokenInfo[] = [
  {
    key: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 20282.7,
    priceChange: 3.54,
    balance: 0.04,
    icon: tokenIcons.btc,
  },

  {
    key: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: 1209.7,
    priceChange: 2.13,
    balance: 1.68,
    icon: tokenIcons.eth,
  },
  {
    key: "3",
    name: "Solana",
    symbol: "SOL",
    price: 12.7,
    priceChange: -0.54,
    balance: 20.55,
    icon: tokenIcons.sol,
  },
];
