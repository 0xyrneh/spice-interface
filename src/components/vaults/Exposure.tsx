import { useEffect, useState } from "react";
import Image from "next/image";
import marketplaceExposure from "@/constants/marketplaceExposure";
import collectionExposure from "@/constants/collectionExposure";
import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import UserSVG from "@/assets/icons/user.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { Card } from "@/components/common";
import { PieChart } from "@/components/portfolio";
import { Vault } from "@/types/vault";

type Props = {
  showMarketplace?: boolean;
  showCollection?: boolean;
  vault?: Vault;
  className?: string;
};
export default function Exposure({
  showMarketplace,
  showCollection,
  vault,
  className,
}: Props) {
  const [marketplaceSelected, setMarketplaceSelected] = useState(false);

  useEffect(() => {
    if (showMarketplace && !showCollection) {
      setMarketplaceSelected(true);
    } else if (!showMarketplace && showCollection) {
      setMarketplaceSelected(false);
    }
  }, [showMarketplace, showCollection]);

  return (
    <Card className={`gap-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        {vault && (
          <Image
            className="border-1 border-gray-200 rounded-full"
            src={vault.icon}
            width={16}
            height={16}
            alt=""
          />
        )}
        {marketplaceSelected ? (
          <MarketExposureSVG className="text-white" />
        ) : (
          <UserSVG className="text-white" />
        )}
        <h2 className="block lg:hidden font-bold text-white font-sm whitespace-nowrap">
          {marketplaceSelected ? "MARKETPLACE" : "COLLECTION"} EXP.
        </h2>
        <h2 className="hidden lg:block font-bold text-white font-sm whitespace-nowrap">
          {marketplaceSelected ? "MARKETPLACE" : "COLLECTION"} EXPOSURE
        </h2>
        {showMarketplace && showCollection && (
          <button onClick={() => setMarketplaceSelected(!marketplaceSelected)}>
            <SortUpSVG
              className={`text-gray-100 hover:text-white ${
                marketplaceSelected ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
      <div className="flex gap-2.5">
        <table className="flex-1 text-gray-200 text-xs border-y-1 border-y-gray-200 text-xs font-medium text-white">
          <thead>
            <tr className="table table-fixed w-full text-right border-b-1 border-b-gray-200 text-gray-100">
              <th className="text-left pl-1 h-10 w-[80%]">
                {marketplaceSelected ? "MARKETPLACE" : "COLLECTION"} [
                {marketplaceSelected
                  ? marketplaceExposure.length
                  : collectionExposure.length}
                ]
              </th>
              <th className="h-10 pr-1">%</th>
            </tr>
          </thead>
          <tbody className="block max-h-[240px] overflow-y-auto styled-scrollbars scrollbar scrollbar-track-transparent scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100">
            {(marketplaceSelected
              ? marketplaceExposure
              : collectionExposure
            ).map((exposure, index) => (
              <tr
                key={`vault-${index}`}
                className="table table-fixed w-full text-right"
              >
                <td className="text-left h-10 w-[80%]">
                  <div className="flex items-center gap-2 pl-1">
                    <div
                      className="rounded w-3 h-3"
                      style={{
                        backgroundColor: exposure.color,
                      }}
                    />
                    <span>{exposure.name}</span>
                  </div>
                </td>
                <td className="h-10  pr-1">{exposure.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hidden xl:flex flex-1 max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
          <PieChart
            data={(marketplaceSelected
              ? marketplaceExposure
              : collectionExposure
            ).map((item) => ({
              name: item.name,
              value: item.percent,
              color: item.color,
            }))}
          />
        </div>
      </div>
    </Card>
  );
}
