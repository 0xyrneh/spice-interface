import vaults from "@/constants/vaults";
import { Vault } from "@/types/vault";
import Image from "next/image";
import Link from "next/link";

type Props = {
  onClickVault: (vault: Vault, index: number) => void;
};

const VaultList = ({ onClickVault }: Props) => {
  return (
    <div className="hidden md:flex flex-col font-semibold px-7.5 xl:px-20 pt-[68px] pb-15 xl:py-25">
      <h1 className="text-2.5xl text-yellow text-shadow-yellow font-Sanomat">
        Vault List
      </h1>

      <table className="text-gray font-SuisseIntl text-xs lg:text-sm xl:text-base mx-3.5 xl:mx-5 border-b-1 border-b-gray">
        <thead>
          <tr className="table table-fixed w-full text-right border-b-1 border-b-gray">
            <th className="text-left pl-5 py-2 w-2/5 lg:w-[35%]">Vault</th>
            <th>TVL</th>
            <th>APY</th>
            <th className="hidden lg:table-cell">1d Change</th>
            <th className="hidden lg:table-cell">7d Change</th>
            <th>Creator</th>

            <th className="pr-7.5 xl:pr-12.5 w-[15%]">Receipt Token</th>
          </tr>
        </thead>
        <tbody className="block max-h-[876px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-1 scrollbar-track-gray-100 [&>tr>td]:pt-2.5 [&>:last-child>td]:py-2.5 xl:[&>tr>td]:pt-4 xl:[&>:last-child>td]:py-4">
          {vaults.map((vault, index) => (
            <tr
              key={`vault-${index}`}
              onClick={() => onClickVault(vault, index)}
              className="vault-row table table-fixed w-full text-right cursor-pointer"
            >
              <td className="text-left w-2/5 lg:w-[35%]">
                <div
                  className={`${
                    vault.favorite ? "border-l-yellow" : "border-l-transparent"
                  } border-l-8 flex items-center h-[50px] xl:h-[70px] ml-px gap-5.5 bg-secondary rounded-l pl-5.5 xl:pl-[42px] -mx-px`}
                >
                  <Image src={vault.icon} width={42} height={42} alt="" />
                  {vault.name}
                </div>
              </td>
              <td>
                <div className="flex items-center justify-end h-[50px] xl:h-[70px] bg-secondary px-1 -mx-px">
                  Ξ{vault.tvl}
                </div>
              </td>
              <td>
                <div className="flex items-center justify-end h-[50px] xl:h-[70px] bg-secondary px-1 -mx-px">
                  {vault.apy}%
                </div>
              </td>
              <td
                className={`hidden lg:table-cell ${
                  vault.oneDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                <div className="flex items-center justify-end h-[50px] xl:h-[70px] bg-secondary px-1 -mx-px">
                  {vault.oneDayChange >= 0
                    ? "+" + vault.oneDayChange
                    : vault.oneDayChange}
                  %
                </div>
              </td>
              <td
                className={`hidden lg:table-cell ${
                  vault.sevenDayChange >= 0 ? "text-green" : "text-red"
                }`}
              >
                <div className="flex items-center justify-end h-[50px] xl:h-[70px] bg-secondary px-1 -mx-px">
                  {vault.sevenDayChange >= 0
                    ? "+" + vault.sevenDayChange
                    : vault.sevenDayChange}
                  %
                </div>
              </td>
              <td>
                <div className="flex items-center justify-end h-[50px] xl:h-[70px] bg-secondary px-1 -mx-px">
                  {vault.creator}
                </div>
              </td>
              <td className="w-[15%]">
                <div className="flex items-center justify-end mr-px h-[50px] xl:h-[70px] bg-secondary rounded-r pr-7.5 xl:pr-12.5 -ml-px">
                  {vault.receiptToken}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center mt-8 xl:mt-10 text-shadow-yellow">
        <Link
          target="__blank"
          href="https://docs.spicefi.xyz/"
          className="text-yellow font-SuisseIntl text-base xl:text-1.5xl"
        >
          Want to create your own vault? →
        </Link>
      </div>
    </div>
  );
};

export default VaultList;
