import { useEffect, useState } from "react";
import Image from "next/image";
import useBreakpoint from "use-breakpoint";
import {
  BlurStats,
  Button,
  Card,
  Stats,
  CopyClipboard,
} from "@/components/common";
import BlurSVG from "@/assets/icons/blur.svg";
import ExternalLinkSVG from "@/assets/icons/external-link.svg";
import { VaultInfo } from "@/types/vault";
import { useUI } from "@/hooks";
import { BREAKPOINTS } from "@/constants";
import Table, { TableRowInfo } from "../common/Table";
import { shortAddress } from "@/utils";
import axios from "axios";
import { BLUR_API_BASE } from "@/config/constants/backend";
import { formatBlurRanking } from "@/utils/formatter";
import { useWeb3React } from "@web3-react/core";

type Props = {
  vault: VaultInfo;
  showIcon?: boolean;
  nonExpandedClassName?: string;
  className?: string;
  onlyPts?: boolean;
  showAccumulated?: boolean;
  onDeposit?: () => void;
};

const BlurCards = [
  {
    title: "SP-BLUR Vault",
    value: "1X | 800 SPB",
    type: "orange",
    tooltip: "Deposit directly into the SP-BLUR Vault to earn SP-BLUR PTS",
  },
  {
    title: "Flagship Vault",
    value: "?? | ????",
    type: "orange",
    tooltip: "Deposit directly into the Flagship Vault to earn Flagship PTS",
  },
  {
    title: "Leverage Vault",
    value: "?? | ????",
    tooltip: "Deposit directly into the Leverage Vault to earn Leverage PTS",
  },
  {
    title: "Prologue Vault",
    value: "?? | ????",
    tooltip: "Deposit directly into the Prologue Vault to earn Prologue PTS",
  },
];

export default function BlurPts({
  vault,
  showIcon,
  className,
  nonExpandedClassName,
  onlyPts,
  showAccumulated,
  onDeposit,
}: Props) {
  const { breakpoint } = useBreakpoint(BREAKPOINTS);
  const [expanded, setExpanded] = useState(false);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(0);
  const [ranks, setRank] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean | undefined>(true);
  const [myRank, setMyRank] = useState<any>();
  const [total, setTotal] = useState(0);

  const { account } = useWeb3React();
  const { setBlur } = useUI();

  useEffect(() => {
    if (breakpoint === "lg") {
      setCount(2);
    } else if (breakpoint === "xl") {
      setCount(3);
    } else if (breakpoint === "2xl" || breakpoint === "3xl") {
      setCount(4);
    } else {
      setCount(1);
    }
  }, [breakpoint]);

  useEffect(() => {
    if (account) {
      setMyRank(
        ranks.find(
          (item) => item.wallet.toLowerCase() === account.toLowerCase()
        )
      );
    } else {
      setMyRank(undefined);
    }
  }, [ranks, account]);

  useEffect(() => {
    const pageCount = Math.ceil(BlurCards.length / count) - 1;
    if (page > pageCount) setPage(pageCount);
  }, [count, page]);

  useEffect(() => {
    setBlur(expanded);
  }, [expanded, setBlur]);

  const fetchData = async () => {
    if (!vault?.address) return;

    setIsFetching(true);

    const apiEnv =
      Number(process.env.REACT_APP_CHAIN_ID) === 1 ? "prod" : "goerli";

    try {
      const res = await axios.get(
        `${BLUR_API_BASE}/historical-points?env=${apiEnv}`
      );

      if (res.status === 200) {
        if (res.data.data.historicalRecords.length === 0) {
          setTotal(0);
        } else {
          setTotal(res.data.data.historicalRecords[0].okrs.total_points);
        }
        const ranksInfo = await formatBlurRanking(
          res.data.data.historicalRecords
        );
        setRank(ranksInfo);
      }
    } catch (err) {
      console.log("ranks fetching error");
    }

    setIsFetching(false);
  };

  useEffect(() => {
    setRank([]);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.address]);

  const handleDepositClicked = () => {
    setExpanded(false);
    setTimeout(() => {
      onDeposit && onDeposit();
    }, 500);
  };

  const handleLearnMoreClicked = () => {
    window.open(
      "https://docs.spicefi.xyz/blur/what-is-the-sp-blur-vault",
      "_blank"
    );
  };

  const getRowInfos = (): TableRowInfo[] => {
    return [
      {
        title: "RANK",
        key: "rank",
        rowClass: () => "w-[60px]",
      },
      {
        title: "WALLET",
        key: "wallet",
        headerClass: "!justify-start",
        itemClass: () => "!justify-start",
        itemPrefix: (item) => {
          return (
            <CopyClipboard
              text={item.wallet}
              width={16}
              height={16}
              className="hidden lg:flex items-center min-w-4 w-4 h-4 mr-1"
            />
          );
        },
        format: (item) => {
          if (account && account.toLowerCase() === item.wallet.toLowerCase())
            return "YOU";
          if (expanded) return item.wallet;
          if (breakpoint === "md" || breakpoint === "sm")
            return item.wallet.slice(0, 7);
          if (breakpoint === "lg") return item.wallet.slice(0, 8);
          return shortAddress(item.wallet);
        },
      },
      {
        title: "1D",
        key: "day",
        rowClass: () =>
          expanded
            ? "w-[16%]"
            : "hidden lg:table-cell w-[60px] lg:w-[16%] 2xl:w-1/5",
        format: (item) => item.day.toFixed(2),
      },
      {
        title: "1W",
        key: "week",
        rowClass: () =>
          expanded ? "w-[16%]" : "w-[60px] lg:w-[16%] 2xl:w-1/5",
        format: (item) => item.week.toFixed(2),
      },
      {
        title: "TOTAL",
        key: "total",
        rowClass: () =>
          expanded ? "w-[16%]" : "w-[60px] lg:w-[16%] 2xl:w-1/5",
        format: (item) => item.total.toFixed(2),
      },
    ];
  };

  return (
    <Card
      className={`gap-3 overflow-hidden ${className} ${
        nonExpandedClassName && !expanded ? nonExpandedClassName : ""
      }`}
      animate
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
          <BlurSVG />
          <h2 className="font-bold text-white font-sm">
            {expanded
              ? "SP-BLUR LEADERBOARD"
              : onlyPts
              ? "SP-BLUR PTS"
              : "SP-BLUR RANKINGS"}
          </h2>
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          <ExternalLinkSVG
            className={`text-gray-100 hover:text-white ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {(onlyPts || expanded) && (
        <div
          className={`flex flex-col gap-5 ${
            expanded ? "border-y border-gray-200 py-4" : ""
          }`}
        >
          {expanded && (
            <div className="flex justify-between">
              <Stats
                title="RANK"
                value={myRank?.rank ?? "-"}
                valueSize="sm"
                className="w-[60px]"
              />
              <div className="flex flex-col tracking-normal flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-200">
                    WALLET
                  </span>
                </div>
                <div
                  className={
                    "flex items-center font-bold text-sm text-orange-200 drop-shadow-orange-200"
                  }
                >
                  <CopyClipboard
                    text={account!}
                    width={16}
                    height={16}
                    className="hidden lg:flex items-center min-w-4 w-4 h-4 mr-1"
                  />
                  YOU
                </div>
              </div>
              <Stats
                title="1D"
                value={myRank?.day ?? "0"}
                valueSize="sm"
                className="w-[16%] items-end"
              />
              <Stats
                title="1W"
                value={myRank?.week ?? "0"}
                valueSize="sm"
                className="w-[16%] items-end"
              />
              <Stats
                title="TOTAL SPB"
                value={myRank?.total ?? "0"}
                valueSize="sm"
                className="w-[16%] items-end"
              />
            </div>
          )}
          <div
            className={`flex items-center justify-center ${
              expanded
                ? "gap-[calc(20%-122px)] lg:gap-[calc(14%-112px)]"
                : "lg:gap-2 xl:gap-0 3xl:gap-2 mb-2"
            }`}
          >
            {(expanded
              ? BlurCards
              : BlurCards.slice(count * page, count * (page + 1))
            ).map((card, idx) => (
              <BlurStats
                key={`${card.title}-${idx}`}
                title={BlurCards[count * page + idx].title}
                value={BlurCards[count * page + idx].value}
                type={BlurCards[count * page + idx].type as any}
                tooltip={BlurCards[count * page + idx].tooltip}
                disabled={count * page + idx !== 0}
                className={`${expanded ? "w-[153px] lg:w-[196px]" : ""} ${
                  count * page + idx === 0 ? "" : "blur-[2px]"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {onlyPts && !expanded && (
        <div className="flex items-center justify-center gap-2">
          {Array(Math.ceil(BlurCards.length / count))
            .fill("0")
            .map((_, idx) => (
              <button
                key={`Pagination-${idx}`}
                className={`${
                  idx === page ? "bg-orange-200" : "bg-gray-200"
                } w-6 lg:w-8 h-1 rounded-lg`}
                onClick={() => setPage(idx)}
              />
            ))}
        </div>
      )}

      {expanded && (
        <div className="flex items-end justify-between mt-3">
          <div className="flex gap-4">
            <Button
              type="primary"
              className="w-[104px] h-8"
              onClick={handleDepositClicked}
            >
              <span className="text-xs font-bold">DEPOSIT</span>
            </Button>
            <Button
              type="secondary"
              className="w-[104px] h-8"
              onClick={handleLearnMoreClicked}
            >
              <span className="text-xs font-bold">LEARN MORE</span>
            </Button>
          </div>
          <div className="flex h-[46px] py-2 items-center border-[1.5px] border-gray-100 rounded-lg text-gray-100 text-xs drop-shadow-sm">
            <span className="tracking-normal text-center px-4">{total}</span>
            <span className="border-l-[1.5px] px-4 tracking-normal w-[95px]">
              Total SPB emitted
            </span>
          </div>
        </div>
      )}
      {(!onlyPts || expanded) && (
        <>
          {showAccumulated && (
            <div className="flex justify-center py-2 items-center text-gray-100 text-sm drop-shadow-sm">
              <span className="tracking-normal text-center px-4">{total}</span>
              <span className="border-l-[1.5px] px-4 tracking-normal">
                Total SPB accumulated
              </span>
            </div>
          )}

          <Table
            containerClassName="flex-1"
            className="block h-full"
            rowInfos={getRowInfos()}
            items={ranks}
            trStyle="h-10"
            rowStyle="h-8"
            defaultSortKey="apy"
            bodyClass="h-[calc(100%-40px)]"
            isLoading={isFetching}
          />
        </>
      )}
    </Card>
  );
}
