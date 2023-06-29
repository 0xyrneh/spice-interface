import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import moment from "moment-timezone";
import { useWindowSize } from "@react-hookz/web";

import { Card, Search, Table } from "@/components/common";
import { TableRowInfo } from "@/components/common/Table";
import ExposureSVG from "@/assets/icons/exposure.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";
import { VAULT_LOANS } from "@/config/constants/backend";
import { getSpiceFiLendingAddress } from "@/utils/addressHelpers";
import {
  getTokenImageFromReservoir,
  getNFTCollectionAddressFromSlug,
  getNFTCollectionAddressConvert,
  getNftMarketLogo,
} from "@/utils/nft";
import { DAY_IN_SECONDS, YEAR_IN_SECONDS } from "@/config/constants/time";
import { getLoanDataFromCallData } from "@/state/lend/fetchGlobalLend";
import { useAppSelector } from "@/state/hooks";

type Props = {
  vault: VaultInfo;
  small?: boolean;
  showIcon?: boolean;
  nonExpandedClassName?: string;
  className?: string;
  headerClassName?: string;
  walletConnectRequired?: boolean;
  isBreakdown?: boolean;
  onActive: () => void;
  onCardPopup: (status: boolean) => void;
};

export default function LoanBreakdown({
  vault,
  small,
  showIcon,
  className,
  headerClassName,
  nonExpandedClassName,
  walletConnectRequired,
  isBreakdown,
  onActive,
  onCardPopup,
}: Props) {
  const size = useWindowSize();
  const { setBlur } = useUI();

  const [loanExpanded, setLoanExpanded] = useState(false);
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const [loans, setLoans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { collections, allNfts } = useAppSelector((state) => state.nft);

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
        const loans = res.data.data.loans;
        const prologueLoans = loans.filter(
          (loan: any) => loan.collectionName === "Prologue"
        );

        // fetch onchain loan data
        const prologueLoansData = await getLoanDataFromCallData(
          prologueLoans.map((row: any) => {
            return {
              address: getSpiceFiLendingAddress(),
              name: "getLoanData",
              params: [row.loanid],
            };
          })
        );

        // get formatted data
        const loansOrigin = await Promise.all(
          loans.map(async (row: any) => {
            const isPrologueLoan = row.collectionName === "Prologue";
            const collectionAddr =
              getNFTCollectionAddressConvert(row.collectionAddress) ||
              getNFTCollectionAddressFromSlug(row.slug);

            let apy = 0;
            let ltv;
            let matureDate;

            // calculate apy and mature date
            if (isPrologueLoan) {
              const loanData = prologueLoansData.find(
                (row1: any) => row1.loanId === row.loanid
              );

              matureDate =
                loanData.startedAt + loanData.duration - 14 * DAY_IN_SECONDS;

              if (loanData.duration > 0) {
                const m = YEAR_IN_SECONDS / loanData.duration;
                // eslint-disable-next-line no-restricted-properties
                apy = 100 * (Math.pow(1 + loanData.interestRate / m, m) - 1);
              }
            } else {
              const m = YEAR_IN_SECONDS / row.duration;
              matureDate = row.start + row.duration;
              // eslint-disable-next-line no-restricted-properties
              apy =
                100 *
                (Math.pow(
                  1 + (row.max_loan_size - row.outstanding) / row.outstanding,
                  m
                ) -
                  1);
            }

            // calculate ltv
            if (isPrologueLoan) {
              const nftData = allNfts.find(
                (row1: any) => Number(row1.tokenId) === Number(row.nftid)
              );
              if (nftData?.redeemAmount) {
                if (nftData.redeemAmount - row.outstanding !== 0) {
                  ltv =
                    100 *
                    (row.outstanding /
                      (nftData.redeemAmount - row.outstanding));
                }
              }
            } else {
              const collection = collections.find(
                (row) =>
                  row.contract.toLowerCase() === collectionAddr.toLowerCase()
              );
              if (collection.price) {
                ltv = 100 * (row.outstanding / collection.price);
              }
            }

            return {
              name: row.collectionName,
              slug: row.slug,
              collectionAddr: collectionAddr,
              displayName: `${row.collectionName}#${row.nftid}`,
              principal: row.outstanding,
              repayAmount: row.max_loan_size,
              apy,
              matureDate,
              ltv,
              nftId: row.nftid,
              tokenImg: getTokenImageFromReservoir(collectionAddr, row.nftid),
              market: row.market,
              marketImg: getNftMarketLogo(row.market),
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
  }, [vault?.address, collections.length]);

  useEffect(() => {
    setBlur(loanExpanded);
    onCardPopup(loanExpanded);
  }, [loanExpanded, setBlur]);

  const filteredLoans =
    searchQuery.length > 0
      ? loans.filter((row) =>
          String(row.name).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : loans;

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: `LOANS [${filteredLoans.length}]`,
        key: "displayName",
        itemPrefix: (item) => {
          return (
            <>
              {item.tokenImg && (
                <Image
                  className="mr-1 border-1 border-gray-200 rounded-full w-[16px] min-w-[16px] h-[16px] min-h-[16px]"
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
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden lg:table-cell w-[90px]"
            : "w-[90px]",
        format: (item) => {
          return (item?.principal || 0).toFixed(2);
        },
      },
      {
        title: "REPAY",
        key: "repayAmount",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden 2xl:table-cell w-[65px]"
            : "hidden xl:table-cell w-[65px]",
        itemPrefix: () => "Ξ",
        format: (item) => {
          return (item?.repayAmount || 0).toFixed(2);
        },
      },
      {
        title: "LTV",
        // subTitle: loanExpanded ? "/FLOOR/" : undefined,
        key: "ltv",
        itemSuffix: () => "",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden 3xl:table-cell w-[50px]"
            : "hidden lg:table-cell w-[50px]",
        format: (item) => {
          const { ltv } = item;
          return ltv ? `${Number(ltv).toFixed(1)}%` : "N/A";
        },
      },
      // {
      //   title: "LTV",
      //   subTitle: loanExpanded ? "/FLOOR/" : undefined,
      //   key: "ltvFloor",
      //   itemSuffix: () => "",
      //   rowClass: () =>
      //     loanExpanded ? "hidden lg:table-cell w-[10%]" : "hidden",
      //   format: (item) => {
      //     return "N/A";
      //   },
      // },
      {
        title: "APY",
        key: "apy",
        itemSuffix: () => "%",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden lg:table-cell w-[50px]"
            : "w-[50px]",
        format: (item) => {
          return (item?.apy || 0).toFixed(1);
        },
      },
      {
        title: "INITIATED",
        key: "initiated",
        rowClass: () =>
          loanExpanded ? "hidden lg:table-cell w-[10%]" : "hidden",
        format: (item) => {
          return (item?.initiated || 0).toFixed(2);
        },
      },
      {
        title: "DUE",
        key: "matureDate",
        rowClass: () =>
          loanExpanded
            ? "w-[10%]"
            : small
            ? "hidden xl:table-cell w-[50px]"
            : "hidden lg:table-cell w-[50px]",
        format: (item) => {
          return formatMaturity(1000 * (item?.matureDate || 0));
        },
      },
      {
        title: "MARKET",
        component: (item) => {
          let width;
          let height;
          if (size.width >= 1024) {
            width = 16;
            height = 16;
            if (item.market === "nftfi") {
              width = 21;
              height = 8;
            } else if (item.market === "benddao") {
              width = 19;
              height = 10;
            }
          } else {
            width = 24;
            height = 24;
            if (item.market === "nftfi") {
              width = 42;
              height = 16;
            } else if (item.market === "benddao") {
              width = 38;
              height = 20;
            }
          }
          return (
            <>
              {item.marketImg && (
                <Image
                  className="mr-1"
                  src={item.marketImg}
                  width={width}
                  height={height}
                  alt=""
                />
              )}
            </>
          );
        },
        rowClass: () => (loanExpanded ? "w-[10%]" : "hidden"),
      },
    ];
  };

  return (
    <Card
      className={`overflow-hidden ${className} ${
        nonExpandedClassName && !loanExpanded ? nonExpandedClassName : ""
      } ${loanExpanded ? "h-[90%] my-auto" : ""}`}
      expanded={loanExpanded}
      onCollapse={() => setLoanExpanded(false)}
      onClick={onActive}
      animate
    >
      <div className={`flex items-center justify-between ${headerClassName}`}>
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
            LOAN {isBreakdown ? "BREAKDOWN" : "EXPOSURE"}
          </h2>
          {small && (
            <h2 className="lg:hidden font-bold text-white font-sm">
              LOAN {isBreakdown ? "BREAKDOWN" : "EXP."}
            </h2>
          )}
        </div>
        <button onClick={() => setLoanExpanded(!loanExpanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              loanExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <div className="flex">
        <Search
          placeholder="Search loans"
          className="xl:flex-none w-full"
          onChange={(val) => setSearchQuery(val)}
        />
      </div>
      <Table
        containerClassName="flex-1"
        className="block h-full"
        rowInfos={getRowInfos()}
        items={filteredLoans}
        trStyle="h-10"
        rowStyle="h-8"
        defaultSortKey="apy"
        bodyClass="h-[calc(100%-40px)]"
        isLoading={isFetching}
        walletConnectRequired={walletConnectRequired}
      />
    </Card>
  );
}
