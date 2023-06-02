import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import moment from "moment-timezone";

import { Card, Search, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import ExposureSVG from "@/assets/icons/file.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";
import { VAULT_LOANS } from "@/config/constants/backend";
import {
  getNFTCollectionAddressConvert,
  getNFTCollectionAddressFromSlug,
  getTokenImageFromReservoir,
} from "@/utils/nft";
import { DAY_IN_SECONDS, YEAR_IN_SECONDS } from "@/config/constants/time";
import { getSpiceFiLendingAddress } from "@/utils/addressHelpers";
import { getLoanData } from "@/state/lend/fetchGlobalLend";

type Props = {
  vault: VaultInfo;
  small?: boolean;
  showIcon?: boolean;
  nonExpandedClassName?: string;
  className?: string;
};

export default function LoanAndBidExposure({
  vault,
  small,
  showIcon,
  className,
  nonExpandedClassName,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);

  const { setBlur } = useUI();

  const isLeverageVault = !!vault?.leverage;

  const fetchLoans = async () => {
    setIsFetching(true);

    const apiEnv =
      Number(process.env.REACT_APP_CHAIN_ID) === 1 ? "prod" : "goerli";

    if (!vault?.address) return;
    try {
      const res = await axios.get(
        `${VAULT_LOANS}/${vault?.address}?env=${apiEnv}`
      );
      if (res.status === 200) {
        const loansOrigin = await Promise.all(
          res.data.data.loans.map(async (row: any) => {
            // get onchain loan data
            const lendAddr = getSpiceFiLendingAddress();
            const loanData = await getLoanData(lendAddr, row.loanid);

            let apy = 0;
            if (isLeverageVault) {
              const m = YEAR_IN_SECONDS / loanData.duration;
              // eslint-disable-next-line no-restricted-properties
              apy = 100 * (Math.pow(1 + loanData.interestRate / m, m) - 1);
            } else {
              const m = YEAR_IN_SECONDS / row.duration;
              // eslint-disable-next-line no-restricted-properties
              apy =
                100 *
                (Math.pow(
                  1 + (row.max_loan_size - row.outstanding) / row.outstanding,
                  m
                ) -
                  1);
            }

            const collectionAddr =
              getNFTCollectionAddressConvert(row.collectionAddress) ||
              getNFTCollectionAddressFromSlug(row.slug);

            return {
              name: row.collectionName,
              slug: row.slug,
              collectionAddr: collectionAddr,
              displayName: `${row.collectionName}#${row.nftid}`,
              principal: row.outstanding,
              matureDate: !isLeverageVault
                ? row.start + row.duration
                : loanData.startedAt + loanData.duration - 14 * DAY_IN_SECONDS,
              nftId: row.nftid,
              apy,
              tokenImg: getTokenImageFromReservoir(collectionAddr, row.nftid),
            };
          })
        );
        setLoans([...loansOrigin]);
      }
    } catch {
      console.log("loans fetching error");
    }
    setIsFetching(false);
  };

  const formatMaturity = (date: number) => {
    if (!date) return "";
    const now = moment();
    const matureDate = moment(date);
    const timeLeft = moment.duration(matureDate.diff(now));

    const dayLeft = Math.floor(timeLeft.asDays());

    if (dayLeft > 0) return `${dayLeft}d`;
    return "0";
  };

  useEffect(() => {
    setLoans([]);
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address]);

  useEffect(() => {
    setBlur(expanded);
  }, [expanded, setBlur]);

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: "TYPE",
        key: "type",
        rowClass: () => "w-[60px]",
      },
      {
        title: `ASSETS [${loans.length}]`,
        key: "displayName",
        headerClass: "!justify-start",
        itemClass: () => "!justify-start",
        itemPrefix: (item) => {
          return (
            <>
              {item.tokenImg && (
                <Image
                  className="mr-1 border-1 border-gray-200 rounded-full"
                  src={item.tokenImg}
                  width={16}
                  height={16}
                  alt=""
                />
              )}
            </>
          );
        },
      },
      {
        title: "PRINCIPAL",
        key: "principal",
        itemPrefix: () => "Ξ",
        rowClass: () => "w-[90px] xl:w-[14%]",
        format: (item) => {
          return (item?.principal || 0).toFixed(2);
        },
      },
      {
        title: "LTV",
        key: "ltv",
        itemSuffix: () => "%",
        rowClass: () => "hidden lg:table-cell w-[70px] xl:w-[14%]",
        format: (item) => {
          return (item?.ltv || 0).toFixed(1);
        },
      },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
        rowClass: () => "w-[70px] xl:w-[14%]",
        format: (item) => {
          return (item?.apy || 0).toFixed(1);
        },
      },
      {
        title: "TIME LEFT",
        key: "matureDate",
        rowClass: () => "w-[90px] xl:w-[14%]",
        format: (item) => {
          return formatMaturity(item?.matureDate || 0);
        },
      },
    ];
  };

  return (
    <Card
      className={`gap-3 overflow-hidden ${className} ${
        nonExpandedClassName && !expanded ? nonExpandedClassName : ""
      }`}
      expanded={expanded}
      onCollapse={() => setExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-white">
          {showIcon && (
            <Image
              className="border-1 border-gray-200 rounded-full"
              src={vault.logo}
              width={16}
              height={16}
              alt=""
            />
          )}
          <ExposureSVG />
          <h2
            className={`font-bold text-white font-sm ${
              small ? "hidden lg:block" : ""
            }`}
          >
            LOAN & BID EXPOSURE
          </h2>
          {small && (
            <h2 className="lg:hidden font-bold text-white font-sm">
              LOAN EXP.
            </h2>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex">
        <Search placeholder="Search loans" />
      </div>
      <Table
        containerClassName="flex-1"
        className="block h-full"
        rowInfos={getRowInfos()}
        items={loans.map((loan) => ({
          ...loan,
          type: "LOAN",
        }))}
        trStyle="h-10"
        rowStyle="h-8"
        defaultSortKey="apy"
        bodyClass="h-[calc(100%-40px)]"
        isLoading={isFetching}
      />
    </Card>
  );
}
