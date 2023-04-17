import { useState } from "react";
import vaults from "@/constants/vaults";
import { FaChevronRight } from "react-icons/fa";
import { Vault } from "@/types/vault";
import { News, VaultList } from "@/components/vaults";
import { NotSupported } from "@/components";

export default function VaultInfo() {
  const [activeVaultIndex, setActiveVaultIndex] = useState(0);

  const getActiveVault = () => vaults[activeVaultIndex];
  const getVaultBackground = (vault?: Vault) =>
    (vault ?? getActiveVault()).bg ?? "/assets/images/bgEmptyVault.png";

  return (
    <div className="flex flex-col tracking-wide max-w-[1512px] w-full">
      <div
        className="min-w-[960px] aspect-[1930/1080] bg-cover hidden sm:flex flex-col-reverse px-8 py-7 gap-3 text-orange-50 font-semibold"
        style={{
          backgroundImage: `url(${getVaultBackground()})`,
        }}
      >
        <div
          className={`flex gap-3 pt-3 overflow-x-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 pb-2 ${
            vaults.length < 5 ? "justify-center" : ""
          }`}
        >
          {vaults.map((vault, index) => (
            <button
              key={`vault-${index}`}
              className="flex flex-col-reverse h-[144px] xl:h-[176px] bg-cover w-[calc(20%-9.6px)] min-w-[calc(20%-9.6px)] p-3 rounded hover:drop-shadow-sm border-1 border-gray-200 border-opacity-50 hover:border-orange-50 hover:-translate-y-2 text-left"
              style={{
                backgroundImage: `url(${getVaultBackground(vault)})`,
              }}
              onClick={() => setActiveVaultIndex(index)}
            >
              <span className="text-sm font-bold whitespace-nowrap overflow-hidden w-full text-ellipsis">
                {vault.name}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center mt-3 gap-7">
          <div className="flex flex-col gap-1">
            <span className="text-gray-200 text-sm font-medium">TVL</span>
            <span className="text-xl font-bold">Ξ{getActiveVault().tvl}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-200 text-sm font-medium">APY</span>
            <span className="text-xl font-bold">{getActiveVault().apy}%</span>
          </div>
          <button className="flex justify-between h-10 items-center rounded bg-gray-700 bg-opacity-45 px-4 gap-3 box-border hover:border-1 hover:border-orange-50">
            <span className="text-sm">View Vault</span>
            <FaChevronRight size={16} />
          </button>
        </div>
        <h3 className="text-xl font-bold">By {getActiveVault().creator}</h3>
        <h2 className="text-xl font-bold">{getActiveVault().name}</h2>
      </div>
      <News />
      <VaultList
        onClickVault={(_, index) => {
          setActiveVaultIndex(index);
        }}
      />

      <NotSupported />
    </div>
  );
}
