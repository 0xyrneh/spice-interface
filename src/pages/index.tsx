import { useState } from "react";
import { useRouter } from "next/router";
import vaults from "@/constants/vaults";
import { FaChevronRight } from "react-icons/fa";
import { Vault } from "@/types/vault";
import { News, VaultList } from "@/components/vaults";
import { Button } from "@/components/common";

export default function VaultInfo() {
  const router = useRouter();

  const [activeVaultIndex, setActiveVaultIndex] = useState(0);
  const [focusedVaultIndex, setFocusedVaultIndex] = useState(-1);

  const getActiveVault = () => vaults[activeVaultIndex];
  const getVaultBackground = (vault?: Vault) =>
    (vault ?? getActiveVault()).bg ?? "/assets/images/bgEmptyVault.png";

  return (
    <div className="flex flex-col tracking-wide max-w-[1536px] w-full">
      <div
        className="min-w-[1024px] h-[709.04px] lg:h-[756.04px] xl:h-[982px] 2xl:h-[936.63px] bg-cover hidden sm:flex flex-col-reverse px-8 py-7 gap-3 text-warm-gray-50 font-semibold shadow-black"
        style={{
          backgroundImage: `url(${getVaultBackground()})`,
        }}
      >
        <div
          className={`flex gap-3 pt-3 ${
            vaults.length < 5 ? "justify-center" : ""
          }`}
        >
          {vaults.slice(0, 5).map((vault, index) => (
            <Button
              key={`vault-${index}`}
              className={`flex flex-col-reverse h-[144px] xl:h-[176px] bg-cover w-[calc(20%-9.6px)] min-w-[calc(20%-9.6px)] p-3 rounded border-1 text-left shadow-black
              ${
                activeVaultIndex === index
                  ? "drop-shadow-orange-200 border-orange-200 border-opacity-50"
                  : "border-gray-500 border-opacity-90"
              } ${
                activeVaultIndex === index && focusedVaultIndex === -1
                  ? "-translate-y-2"
                  : ""
              }`}
              hoverClassName="hover:drop-shadow-sm hover:border-white hover:-translate-y-2"
              clickClassName="hover:drop-shadow-orange-200 hover:border-orange-200"
              style={{
                backgroundImage: `url(${getVaultBackground(vault)})`,
                transition: "transform 450ms",
              }}
              onClick={() => setActiveVaultIndex(index)}
              onMouseEnter={() => setFocusedVaultIndex(index)}
              onMouseLeave={() => setFocusedVaultIndex(-1)}
            >
              <span className="text-sm font-bold whitespace-nowrap overflow-hidden w-full text-ellipsis">
                {vault.name}
              </span>
            </Button>
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
          <Button
            className="flex justify-between h-10 items-center rounded bg-gray-700 bg-opacity-45 px-4 gap-3 box-border"
            hoverClassName="hover:bg-white hover:bg-opacity-20"
          >
            <span className="text-sm">View Vault</span>
            <FaChevronRight size={16} />
          </Button>
        </div>
        <h3 className="text-xl font-bold">By {getActiveVault().creator}</h3>
        <h2 className="text-xl font-bold">
          {getActiveVault().name.toUpperCase()}
        </h2>
      </div>
      <News />
      <VaultList
        onClickVault={(vault) => {
          router.push(`/vault/${vault.id}`);
        }}
      />
    </div>
  );
}
