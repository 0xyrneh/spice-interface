import { useEffect, useState } from "react";
import Image from "next/image";
import useBreakpoint from "use-breakpoint";
import moment from "moment";
import { useWeb3React } from "@web3-react/core";

import { CopyClipboard, Card, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import { BREAKPOINTS } from "@/constants";
import { getExpolorerUrl } from "@/utils/string";
import { shortAddress } from "@/utils";
import { getUserTxHistories } from "@/api/subgraph";
import { getBalanceInEther } from "@/utils/formatBalance";
import { getVaultNameFromAddress } from "@/utils/vault";

type Props = {
  accountImage?: string;
  showDetails?: boolean;
  onShowDetails?: () => void;
  onHideDetails?: () => void;
};

export default function AccountInfo({
  accountImage,
  showDetails,
  onShowDetails,
  onHideDetails,
}: Props) {
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const [txHistories, setTxHistories] = useState<any[]>([]);

  const { account } = useWeb3React();
  const { breakpoint } = useBreakpoint(BREAKPOINTS);

  const fetchTxHistories = async () => {
    if (!showDetails) return [];

    setIsFetching(true);
    if (!account) return;
    const txHistoryRes = await getUserTxHistories(account);

    const userTxHistories = txHistoryRes.map((row: any) => {
      return {
        time: row.timestamp,
        amount: getBalanceInEther(row.amount),
        txType: row.type,
        txHash: row.txHash,
        vaultType: getVaultNameFromAddress(row.vault.address),
      };
    });

    setTxHistories(userTxHistories);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchTxHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: "DATETIME",
        key: "time",
        headerClass: "pr-3",
        itemClass: () => "pr-3",
        rowClass: () => "!w-[100px] !xl:w-[120px]",
        format: (item) => {
          if (breakpoint === "2xl")
            return moment.unix(Number(item.time)).format("M/DD/YYYY HH:mm:ss");
          if (breakpoint === "xl")
            return moment.unix(Number(item.time)).format("M/DD/YYYY HH:mm");
          if (breakpoint === "lg")
            return moment.unix(Number(item.time)).format("M/DD/YYYY HH:mm");
          if (breakpoint === "md")
            return moment.unix(Number(item.time)).format("M/DD/YYYY HH:mm");

          return moment.unix(Number(item.time)).format("M/DD/YYYY HH:mm:ss A");
        },
      },
      {
        title: "HASH",
        key: "txHash",
        headerClass: "!justify-start pr-3",
        itemClass: () => "!justify-start pr-3",
        rowClass: () => "w-[60px] lg:w-[21%] 2xl:w-[21%]",
        format: (item) => {
          let txHash = shortAddress(item.txHash, 8, -6);
          if (breakpoint === "md" || breakpoint === "sm")
            txHash = shortAddress(item.txHash, 5, -3);
          if (breakpoint === "lg") txHash = shortAddress(item.txHash, 5, -3);

          return (
            <a
              className="underline"
              href={getExpolorerUrl(item.txHash)}
              rel="noopener noreferrer"
              target="_blank"
            >
              {txHash}
            </a>
          );
        },
      },
      {
        title: "TRANSACTION",
        key: "txType",
        headerClass: "!justify-start pr-3",
        itemClass: () => "!justify-start pr-3",
        rowClass: () => "w-[60px] lg:w-[21%] 2xl:w-[21%]",
        format: (item) => item.txType,
      },
      {
        title: "VAULT",
        key: "vaultType",
        headerClass: "!justify-start 2xl:pl-[0px] pr-3",
        itemClass: () => "!justify-start 2xl:pl-[0px] pr-3",
        rowClass: () => "w-[60px] lg:w-[21%] 2xl:w-[21%]",
        format: (item) => `${item.vaultType} Vault`,
      },
      {
        title: "AMOUNT",
        key: "amount",
        rowClass: () => "w-[60px] lg:w-[12%] 2xl:w-[12%]",
        format: (item) => `Ξ${item.amount.toFixed(2)}`,
      },
    ];
  };

  if (!account) return null;

  return (
    <Card
      className={`!py-3 items-center w-full gap-3
       ${showDetails ? "absolute top-0 !z-50 bg-opacity-95" : ""}`}
      onMouseLeave={onHideDetails}
    >
      <div className="flex justify-between items-center gap-5 !flex-row w-full">
        <div
          className={`flex items-center gap-5 flex-1 
          ${showDetails ? "" : "cursor-pointer"}`}
          onMouseEnter={onShowDetails}
        >
          {accountImage ? (
            <Image
              className="border-1 border-orange-200 rounded-full drop-shadow-orange-200"
              src={accountImage!}
              width={40}
              height={40}
              alt=""
            />
          ) : (
            <Image
              className=""
              src="/assets/images/profile.svg"
              width={52}
              height={52}
              alt=""
            />
          )}
          <span className="hidden 3xl:flex font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
            {shortAddress(account, 18, -16)}
          </span>
          <span className="hidden lg:flex 3xl:hidden font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
            {shortAddress(account, 10, -10)}
          </span>
          <span className="lg:hidden font-bold text-base text-orange-200 text-shadow-orange-200 max-w-[60%]">
            {shortAddress(account, 10, account.length)}
          </span>
        </div>
        <CopyClipboard text={account} className="min-w-[24px] min-w-[24px]" />
      </div>

      {showDetails && (
        <>
          <div className="flex items-center w-full">
            <Image
              className="mr-[10px]"
              src="/assets/icons/tx-history.svg"
              width={16}
              height={16}
              alt=""
            />
            <h2 className="font-bold text-white font-sm">
              TRANSACTION HISTORY
            </h2>
          </div>
          <Table
            containerClassName="flex-1"
            className="block h-full"
            rowInfos={getRowInfos()}
            items={txHistories}
            trStyle="h-10"
            rowStyle="h-8"
            defaultSortKey="time"
            bodyClass="h-[calc(26vh)]"
            isLoading={isFetching}
          />
        </>
      )}
    </Card>
  );
}
