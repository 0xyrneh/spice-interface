import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BigNumber, providers, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";

import { ActionStatus } from "@/types/common";
import { Button, Stats } from "../../common";
import { LeverageTab } from "./LeverageInput";
import { PrologueNftPortofolioInfo } from "@/types/nft";
import { useSpiceLending } from "@/hooks/useSpiceLending";
import { useAppSelector } from "@/state/hooks";
import {
  DEFAULT_AGGREGATOR_VAULT,
  DEFAULT_LEND,
} from "@/config/constants/vault";
import { activeChainId } from "@/utils/web3";
import { setActionStatus, setActionError } from "@/state/modal/modalSlice";
import { getTransactionByHash } from "@/utils/tenderly";
import { DAY_IN_SECONDS, YEAR_IN_SECONDS } from "@/config/constants/time";
import { getWethAddress } from "@/utils/addressHelpers";
import { getLoanTerms } from "@/utils/lend";
import { getBalanceInEther } from "@/utils/formatBalance";
import { formatLeverageMaturity } from "@/utils/time";

interface Props {
  isOpen: boolean;
  nft: PrologueNftPortofolioInfo;
  targetAmount: string;
  netApy: number;
  tab: LeverageTab;
  hiding?: boolean;
  onMaxClicked?: () => void;
  onClose: () => void;
}

export default function LeverageConfirm(props: Props) {
  const [dots, setDots] = useState("");
  const [dotsTimer, setDotsTimer] = useState<NodeJS.Timer>();
  const [tab, setTab] = useState(LeverageTab.Increase);

  // contract call params
  const [termsParam, setTermsParam] = useState<any>();
  const [signatureParam, setSignatureParam] = useState<any>();

  const { isOpen, nft, targetAmount, netApy, onMaxClicked, onClose } = props;

  const dispatch = useDispatch();
  const { account, library } = useWeb3React();
  const { vaults, defaultVault } = useAppSelector((state) => state.vault);
  const { pendingTxHash, actionStatus, actionError } = useAppSelector(
    (state) => state.modal
  );

  const { loanId, repayAmount, balance } = nft.loan;
  const loanValue = getBalanceInEther(balance || BigNumber.from(0));
  const isApproved = nft.isApproved;

  const {
    onApprovePrologueNft,
    onObtainLeverage,
    onIncreaseLeverage,
    onPartialDecreaseLeverage,
    onDecreaseLeverage,
  } = useSpiceLending(
    nft?.lendAddr || DEFAULT_LEND[activeChainId],
    defaultVault?.address || DEFAULT_AGGREGATOR_VAULT[activeChainId]
  );

  useEffect(() => {
    setTermsParam(undefined);
    setSignatureParam(undefined);
  }, [isOpen]);

  useEffect(() => {
    if (!props.hiding) {
      setTab(props.tab);
    }
  }, [props.hiding, props.tab]);

  useEffect(() => {
    if (dotsTimer) {
      clearInterval(dotsTimer);
      setDotsTimer(undefined);
    }

    if (actionStatus === ActionStatus.Pending) {
      setDots("");
      setDotsTimer(
        setInterval(() => {
          setDots((prevDots) => {
            let newDots = prevDots + ".";
            if (newDots.length === 4) {
              newDots = "";
            }

            return newDots;
          });
        }, 1000)
      );
    }
  }, [actionStatus]);

  const processing = () => actionStatus === ActionStatus.Pending;

  // handle approve nft
  const handleApproveNft = async () => {
    dispatch(setActionError(undefined));
    dispatch(setActionStatus(ActionStatus.Pending));

    try {
      await onApprovePrologueNft(nft.tokenId);

      dispatch(setActionStatus(ActionStatus.Initial));
    } catch (err: any) {
      dispatch(setActionStatus(ActionStatus.Failed));
      if (err.code) {
        dispatch(setActionError(err.code));
      } else {
        const failedReason = await getTransactionByHash(pendingTxHash);
        dispatch(setActionError(failedReason));
      }
    }
  };

  // get leverage params from off-chain
  // call backend spice pricing api
  const getObtainLeverageParams = async () => {
    dispatch(setActionError(undefined));
    dispatch(setActionStatus(ActionStatus.Pending));

    try {
      const terms = {
        loanAmount: utils.parseEther(targetAmount.toString()).toString(),
        duration: 14 * DAY_IN_SECONDS, // 14 days
        collateralAddress:
          defaultVault?.address || DEFAULT_AGGREGATOR_VAULT[activeChainId],
        collateralId: nft.tokenId,
        borrower: account,
        currency: getWethAddress(),
        additionalLoanAmount: 0,
        additionalDuration: 0,
      };

      const domain = {
        name: "Spice Finance",
        version: "1",
        chainId: activeChainId,
      };

      const LoanTermsRequestType = [
        {
          name: "loanAmount",
          type: "uint256",
        },
        {
          name: "duration",
          type: "uint32",
        },
        {
          name: "collateralAddress",
          type: "address",
        },
        {
          name: "collateralId",
          type: "uint256",
        },
        {
          name: "borrower",
          type: "address",
        },
        {
          name: "currency",
          type: "address",
        },
        {
          name: "additionalLoanAmount",
          type: "uint256",
        },
        {
          name: "additionalDuration",
          type: "uint32",
        },
      ];

      const types = {
        LoanTerms: LoanTermsRequestType,
      };

      const provider = new providers.Web3Provider(library);
      const signer = provider.getSigner();
      // eslint-disable-next-line no-underscore-dangle
      const signature = await signer._signTypedData(domain, types, terms);

      // call backend api
      const res = await getLoanTerms(
        terms,
        signature,
        "initiate",
        activeChainId
      );

      const loanterms = {
        ...res.data.data.loanterms,
        loanAmount: BigNumber.from(
          res.data.data.loanterms.loanAmount.toString()
        ),
      };
      delete loanterms.repayment;

      setTimeout(() => {
        setTermsParam(loanterms);
        setSignatureParam(res.data.data.signature);

        dispatch(setActionStatus(ActionStatus.Initial));
      }, 2000);
    } catch (err: any) {
      dispatch(setActionStatus(ActionStatus.Failed));
      dispatch(setActionError("Pricing API error"));
    }
  };

  // get leverage params from off-chain
  // call backend spice pricing api
  const getIncreaseLeverageParams = async (additionalAmount: string) => {
    dispatch(setActionError(undefined));
    dispatch(setActionStatus(ActionStatus.Pending));

    try {
      const terms = {
        loanAmount: nft.loanAmount.toString(),
        duration: 14 * DAY_IN_SECONDS, // 14 days
        collateralAddress:
          defaultVault?.address || DEFAULT_AGGREGATOR_VAULT[activeChainId],
        collateralId: nft.tokenId,
        borrower: account,
        currency: getWethAddress(),
        additionalLoanAmount: additionalAmount,
        additionalDuration: 0,
      };

      const domain = {
        name: "Spice Finance",
        version: "1",
        chainId: activeChainId,
      };

      const LoanTermsRequestType = [
        {
          name: "loanAmount",
          type: "uint256",
        },
        {
          name: "duration",
          type: "uint32",
        },
        {
          name: "collateralAddress",
          type: "address",
        },
        {
          name: "collateralId",
          type: "uint256",
        },
        {
          name: "borrower",
          type: "address",
        },
        {
          name: "currency",
          type: "address",
        },
        {
          name: "additionalLoanAmount",
          type: "uint256",
        },
        {
          name: "additionalDuration",
          type: "uint32",
        },
      ];

      const types = {
        LoanTerms: LoanTermsRequestType,
      };

      const provider = new providers.Web3Provider(library);
      const signer = provider.getSigner();
      // eslint-disable-next-line no-underscore-dangle
      const signature = await signer._signTypedData(domain, types, terms);

      // Call backend api
      const res = await getLoanTerms(
        terms,
        signature,
        additionalAmount === "0" ? "extend" : "increase",
        activeChainId,
        loanId
      );

      const loanterms = {
        ...res.data.data.loanterms,
        loanAmount: BigNumber.from(
          res.data.data.loanterms.loanAmount.toString()
        ),
      };
      delete loanterms.repayment;

      setTimeout(() => {
        setTermsParam(loanterms);
        setSignatureParam(res.data.data.signature);

        dispatch(setActionStatus(ActionStatus.Initial));
      }, 2000);
    } catch (err: any) {
      dispatch(setActionStatus(ActionStatus.Failed));
      dispatch(setActionError("Pricing API error"));
    }
  };

  // obtain leverage logic by calling on-chain contract
  const handleObtainLeverage = async () => {
    dispatch(setActionError(undefined));
    dispatch(setActionStatus(ActionStatus.Pending));

    try {
      await onObtainLeverage(termsParam, signatureParam);

      setTimeout(() => {
        dispatch(setActionStatus(ActionStatus.Success));
        dispatch(setActionError(undefined));
      }, 5000);
    } catch (err: any) {
      dispatch(setActionStatus(ActionStatus.Failed));

      if (err.code) {
        dispatch(setActionError(err.code));
      } else {
        const failedReason = await getTransactionByHash(pendingTxHash);
        dispatch(setActionError(failedReason));
      }
    }
  };

  // obtain leverage logic by calling on-chain contract
  const handleIncreaseLeverage = async () => {
    if (!loanId) return;

    dispatch(setActionError(undefined));
    dispatch(setActionStatus(ActionStatus.Pending));

    try {
      await onIncreaseLeverage(loanId, termsParam, signatureParam);

      setTimeout(() => {
        dispatch(setActionStatus(ActionStatus.Success));
        dispatch(setActionError(undefined));
      }, 4000);
    } catch (err: any) {
      dispatch(setActionStatus(ActionStatus.Failed));

      if (err.code) {
        dispatch(setActionError(err.code));
      } else {
        const failedReason = await getTransactionByHash(pendingTxHash);
        dispatch(setActionError(failedReason));
      }
    }
  };

  // obtain leverage logic
  const handleInitiateLoan = async () => {
    if (termsParam && signatureParam) {
      await handleObtainLeverage();
    } else {
      await getObtainLeverageParams();
    }
  };

  // increase loan logic
  const handleIncreaseLoan = async (additionalAmount: string) => {
    if (termsParam && signatureParam) {
      await handleIncreaseLeverage();
    } else {
      await getIncreaseLeverageParams(additionalAmount);
    }
  };

  const onConfirm = async () => {
    if (!nft) return;

    // 1. implement obtain leverage logic
    if (tab === LeverageTab.LeverUp) {
      if (!nft.isApproved) {
        await handleApproveNft();
      } else {
        if (actionStatus === ActionStatus.Success) {
          onClose();
          return;
        } else {
          await handleInitiateLoan();
        }
      }
    }

    // 2. implement increase leverage logic
    if (tab === LeverageTab.Increase) {
      if (actionStatus === ActionStatus.Success) {
        onClose();
        return;
      } else {
        const additionalAmount = utils
          .parseEther((Number(targetAmount) - loanValue).toFixed(18))
          .toString();
        await handleIncreaseLoan(additionalAmount);
      }
    }

    // 3. implement decrease leverage logic
    if (tab === LeverageTab.Decrease) {
    }

    // 4. implement refinance leverage logic
    if (tab === LeverageTab.Refinance) {
      await handleIncreaseLoan("0");
    }
  };

  const confirmTitle = () => {
    if (actionStatus === ActionStatus.Pending) {
      return "WORKING";
    } else if (actionStatus === ActionStatus.Success) {
      return "FINISH";
    } else if (actionStatus === ActionStatus.Failed) {
      return "RETRY";
    } else {
      // 1. show "APPROVE" when nft is not approved
      if (!isApproved) {
        return "APPROVE";
      } else if (!termsParam && !signatureParam) {
        // 2. show "ACCEPT" when nft is approved but we don't have terms and signature params
        return "ACCEPT";
      } else {
        // 3. show "LEVER UP" when nft is approved and we have terms and signature params
        return tab.toUpperCase();
      }
    }
  };

  const nftValue = nft?.amount || 0;
  // const netApy = nft?.netApy || 0;
  const debtOwed = getBalanceInEther(nft?.debtOwed || BigNumber.from(0));
  const borrowApy = nft?.borrowApy || 0;
  const healthFactor = nft?.healthFactor || 0;
  const autoRenew = nft?.autoRenew || 0;

  return (
    <div className="flex flex-col flex-1 justify-between">
      <h2
        className={`font-base ${
          processing() ? "text-gray-200" : "text-white"
        } whitespace-nowrap`}
      >
        Leverage Details
      </h2>
      <div className="flex items-center gap-3">
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="NFT Value"
          value={`Ξ${nftValue.toFixed(2)}`}
          size="xs"
        />
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Net APY"
          value={`${netApy ? `${netApy.toFixed(2)}%` : "--"}`}
          size="xs"
          showMax={
            nft.isApproved &&
            (tab === LeverageTab.LeverUp || tab === LeverageTab.Increase)
          }
          onMaxClicked={onMaxClicked}
        />
      </div>
      <div className="flex items-center gap-3">
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Debt Owed"
          value={debtOwed > 0 ? `Ξ${debtOwed.toFixed(2)}` : "--"}
          size="xs"
        />
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Borrow APY"
          value={`${borrowApy > 0 ? `${(100 * borrowApy).toFixed(2)}%` : "--"}`}
          size="xs"
        />
      </div>
      <div className="flex items-center gap-3">
        <Stats
          type={processing() ? "gray" : "green"}
          className="flex-1"
          title="HF"
          value={`${healthFactor > 0 ? `${healthFactor.toFixed(2)}` : "--"}`}
          size="xs"
        />
        <Stats
          type={processing() ? "gray" : undefined}
          className="flex-1"
          title="Auto Renew"
          value={autoRenew > 0 ? `${formatLeverageMaturity(autoRenew)}` : "--"}
          size="xs"
        />
      </div>
      <Button
        type={processing() ? "secondary" : "primary"}
        disabled={processing()}
        className="h-10 flex items-center justify-center"
        onClick={() => {
          if (!processing()) {
            onConfirm();
          }
        }}
      >
        <span className="text-base">
          {confirmTitle()}
          {actionStatus === ActionStatus.Pending ? dots : ""}
        </span>
      </Button>
    </div>
  );
}
