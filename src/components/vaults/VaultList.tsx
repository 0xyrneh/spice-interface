import vaults from "@/constants/vaults";
import { Vault } from "@/types/vault";
import Image from "next/image";
import Link from "next/link";

type Props = {
  onClickVault: (vault: Vault, index: number) => void;
};

const VaultList = ({ onClickVault }: Props) => {
  return (
    <div className="hidden sm:flex flex-col text-white font-medium px-8 pt-[72px] pb-6 gap-4">
      <h1 className="text-xl text-orange-200 font-bold text-shadow-orange-200">
        VAULT LIST
      </h1>

      <table className="text-gray-200 text-xs border-y-1 border-y-gray-200">
        <thead>
          <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200">
            <th className="text-left pl-1 lg:w-[35%] h-14">Vault</th>
            <th className="h-14">TVL</th>
            <th className="h-14">APY</th>
            <th className="hidden md:table-cell h-14">1d Change</th>
            <th className="hidden md:table-cell h-14">7d Change</th>
            <th className="h-14 hidden md:table-cell">Creator</th>
            <th className="h-14">Receipt</th>
            <th className="h-14">Deposit</th>
          </tr>
        </thead>
        <tbody className="block max-h-[728px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
          {vaults.map((vault, index) => (
            <tr
              key={`vault-${index}`}
              onClick={() => onClickVault(vault, index)}
              className="vault-row table table-fixed w-full text-right cursor-pointer"
            >
              <td className="text-left lg:w-[35%] h-14">
                <div className="flex items-center gap-2 pl-1">
                  <Image src={vault.icon} width={16} height={16} alt="" />
                  {vault.name}
                </div>
              </td>
              <td className="h-14">Ξ{vault.tvl}</td>
              <td className="h-14">{vault.apy}%</td>
              <td
                className={`h-14 hidden md:table-cell ${
                  vault.oneDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                {vault.oneDayChange >= 0
                  ? "+" + vault.oneDayChange
                  : vault.oneDayChange}
                %
              </td>
              <td
                className={`h-14 hidden md:table-cell ${
                  vault.sevenDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                {vault.sevenDayChange >= 0
                  ? "+" + vault.sevenDayChange
                  : vault.sevenDayChange}
                %
              </td>
              <td className="h-14 hidden md:table-cell">{vault.creator}</td>
              <td className="h-14">{vault.receiptToken}</td>
              <td className="h-14">
                <button className="border-1 border-orange-900 rounded p-1 bg-orange-900 bg-opacity-10 shadow-orange-900">
                  <span className="text-xs text-orange-900">DEPOSIT</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultList;
