import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

import { VaultInfo } from "@/types/vault";
import { Button, Card, Search, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import ExposureSVG from "@/assets/icons/exposure.svg";
import { useUI } from "@/hooks";

type Props = {
  vaults: VaultInfo[];
  selectedVault?: VaultInfo | undefined;
  onSelectVault: (vault: VaultInfo | undefined) => void;
};

export default function VaultsTable({
  vaults,
  selectedVault,
  onSelectVault,
}: Props) {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { account } = useWeb3React();
  const router = useRouter();
  const { showDepositModal, showConnectModal } = useUI();

  useEffect(() => {
    setTimeout(() => {
      setIsFetching(false);
    }, 2500);
  }, []);

  useEffect(() => {
    if (!account) return;
    setIsFetching(true);

    setTimeout(() => {
      setIsFetching(false);
    }, 2500);
  }, [account]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `VAULTS [${vaults.length}]`,
        key: "readable",
        itemPrefix: (item) => (
          <Image
            className="mr-2 border-1 border-gray-200 rounded-full"
            src={item.logo}
            width={20}
            height={20}
            alt=""
          />
        ),
        format: (item) => {
          return `${item?.readable || ""} ${
            item?.deprecated ? "[WITHDRAW ONLY]" : ""
          }`;
        },
      },
      {
        title: "POSITION",
        key: "userPosition",
        rowClass: () => "hidden lg:table-cell w-[85px]",
        itemPrefix: () => "Ξ",
        format: (item) => {
          return (item?.userPosition || 0).toFixed(2);
        },
      },
      {
        title: "TVL",
        key: "tvl",
        rowClass: () => "hidden 3xl:table-cell  w-[75px]",
        itemPrefix: () => "Ξ",
        format: (item) => {
          return (item?.tvl || 0).toFixed(2);
        },
      },
      {
        title: "APY",
        key: "apy",
        rowClass: () => "hidden xl:table-cell w-[75px]",
        itemSuffix: () => "%",
        format: (item) => (item?.apy || 0).toFixed(2),
      },
      {
        title: "RECEIPT",
        key: "receiptToken",
        rowClass: () => "hidden 2xl:table-cell  w-[75px]",
      },
      {
        title: "DETAILS",
        noSort: true,
        rowClass: () => "w-[70px]",
        component: (item) => (
          <Button
            type="secondary"
            className="px-1 h-[22px]"
            onClick={() => {
              router.push(`/vault/${item.id}`);
            }}
          >
            <span className="text-xs font-bold">DETAILS</span>
          </Button>
        ),
      },
      {
        title: "DEPOSIT",
        noSort: true,
        rowClass: () => "w-[90px]",
        component: (item) => (
          <Button
            type="primary"
            className="px-1 h-[22px]"
            onClick={(e) => {
              e.stopPropagation();
              if (account) {
                showDepositModal({ vault: item });
              } else {
                showConnectModal();
              }
            }}
          >
            <span className="text-xs font-bold">
              {account ? (item.deprecated ? "WITHDRAW" : "DEPOSIT") : "CONNECT"}
            </span>
          </Button>
        ),
      },
    ];
  };

  return (
    <Card className="gap-3 overflow-hidden min-h-[300px] flex-1">
      <div className="flex items-center gap-2.5">
        <ExposureSVG />
        <h2 className="font-bold text-white font-sm">SELECT YOUR VAULT</h2>
      </div>
      <div className="flex items-center justify-between gap-5">
        <Search
          placeholder="Search your Vaults"
          className="hidden xl:flex flex-1 xl:flex-none"
        />
        <Button
          type={!selectedVault ? "third" : "secondary"}
          className="flex-1 xl:flex-none xl:w-[170px] h-8 text-xs font-bold"
          onClick={() => onSelectVault(undefined)}
          disabled={!selectedVault}
        >
          TOTAL SPICE POSITION
        </Button>
      </div>
      <Table
        containerClassName="flex-1"
        className="block h-full"
        rowInfos={getRowInfos()}
        items={vaults}
        trStyle="h-10"
        rowStyle="h-8"
        defaultSortKey="apy"
        bodyClass="h-[calc(100%-40px)]"
        isActive={(item) => {
          return !!selectedVault && item.id === selectedVault.id;
        }}
        isLoading={isFetching}
        walletConnectRequired={true}
        onClickItem={(item) => {
          onSelectVault(item);
        }}
      />
    </Card>
  );
}
