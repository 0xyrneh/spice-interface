import { useState } from "react";
import { useRouter } from "next/router";
import { FaChevronRight } from "react-icons/fa";

import { VaultInfo } from "@/types/vault";
import { News, VaultList } from "@/components/vaults";
import { Button } from "@/components/common";
import { useUI } from "@/hooks";
import { useAppSelector } from "@/state/hooks";
import { DEFAULT_VAULT_BACKGROUND_IMAGE } from "@/config/constants/vault";

export default function Vaults() {
  const [activeVaultIndex, setActiveVaultIndex] = useState(0);
  const [focusedVaultIndex, setFocusedVaultIndex] = useState(-1);

  const router = useRouter();
  const { blur } = useUI();
  const { vaults: vaultsOrigin } = useAppSelector((state) => state.vault);

  const vaults = vaultsOrigin
    .map((row: VaultInfo, id) => {
      let orderIdx = 0;
      if (row.type === "aggregator" && !row.fungible) orderIdx = 0;
      if (row.type === "aggregator" && row.fungible) orderIdx = 1;
      if (row.type !== "aggregator" && !row.deprecated) orderIdx = 2;
      if (row.type !== "aggregator" && row.deprecated) orderIdx = 3;

      return {
        ...row,
        oneDayChange: 0,
        sevenDayChange: 0,
        sponsor: row.sponsor || "SpiceDAO",
        orderIdx: orderIdx,
      };
    })
    .sort((a, b) => (a.orderIdx < b.orderIdx ? -1 : 1));

  const activeVault = vaults[activeVaultIndex];

  return (
    <div
      className={`flex flex-col tracking-wide max-w-[1536px] w-full ${
        blur ? "blur-[5px]" : ""
      }`}
    >
      <div
        className="min-w-[1024px] h-[709.04px] lg:h-[756.04px] xl:h-[982px] 2xl:h-[936.63px] bg-cover hidden sm:flex flex-col-reverse px-8 py-7 gap-3 text-warm-gray-50 font-semibold shadow-black"
        style={{
          backgroundImage: `url(${
            activeVault?.backgroundImage || DEFAULT_VAULT_BACKGROUND_IMAGE
          })`,
          backgroundPosition: "center",
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
                backgroundImage: `url(${
                  vault?.backgroundImage || DEFAULT_VAULT_BACKGROUND_IMAGE
                })`,
                backgroundPosition: "center",
                transition: "transform 450ms",
              }}
              onClick={() => setActiveVaultIndex(index)}
              onMouseEnter={() => setFocusedVaultIndex(index)}
              onMouseLeave={() => setFocusedVaultIndex(-1)}
            >
              <span className="text-sm font-bold whitespace-nowrap overflow-hidden w-full text-ellipsis">
                {vault?.readable || ""}
              </span>
            </Button>
          ))}
        </div>

        {/* active vault info */}
        {activeVault && (
          <>
            <div className="flex items-center mt-3 gap-7">
              <div className="flex flex-col gap-1">
                <span className="text-gray-200 text-sm font-medium">TVL</span>
                <span className="text-xl font-bold">
                  {`Ξ${(activeVault?.tvl || 0)?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-200 text-sm font-medium">
                  HIST.APY
                </span>
                <span className="text-xl font-bold">
                  {`${(activeVault?.historicalApy || 0)?.toFixed(2)}%`}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-gray-200 text-sm font-medium">
                  EST.APY
                </span>
                <span className="text-xl font-bold">
                  {`${(activeVault?.apy || 0)?.toFixed(2)}%`}
                </span>
              </div>
              <Button
                className="flex justify-between h-10 items-center rounded bg-gray-700 bg-opacity-45 px-4 gap-3 box-border"
                hoverClassName="hover:bg-white hover:bg-opacity-20"
                onClick={() => {
                  router.push(`/vault/${activeVault.address}`);
                }}
              >
                <span className="text-sm">View Vault</span>
                <FaChevronRight size={16} />
              </Button>
            </div>
            <h3 className="text-xl font-bold">
              {`By ${activeVault?.sponsor || ""}`}
            </h3>
            <h2 className="text-xl font-bold uppercase">
              {`${activeVault?.readable || ""} ${
                activeVault?.deprecated ? "[WITHDRAW ONLY]" : ""
              }`}
            </h2>
          </>
        )}
      </div>
      <News />
      <VaultList
        onClickVault={(vault) => {
          router.push(`/vault/${vault.address}`);
        }}
      />
    </div>
  );
}
