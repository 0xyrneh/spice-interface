import { useState } from "react";
import vaults from "@/constants/vaults";
import Image from "next/image";
import { Vault } from "@/types/vault";
import { News, VaultList, VaultFooter } from "@/components/vaults";
import { NotSupported } from "@/components";

export default function VaultInfo() {
  const [activeVaultIndex, setActiveVaultIndex] = useState(0);

  const getActiveVault = () => vaults[activeVaultIndex];
  const getVaultBackground = (vault?: Vault) =>
    (vault ?? getActiveVault()).bg ?? "/assets/images/bgEmptyVault.png";

  return (
    <div className="flex flex-col tracking-wide">
      <div
        className="aspect-[1930/1080] bg-cover hidden md:flex flex-col-reverse px-7.5 xl:px-20 py-7.5 xl:py-16 gap-2.5 xl:gap-3.5 text-light font-Sanomat font-semibold"
        style={{
          backgroundImage: `url(${getVaultBackground()})`,
        }}
      >
        <div
          className={`flex px-2.5 xl:px-5 gap-2.5 lg:gap-4.5 xl:gap-[22px] pt-6 xl:pt-9 overflow-x-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-1 scrollbar-track-gray-100 pb-2 ${
            vaults.length < 5 ? "justify-center" : ""
          }`}
        >
          {vaults.map((vault, index) => (
            <button
              key={`vault-${index}`}
              className="flex flex-col-reverse aspect-[328/219] bg-cover w-[calc(20%-25px)] min-w-[calc(20%-25px)] px-4 py-[26px] text-xs lg:text-sm xl:text-lg rounded shadow-sm hover:drop-shadow-sm hover:border-1 hover:border-light hover:-translate-y-2 text-left"
              style={{
                backgroundImage: `url(${getVaultBackground(vault)})`,
              }}
              onClick={() => setActiveVaultIndex(index)}
            >
              <span className="hidden xl:block">
                {vault.name.length > 27
                  ? `${vault.name.substring(0, 27)}...`
                  : vault.name}
              </span>
              <span className="hidden lg:block xl:hidden">
                {vault.name.length > 22
                  ? `${vault.name.substring(0, 22)}...`
                  : vault.name}
              </span>

              <span className="lg:hidden">
                {vault.name.length > 19
                  ? `${vault.name.substring(0, 19)}...`
                  : vault.name}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center mt-3 xl:mt-5 font-SuisseIntl gap-10 xl:gap-15">
          <div className="flex flex-col gap-2">
            <span className="text-gray text-sm xl:text-xl">TVL</span>
            <span className="text-sm xl:text-1.5xl">
              Ξ{getActiveVault().tvl}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-gray text-sm xl:text-xl">APY</span>
            <span className="text-sm xl:text-1.5xl">
              {getActiveVault().apy}%
            </span>
          </div>
          <button className="flex justify-between items-center rounded bg-secondary bg-opacity-45 px-4.5 py-3 gap-16 box-border hover:border-1 hover:border-light">
            <span className="font-Sanomat text-sm xl:text-xl">View Vault</span>
            <Image
              src="/assets/icons/arrowRight.svg"
              width={18}
              height={14}
              alt=""
            />
          </button>
        </div>
        <h3 className="text-base xl:text-2xl font-SuisseIntl">
          BY {getActiveVault().creator.toUpperCase()}
        </h3>
        <h2 className="text-xl xl:text-2.5xl">{getActiveVault().name}</h2>
      </div>
      <News />
      <VaultList
        onClickVault={(_, index) => {
          setActiveVaultIndex(index);
        }}
      />
      <VaultFooter />

      <NotSupported />
    </div>
  );
}