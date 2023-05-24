import { useEffect, useState } from "react";
import Image from "next/image";
import marketplaceExposure from "@/constants/marketplaceExposure";
import collectionExposure from "@/constants/collectionExposure";
import MarketExposureSVG from "@/assets/icons/market-exposure.svg";
import UserSVG from "@/assets/icons/user.svg";
import SortUpSVG from "@/assets/icons/sort-up2.svg";
import { Card } from "@/components/common";
import { PieChart } from "@/components/portfolio";
import { VaultInfo } from "@/types/vault";
import Table, { TableRowInfo } from "../common/Table";

type Props = {
  showMarketplace?: boolean;
  showCollection?: boolean;
  vault?: VaultInfo;
  className?: string;
  isBreakdown?: boolean;
};

export default function Exposure({
  showMarketplace,
  showCollection,
  vault,
  className,
  isBreakdown,
}: Props) {
  const [marketplaceSelected, setMarketplaceSelected] = useState(false);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: marketplaceSelected
          ? `MARKETPLACES [${marketplaceExposure.length}]`
          : `COLLECTIONS [${collectionExposure.length}]`,
        key: "name",
        noSort: true,
        itemPrefix: (item) => (
          <div
            className="rounded w-3 h-3 mr-2"
            style={{
              backgroundColor: item.color,
            }}
          />
        ),
        rowClass: () => "w-[80%]",
      },
      {
        title: "%",
        key: "percent",
        noSort: true,
        itemSuffix: () => "%",
      },
    ];
  };

  useEffect(() => {
    if (showMarketplace && !showCollection) {
      setMarketplaceSelected(true);
    } else if (!showMarketplace && showCollection) {
      setMarketplaceSelected(false);
    }
  }, [showMarketplace, showCollection]);

  return (
    <Card className={`gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 font-bold text-white font-sm whitespace-nowrap leading-[18px]">
        {vault && (
          <Image
            className="border-1 border-gray-200 rounded-full"
            src={vault.logo}
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

        <h2 className="block lg:hidden">
          {marketplaceSelected
            ? isBreakdown
              ? "MRKTPLACE"
              : "MARKET"
            : isBreakdown
            ? "COLLECTION"
            : "NFT"}{" "}
          {isBreakdown ? "B/D" : "EXP."}
        </h2>
        <h2 className="hidden lg:block xl:hidden">
          {marketplaceSelected
            ? isBreakdown
              ? "MRKTPLACE"
              : "MARKETPLACE"
            : "COLLECTION"}{" "}
          {isBreakdown ? "BREAKDOWN" : "EXP."}
        </h2>
        <h2 className="hidden xl:block">
          {marketplaceSelected ? "MARKETPLACE" : "COLLECTION"}{" "}
          {isBreakdown ? "BREAKDOWN" : "EXPOSURE"}
        </h2>
        {(showMarketplace || showCollection) && (
          <button onClick={() => setMarketplaceSelected(!marketplaceSelected)}>
            <SortUpSVG
              className={`text-gray-100 hover:text-white ${
                marketplaceSelected ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
      <div className="flex gap-2.5 overflow-hidden">
        <Table
          containerClassName="flex-1"
          className="block h-full"
          rowInfos={getRowInfos()}
          items={marketplaceSelected ? marketplaceExposure : collectionExposure}
          trStyle="h-10"
          bodyClass="h-full no-scroll"
        />
        <div className="hidden xl:flex flex-1 min-h-[160px] 3xl:min-h-[220px] max-w-[160px] 3xl:max-w-[220px] items-center justify-center">
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
