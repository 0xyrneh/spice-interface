import { Vault, ReceiptToken } from "@/types/vault";

const vaults: Vault[] = [
  {
    name: "Prologue Vault",
    tvl: 400,
    apy: 16,
    oneDayChange: -0.02,
    sevenDayChange: 4,
    creator: "Spice",
    receiptToken: ReceiptToken.NFT,
    favorite: true,
    icon: "/assets/images/vaultIcon.svg",
    bg: "/assets/images/bgVaults.png",
  },
  {
    name: "Prologue Leverage Vault",
    tvl: 400,
    apy: 25,
    oneDayChange: -0.05,
    sevenDayChange: 7,
    creator: "Spice",
    receiptToken: ReceiptToken.ERC20,
    favorite: false,
    icon: "/assets/images/vaultIcon.svg",
    bg: "/assets/images/bgVaults1.png",
  },
  // {
  //   name: "Flagship Vault",
  //   tvl: 400,
  //   apy: 18,
  //   oneDayChange: 0.05,
  //   sevenDayChange: -4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults.png",
  // },
  // {
  //   name: "HoneyJar Vault",
  //   tvl: 400,
  //   apy: 30,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 5,
  //   creator: "HoneyJar",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults2.png",
  // },
  // {
  //   name: "Prologue Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: 0.07,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  // },
  // {
  //   name: "Prologue Leverage Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults1.png",
  // },
  // {
  //   name: "Flagship Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults.png",
  // },
  // {
  //   name: "HoneyJar Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "HoneyJar",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults2.png",
  // },
  // {
  //   name: "Prologue Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  // },
  // {
  //   name: "Prologue Leverage Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults1.png",
  // },
  // {
  //   name: "Flagship Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults.png",
  // },
  // {
  //   name: "HoneyJar Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "HoneyJar",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults2.png",
  // },
  // {
  //   name: "Prologue Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  // },
  // {
  //   name: "Prologue Leverage Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults1.png",
  // },
  // {
  //   name: "Flagship Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults.png",
  // },
  // {
  //   name: "HoneyJar Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "HoneyJar",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults2.png",
  // },
  // {
  //   name: "Prologue Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  // },
  // {
  //   name: "Prologue Leverage Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults1.png",
  // },
  // {
  //   name: "Flagship Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults.png",
  // },
  // {
  //   name: "HoneyJar Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "HoneyJar",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults2.png",
  // },
  // {
  //   name: "Prologue Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  // },
  // {
  //   name: "Prologue Leverage Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults1.png",
  // },
  // {
  //   name: "Flagship Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "Spice",
  //   receiptToken: ReceiptToken.ERC20,
  //   favorite: true,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults.png",
  // },
  // {
  //   name: "HoneyJar Vault",
  //   tvl: 400,
  //   apy: 17,
  //   oneDayChange: -0.05,
  //   sevenDayChange: 4,
  //   creator: "HoneyJar",
  //   receiptToken: ReceiptToken.NFT,
  //   favorite: false,
  //   icon: "/assets/images/vaultIcon.svg",
  //   bg: "/assets/images/bgVaults2.png",
  // },
];

export default vaults;
