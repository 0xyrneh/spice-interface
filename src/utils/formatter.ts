import { DAY_IN_SECONDS } from "@/config/constants/time";
import {
  getCollectionInfoByAddress,
  getFloorPrice,
  getTokenImageFromReservoir,
} from "./nft";
import { WEEK_IN_SECONDS } from "@/config/constants/time";

export const formatBlurLoans = async (loansRes: any[]): Promise<any[]> => {
  const loansInfo = await Promise.all(
    loansRes.map(async (row: any) => {
      const collectionAddr = row["NFT Contract"];

      const [floorPrice, info] = await Promise.all([
        getFloorPrice(collectionAddr),
        getCollectionInfoByAddress(collectionAddr),
      ]);
      return {
        apy: (Math.pow(row["Max Repay Amount"] / row.Principal, 292) - 1) * 100,
        matureDate: row["Start"] + 194400,
        principal: row.Principal,
        nftId: row["NFT ID"],
        displayName: `${info.name}#${row["NFT ID"]}`,
        tokenImg: getTokenImageFromReservoir(collectionAddr, row["NFT ID"]),
        ltv: (row.Principal / floorPrice) * 100,
        type: "LOAN",
        status: row.Auction ? "Auction" : "Active",
      };
    })
  );

  return loansInfo;
};

export const formatBlurBids = async (bidsRes: any[]): Promise<any[]> => {
  const bidsInfo = await Promise.all(
    bidsRes.map(async (row: any) => {
      const collectionAddr = row.contractAddress;
      const [floorPrice, info] = await Promise.all([
        getFloorPrice(collectionAddr),
        getCollectionInfoByAddress(collectionAddr),
      ]);

      const principal = Number(row.maxAmount);
      return {
        apy: (Math.exp(row.interestRate / 10000) - 1) * 100,
        matureDate: undefined,
        principal: principal,
        displayName: `${info.name}`,
        tokenImg: getTokenImageFromReservoir(collectionAddr),
        ltv: (principal / floorPrice) * 100,
        type: "BID",
        status: "Active",
      };
    })
  );

  return bidsInfo;
};

export const formatBlurRanking = async (
  historicalRecords: any[]
): Promise<any[]> => {
  if (historicalRecords.length === 0) return [];
  const lastestItem = historicalRecords[0];
  const rankObj: any = {};

  const currentTime = Math.floor(Date.now() / 1000);
  const oneDayBefore = currentTime - DAY_IN_SECONDS;
  const oneWeekBefore = currentTime - WEEK_IN_SECONDS;
  const beforeOneDayItem = historicalRecords.find(
    (item) => Number(item.time) < oneDayBefore
  );
  const beforeOneWeekItem = historicalRecords.find(
    (item) => Number(item.time) < oneWeekBefore
  );

  let ranking = [];

  for (let [addr, point] of Object.entries(lastestItem.okrs.holders_points)) {
    const beforeOneDayPoint =
      beforeOneDayItem && beforeOneDayItem.okrs.holders_points[addr]
        ? beforeOneDayItem.okrs.holders_points[addr]
        : 0;
    const beforeOneWeekPoint =
      beforeOneWeekItem && beforeOneWeekItem.okrs.holders_points[addr]
        ? beforeOneWeekItem.okrs.holders_points[addr]
        : 0;

    ranking.push({
      wallet: addr,
      day: (point as any) - beforeOneDayPoint,
      week: (point as any) - beforeOneWeekPoint,
      total: point as number,
    });
  }

  ranking = ranking.sort((a, b) =>
    a.total < b.total ? 1 : a.total === b.total ? 0 : -1
  );
  ranking = ranking.map((item, idx) => ({
    rank: idx + 1,
    ...item,
  }));

  return ranking;
};
