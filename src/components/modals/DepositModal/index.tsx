import { useCallback, useEffect, useState } from "react";
import { BigNumber, utils, constants } from "ethers";
import { useWeb3React } from "@web3-react/core";
import moment from "moment-timezone";

import LeverageInput, { LeverageTab } from "./LeverageInput";
import Modal, { ModalProps } from "../Modal";
import { useVault } from "@/hooks/useVault";
import { useNftVault } from "@/hooks/useNftVault";
import { useSpiceLending } from "@/hooks/useSpiceLending";
import { useEthBalance } from "@/hooks/useEthBalance";
import { TxStatus, ActionStatus } from "@/types/common";
import { ReceiptToken, VaultInfo } from "@/types/vault";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchVaultUserDataAsync } from "@/state/actions";
import { fetchUserWethData } from "@/state/lend/fetchUserLend";
import { accLoans } from "@/utils/lend";
import { getBalanceInEther, getBalanceInWei } from "@/utils/formatBalance";
import { isValidNumber } from "@/utils/regex";
import { Button, Card, Erc20Card, PrologueNftCard } from "../../common";
import PositionInput from "./PositionInput";
import {
  YEAR_IN_SECONDS,
  DAY_IN_SECONDS,
  YEAR_IN_DAYS,
} from "@/config/constants/time";
import { getTokenImageFromReservoir } from "@/utils/nft";
import { PROLOGUE_NFT_ADDRESS } from "@/config/constants/nft";
import ConfirmPopup from "./ConfirmPopup";
import {
  setActionStatus,
  setActionError,
  setPendingTxHash,
} from "@/state/modal/modalSlice";
import { calculateBorrowApr, getNetApy } from "@/utils/apy";

interface Props extends ModalProps {
  vaultId: string;
  defaultNftId?: number;
  isLeverageModal?: boolean;
}

export default function DepositModal({
  open,
  defaultNftId,
  isLeverageModal,
  vaultId,
  onClose,
}: Props) {
  const [positionSelected, setPositionSelected] = useState(true);
  const [leverageTab, setLeverageTab] = useState(LeverageTab.Increase);
  const [positionAmount, setPositionAmount] = useState("");
  const [amountInWei, setAmountInWei] = useState<BigNumber>(BigNumber.from(0));
  const [isDeposit, setIsDeposit] = useState(false);
  const [targetLeverage, setTargetLeverage] = useState("");
  const [useWeth, setUseWeth] = useState(true);
  const [positionStatus, setPositionStatus] = useState(TxStatus.None);
  const [selectedNftId, setSelectedNftId] = useState<number | undefined>();
  const [focused, setFocused] = useState(false);
  const [closed, setClosed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [leverageHover, setLeverageHover] = useState(false);
  const [tooltipHover, setTooltipHover] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [allowance, setAllowance] = useState(BigNumber.from("0"));
  // position details
  const [oldPosition, setOldPosition] = useState("");
  const [positionChange, setPositionChange] = useState("");
  const [newPosition, setNewPosition] = useState("");
  // leverage handling
  const [leverageApproveRequired, setLeverageApproveRequired] = useState(false);
  const [loanLender, setLoanLender] = useState<string>("");
  const [sliderStep, setSliderStep] = useState<number>(0);
  const [targetAmount, setTargetAmount] = useState<string>("");
  const { defaultVault, vaults, leverageVaults } = useAppSelector(
    (state) => state.vault
  );

  const [vault, setVault] = useState(
    vaults.find((item) => item.address === vaultId)!
  );

  useEffect(() => {
    setVault(vaults.find((item) => item.address === vaultId)!);
  }, [vaults, vaultId]);

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const userEthBalance = useEthBalance();
  const userWethBalance = vault?.userInfo?.tokenBalance;
  const isFungible = vault?.fungible;
  const { data: lendData } = useAppSelector((state) => state.lend);
  const { pendingTxHash, actionStatus } = useAppSelector(
    (state) => state.modal
  );
  const { ethPrice } = useAppSelector((state) => state.oracle);

  const {
    onApprove: onVaultApprove,
    onDeposit: onVaultDeposit,
    onDepositETH: onVaultDepositETH,
    onWithdraw: onVaultWithdraw,
    onWithdrawETH: onVaultWithdrawETH,
  } = useVault(vault.address);
  const {
    onApprove: onNftVaultApprove,
    onDeposit: onNftVaultDeposit,
    onDepositETH: onNftVaultDepositETH,
    onWithdraw: onNftVaultWithdraw,
    onWithdrawETH: onNftVaultWithdrawETH,
  } = useNftVault(vault.address);

  const loans = accLoans(lendData);
  const userNfts = vault?.userInfo?.nftsRaw || [];
  const isDeprecatedVault = vault?.deprecated;

  const getNftPortfolios = () => {
    if (!account) {
      return [];
    }

    return loans.map((row: any) => {
      const lendGlobalData = lendData.find(
        (row1: any) => row1.address === row.lendAddr
      );
      const userNft = userNfts.find(
        (row1: any) => row1.tokenId === row.tokenId
      );

      const value =
        row?.loan?.tokenAmntInVault ||
        userNft?.depositAmnt ||
        BigNumber.from(0);
      const loanAmount = row?.loan?.balance || BigNumber.from(0);
      const debtOwed = row?.loan?.repayAmount || BigNumber.from(0);
      const healthFactor =
        getBalanceInEther(debtOwed) > 0 && getBalanceInEther(value) > 0
          ? ((lendGlobalData?.liquidationRatio || 0) *
              getBalanceInEther(value)) /
            getBalanceInEther(debtOwed)
          : 0;

      const borrowApr = row.loan?.terms?.interestRate
        ? row.loan?.terms?.interestRate.toNumber() / 10000
        : 0;
      const startedAt = row.loan?.startedAt || 0;
      const loanDuration = row.loan?.terms?.duration || 0;
      const autoRenew =
        startedAt && loanDuration
          ? moment((startedAt + loanDuration) * 1000)
              .subtract(14, "days")
              .valueOf() / 1000
          : 0;
      const isRenewAvailable =
        autoRenew && autoRenew > 0 && moment().valueOf() > 1000 * autoRenew;

      // calculate net APY
      let netApy = 0;
      let leveragedApy = 0;
      let borrowApy = 0;
      if (loanDuration > 0) {
        const m = YEAR_IN_SECONDS / loanDuration;
        // eslint-disable-next-line no-restricted-properties
        borrowApy = Math.pow(1 + borrowApr / m, m) - 1;
        const vaultApy = (vault?.apr || 0) / 100;

        netApy = getNetApy(
          getBalanceInEther(value),
          vaultApy,
          getBalanceInEther(debtOwed),
          borrowApy
        );
        leveragedApy = netApy + borrowApy;
      }

      return {
        lendAddr: row.lendAddr,
        value,
        isApproved: !!row.isApproved || !!row.loan.terms,
        state: row.loan?.state ? row.loan.state : 0,
        loanAmount,
        healthFactor,
        borrowApr,
        autoRenew,
        netApy,
        leveragedApy,
        borrowApy,
        debtOwed,
        loan: row.loan,
        isRenewAvailable: !!isRenewAvailable,

        owner: account,
        amount: value,
        tokenId: row.tokenId,
        tokenImg: getTokenImageFromReservoir(
          PROLOGUE_NFT_ADDRESS,
          Number(row.tokenId)
        ),
        isEscrowed: !!row?.loan?.loanId,
        apy: netApy,
        liquidationRatio: lendGlobalData?.liquidationRatio || 0,
        loanDuration,
      };
    });
  };

  const myNfts = getNftPortfolios();
  const selectedNft = myNfts.find((nft) => nft.tokenId === selectedNftId);

  const {
    onApproveWeth,
    onLendingDeposit,
    onLendingDepositETH,
    onLendingWithdraw,
    onLendingWithdrawETH,
  } = useSpiceLending(selectedNft?.lendAddr, vault.address);

  const updateAllowance = async () => {
    if (!account) return;

    let _allowance = vault.userInfo.allowance;
    if (selectedNft?.lendAddr) {
      const res = await fetchUserWethData(account, selectedNft?.lendAddr);
      _allowance = res.allowance;
    }
    setAllowance(_allowance);
  };

  useEffect(() => {
    updateAllowance();
  }, [account, vault.userInfo.allowance, selectedNft?.lendAddr]);

  const updateLoanLender = (val: string) => {
    setLoanLender(val);
  };

  const getAmountFromSliderStep = (step: number): number => {
    if (!selectedNft) return 0;
    const loanLenderVault =
      leverageTab === LeverageTab.LeverUp
        ? leverageVaults.find((row: any) => !row.deprecated)
        : leverageVaults.find((row: any) => row.address === loanLender);
    const { repayAmount, balance } = selectedNft?.loan;

    const collateralValue = getBalanceInEther(selectedNft.value);
    const currentLend = lendData.find(
      (row: any) => row.address === selectedNft?.lendAddr
    );
    const loanValue = getBalanceInEther(balance || BigNumber.from(0));
    const repayValue = getBalanceInEther(repayAmount || BigNumber.from(0));
    const originMaxLtv = currentLend?.loanRatio || 0;
    const maxRepayment = getBalanceInEther(repayAmount || BigNumber.from(0));

    // max leverage calculation to prevent utilization is greater than 1
    const lenderWethAvailable = getBalanceInEther(
      loanLenderVault?.wethBalance || BigNumber.from(0)
    );
    const interesteAccrued = repayValue - loanValue;
    const leverageAvailable = Math.max(
      0,
      originMaxLtv < 0.9
        ? originMaxLtv * (collateralValue - interesteAccrued * 2)
        : originMaxLtv * (collateralValue - loanValue - interesteAccrued * 2)
    );
    const maxLeverage = Math.min(leverageAvailable, lenderWethAvailable);

    if (leverageTab === LeverageTab.LeverUp) {
      return (step / 100) * maxLeverage;
    }

    if (leverageTab === LeverageTab.Increase) {
      return (step / 100) * Math.max(0, maxLeverage - loanValue);
    }
    return (step / 100) * maxRepayment;
  };

  const getSliderStepFromAmount = (amount: number): number => {
    if (!selectedNft) return 0;
    const loanLenderVault =
      leverageTab === LeverageTab.LeverUp
        ? leverageVaults.find((row: any) => !row.deprecated)
        : leverageVaults.find((row: any) => row.address === loanLender);
    const { repayAmount, balance } = selectedNft?.loan;

    const collateralValue = getBalanceInEther(selectedNft.value);
    const currentLend = lendData.find(
      (row: any) => row.address === selectedNft?.lendAddr
    );
    const loanValue = getBalanceInEther(balance || BigNumber.from(0));
    const repayValue = getBalanceInEther(repayAmount || BigNumber.from(0));
    const originMaxLtv = currentLend?.loanRatio || 0;
    const maxRepayment = getBalanceInEther(repayAmount || BigNumber.from(0));

    // max leverage calculation to prevent utilization is greater than 1
    const lenderWethAvailable = getBalanceInEther(
      loanLenderVault?.wethBalance || BigNumber.from(0)
    );
    const interesteAccrued = repayValue - loanValue;
    const leverageAvailable = Math.max(
      0,
      originMaxLtv < 0.9
        ? originMaxLtv * (collateralValue - interesteAccrued * 2)
        : originMaxLtv * (collateralValue - loanValue - interesteAccrued * 2)
    );
    const maxLeverage = Math.min(leverageAvailable, lenderWethAvailable);

    if (leverageTab === LeverageTab.LeverUp) {
      return (amount * 100) / maxLeverage;
    }

    if (leverageTab === LeverageTab.Increase) {
      return (amount * 100) / Math.max(0, maxLeverage - loanValue);
    }
    return (amount * 100) / maxRepayment;
  };

  const reset = () => {
    setPositionAmount("");
    setTargetLeverage("");
    setClosed(true);
    setTimeout(() => {
      setClosed(false);
      setPositionStatus(TxStatus.None);
      setOldPosition("");
      setPositionChange("");
      setNewPosition("");
    }, 500);
    setFocused(false);
    setTargetAmount("");
    setSliderStep(0);
  };

  useEffect(() => {
    setTooltipVisible(leverageHover || tooltipHover);
    setTargetAmount("");
    setSliderStep(0);
    setLeverageApproveRequired(
      myNfts.find((nft) => nft.tokenId === selectedNftId)?.isApproved
        ? false
        : true
    );

    if (!selectedNft || (selectedNft && !selectedNft.isEscrowed)) {
      if (leverageTab === LeverageTab.LeverUp) return;
      setLeverageTab(LeverageTab.LeverUp);
    } else if (selectedNft && !selectedNft.loan.balance) {
    } else {
      if (
        [
          LeverageTab.Increase,
          LeverageTab.Decrease,
          LeverageTab.Refinance,
        ].includes(leverageTab)
      )
        return;

      setLeverageTab(LeverageTab.Increase);
    }
  }, [selectedNftId]);

  useEffect(() => {
    setTooltipVisible(leverageHover || tooltipHover);
  }, [leverageHover, tooltipHover]);

  useEffect(() => {
    if (!open) return;

    if (defaultNftId) {
      setSelectedNftId(defaultNftId);
    } else {
      if (myNfts.length > 0) {
        setSelectedNftId(myNfts[0].tokenId);
      }
    }
  }, [open, defaultNftId, myNfts.length]);

  useEffect(() => {
    setTooltipVisible(false);
    setPositionSelected(isLeverageModal ? false : true);
    setIsDeposit(!isLeverageModal ? !isDeprecatedVault : false);
    // setLeverageTab(LeverageTab.Increase);
  }, [open, isLeverageModal, vault.address]);

  useEffect(() => {
    setClosed(false);
    setFocused(false);
  }, [positionAmount, targetLeverage, targetAmount]);

  useEffect(() => {
    setClosed(false);
  }, [focused]);

  useEffect(() => {
    reset();
  }, [isDeposit, positionSelected, leverageTab]);

  const onConfirmPosition = async () => {
    if (positionStatus === TxStatus.None) {
      setPositionStatus(TxStatus.Pending);
      setOldPosition(getBalanceInEther(getPositionBalance()).toFixed(3));
      setPositionChange(getBalanceInEther(amountInWei).toFixed(3));
      setNewPosition(
        getBalanceInEther(
          isDeposit
            ? getPositionBalance().add(amountInWei)
            : getPositionBalance().sub(amountInWei)
        ).toFixed(3)
      );
      try {
        if (isDeposit) {
          if (useWeth) {
            if (isApprove()) {
              await (isFungible
                ? onVaultApprove
                : selectedNft?.lendAddr
                ? onApproveWeth
                : onNftVaultApprove)();
              setPositionStatus(TxStatus.None);
            } else {
              if (isFungible) await onVaultDeposit(amountInWei);
              else if (selectedNft) {
                if (selectedNft.lendAddr) {
                  await onLendingDeposit(selectedNft.loan.loanId, amountInWei);
                } else
                  await onNftVaultDeposit(selectedNft.tokenId, amountInWei);
              }
              setPositionStatus(TxStatus.Finish);
            }
          } else {
            if (isFungible) await onVaultDepositETH(amountInWei);
            else if (selectedNft) {
              if (selectedNft.lendAddr)
                await onLendingDepositETH(selectedNft.loan.loanId, amountInWei);
              else await onNftVaultDepositETH(selectedNft.tokenId, amountInWei);
            }
            setPositionStatus(TxStatus.Finish);
          }
        } else {
          if (isFungible) {
            await (useWeth ? onVaultWithdraw : onVaultWithdrawETH)(amountInWei);
          } else if (selectedNft) {
            if (selectedNft.lendAddr) {
              await (useWeth ? onLendingWithdraw : onLendingWithdrawETH)(
                selectedNft.loan.loanId,
                amountInWei
              );
            } else {
              await (useWeth ? onNftVaultWithdraw : onNftVaultWithdrawETH)(
                selectedNft.tokenId,
                amountInWei
              );
            }
          }
          setPositionStatus(TxStatus.Finish);
        }
        setPositionAmount("");
        setAmountInWei(BigNumber.from("0"));
        dispatch(setPendingTxHash(""));
        dispatch(fetchVaultUserDataAsync(account, vault));
      } catch (err) {
        setPositionStatus(TxStatus.None);
        setOldPosition("");
        setPositionChange("");
        setNewPosition("");
      }
    } else if (positionStatus === TxStatus.Finish) {
      reset();
    }
  };

  const onConfirmLeverage = async () => {
    reset();
  };

  const onCloseRightModal = () => {
    if (leverageApproveRequired && selectedNft?.isApproved) {
      setLeverageApproveRequired(false);
    }
    setClosed(true);
    setFocused(false);
    setTargetAmount("");
    setSliderStep(0);
    setTimeout(() => {
      setClosed(false);
      dispatch(setActionStatus(ActionStatus.Initial));
    }, 500);
  };

  const handleHidePopup = () => {
    setHiding(true);
    setTimeout(() => {
      setHiding(false);
    }, 700);
  };

  const onCloseModal = () => {
    dispatch(setActionStatus(ActionStatus.Initial));
    dispatch(setActionError(undefined));
    dispatch(setPendingTxHash(""));
    if (onClose) onClose();
  };

  // slider input handling
  const onSetSliderStep = (val: number) => {
    setSliderStep(val);
  };

  // input handling
  const onSetTargetAmount = (val: string) => {
    setTargetAmount(val);
  };

  const getAdditionalAmnout = () => {
    if (leverageTab === "Refinance") return 0;
    if (leverageTab === LeverageTab.Increase) {
      return getAmountFromSliderStep(sliderStep);
    }
    return getAmountFromSliderStep(sliderStep);
  };

  const showRightModal = useCallback(() => {
    if (closed) return false;
    if (focused) return true;
    if (positionSelected) {
      return positionStatus === TxStatus.Finish || positionAmount !== "";
    } else {
      if (selectedNft && !selectedNft.isApproved) return true;
      if (leverageTab === LeverageTab.Refinance) return true;
      if (leverageTab === LeverageTab.Renew) return true;
      if (actionStatus === ActionStatus.Success) return true;
      if (leverageTab === LeverageTab.Increase) {
        if (!selectedNft) return false;

        return (
          getAmountFromSliderStep(sliderStep) > 0 && getAdditionalAmnout() > 0
        );
      }

      return getAmountFromSliderStep(sliderStep) > 0;
    }
  }, [
    closed,
    focused,
    positionSelected,
    positionStatus,
    positionAmount,
    actionStatus,
    leverageTab,
    sliderStep,
    targetAmount,
  ]);

  const isApprove = () => {
    if (!isDeposit) return false;
    if (!useWeth) return false;
    return amountInWei.gt(allowance || BigNumber.from("0"));
  };

  const getPositionBalance = () => {
    return isFungible
      ? vault.userInfo.depositAmnt
      : selectedNft?.amount || BigNumber.from("0");
  };

  const getBalance = () => {
    return isDeposit
      ? useWeth
        ? userWethBalance
        : userEthBalance
      : getPositionBalance();
  };

  const onChangeAmount = (newAmount: string) => {
    while (newAmount.split(".").length - 1 > 1 && newAmount.endsWith(".")) {
      newAmount = newAmount.slice(0, -1);
    }
    if (!isValidNumber(newAmount)) return;
    let newAmountInWei = getBalanceInWei(Number(newAmount).toString() || "0");
    if (newAmountInWei.gt(getBalance())) {
      newAmountInWei = getBalance();
    }
    if (newAmountInWei.gt(0)) {
      newAmount = utils.formatEther(newAmountInWei);
      const decimalPart = newAmount.split(".")[1];
      if (decimalPart && decimalPart.length > 7) {
        newAmount =
          (Math.floor(parseFloat(newAmount) * 10 ** 7) / 10 ** 7).toString() +
          "...";
      }
    }
    setPositionAmount(newAmount);
    setAmountInWei(newAmountInWei);
  };

  const onClickMax = () => {
    onChangeAmount("9999999999");
  };

  const getAdditionalDebt = () => {
    if (!selectedNft) return 0;

    const additionalDebt =
      leverageTab === LeverageTab.Decrease
        ? getAmountFromSliderStep(sliderStep) * -1
        : getAmountFromSliderStep(sliderStep);

    return additionalDebt;
  };

  const getRefinanceApr = () => {
    if (!selectedNft) return 0;
    const loanLenderVault =
      leverageTab === LeverageTab.LeverUp
        ? leverageVaults.find((row: any) => !row.deprecated)
        : leverageVaults.find((row: any) => row.address === loanLender);
    const currentLend = lendData.find(
      (row: any) => row.address === selectedNft?.lendAddr
    );
    if (!loanLenderVault) return 0;

    const collateralValue = getBalanceInEther(selectedNft.value);
    const originMaxLtv = currentLend?.loanRatio || 0;
    const additionalDebt = getAdditionalDebt();
    const total = getBalanceInEther(
      loanLenderVault?.totalAssets || BigNumber.from(0)
    );
    const available = getBalanceInEther(
      loanLenderVault?.wethBalance || BigNumber.from(0)
    );
    const duration =
      leverageTab === LeverageTab.Decrease
        ? (selectedNft?.loan?.terms?.duration || 0) / DAY_IN_SECONDS
        : YEAR_IN_DAYS;
    const ltv =
      originMaxLtv > 1
        ? getAmountFromSliderStep(sliderStep) /
          (collateralValue + additionalDebt)
        : getAmountFromSliderStep(sliderStep) / collateralValue;
    return (
      100 * calculateBorrowApr(ltv, additionalDebt, total, available, duration)
    );
  };

  const getBorrowApr = () => {
    // if (leverageTab === LeverageTab.LeverUp) return 0;
    if (leverageTab === LeverageTab.Decrease)
      return 100 * (selectedNft?.borrowApr || 0);
    return getRefinanceApr();
  };

  const calculateNetApy = () => {
    if (!selectedNft) return 0;
    const loanDuration = 28 * DAY_IN_SECONDS;
    const m = YEAR_IN_SECONDS / loanDuration;
    const borrowApr = getBorrowApr() / 100;
    const { repayAmount, balance } = selectedNft.loan;
    const loanValue = getBalanceInEther(balance || BigNumber.from(0));
    const repayValue = getBalanceInEther(repayAmount || BigNumber.from(0));
    // eslint-disable-next-line no-restricted-properties
    const borrowApy = Math.pow(1 + borrowApr / m, m) - 1;
    const vaultApy = (defaultVault?.apr || 0) / 100;
    const { value } = selectedNft;
    const additionalDebt = getAdditionalDebt();
    return (
      100 *
      getNetApy(
        getBalanceInEther(value) + additionalDebt,
        vaultApy,
        repayValue + additionalDebt,
        borrowApy
      )
    );
  };

  return (
    <Modal open={open} onClose={onCloseModal}>
      <div className="mx-8 flex items-center gap-3 font-medium h-[364px] max-w-[864px] z-50">
        <div className="flex flex-col gap-3 pt-10 h-full">
          <Card
            className="!pt-4 !pb-2 !px-2 justify-center items-center leading-5 border-1 border-gray-200 !bg-gray-700 !bg-opacity-95"
            notBlur
          >
            <h2 className="font-base text-white leading-5">
              {vault?.readable || ""}
            </h2>
            <div className="flex flex-col lg:flex-row gap-x-3 font-bold text-base text-orange-200 my-1 tracking-tight">
              <div className="flex gap-1 items-center">
                <span className="drop-shadow-orange-200 leading-5">
                  {`Ξ${(vault?.tvl || 0).toFixed(1)}`}
                </span>
                <span className="text-xs text-gray-200">TVL</span>
              </div>
              <div className="flex gap-1 items-center">
                <span className="drop-shadow-orange-200 leading-5">
                  {`${(vault?.apy || 0).toFixed(2)}%`}
                </span>
                <span className="text-xs text-gray-200">APY</span>
              </div>
            </div>
          </Card>
          {vault.receiptToken === ReceiptToken.NFT ? (
            <PrologueNftCard
              containerClassName="w-[176px] lg:w-[198px]"
              nfts={myNfts}
              selectedNftId={selectedNftId}
              onItemChanged={(_: any, idx: number) => setSelectedNftId(idx)}
              footerClassName="!h-10"
              expanded
              showBorder
            />
          ) : (
            <>
              <Erc20Card
                className="w-[176px] lg:w-[198px]"
                bgImg={vault.logo}
                footerClassName="!h-10"
                expanded
                position={getBalanceInEther(vault.userInfo.depositAmnt).toFixed(
                  2
                )}
              />
            </>
          )}
        </div>
        <Card
          className="flex flex-col border-1 border-gray-200 !py-0 !px-0 h-full flex-1 !bg-gray-700 !bg-opacity-95 w-[calc(min(50vw,500px))] lg:w-[500px]"
          notBlur
        >
          <div className="flex items-center border-b-1 border-gray-200 h-10 text-xs">
            <button
              className={`${
                positionSelected ? "flex-1" : "w-[78px] lg:flex-1 lg:w-auto"
              } h-full transition-all ${
                positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200 hover:text-gray-300"
              }`}
              disabled={positionSelected}
              onClick={() => {
                handleHidePopup();
                setPositionSelected(true);
              }}
            >
              POSITION
            </button>
            <button
              className={`flex-1 h-full transition-all ${
                !positionSelected
                  ? "bg-orange-200 bg-opacity-10 rounded-r text-orange-200 text-shadow-orange-200"
                  : "text-gray-200"
              } ${
                vault.receiptToken !== ReceiptToken.ERC20
                  ? "hover:text-gray-300"
                  : ""
              }`}
              disabled={
                !positionSelected ||
                (selectedNft && getBalanceInEther(selectedNft.value) === 0)
              }
              onClick={() => {
                if (vault.receiptToken === ReceiptToken.NFT) {
                  handleHidePopup();
                  setPositionSelected(false);
                  if (selectedNft && !selectedNft.isEscrowed) {
                    setLeverageTab(LeverageTab.LeverUp);
                  } else {
                    setLeverageTab(LeverageTab.Increase);
                  }
                }
              }}
              onMouseOver={() => {
                if (vault.receiptToken === ReceiptToken.ERC20) {
                  setLeverageHover(true);
                }
              }}
              onMouseLeave={() => {
                if (vault.receiptToken === ReceiptToken.ERC20) {
                  setLeverageHover(false);
                }
              }}
            >
              LEVERAGE
            </button>
          </div>
          {positionSelected ? (
            <>
              <div className="flex items-center px-2 py-3">
                <div className="flex items-center gap-2 w-1/2 pr-2">
                  {!isDeprecatedVault && (
                    <Button
                      type={isDeposit ? "third" : "secondary"}
                      className={`flex-1 h-6 w-[78px] flex items-center justify-center !border-0 ${
                        isDeposit ? "" : "shadow-transparent"
                      }`}
                      disabled={isDeposit}
                      onClick={() => {
                        handleHidePopup();
                        setIsDeposit(true);
                      }}
                    >
                      <span className="text-xs">DEPOSIT</span>
                    </Button>
                  )}
                  <Button
                    type={
                      !isDeposit || isDeprecatedVault ? "third" : "secondary"
                    }
                    className={`flex-1 h-6 w-[78px] flex items-center justify-center !border-0 ${
                      !isDeposit || isDeprecatedVault
                        ? ""
                        : "shadow-transparent"
                    }`}
                    disabled={!isDeposit || isDeprecatedVault}
                    onClick={() => {
                      handleHidePopup();
                      if (!isDeprecatedVault) {
                        setIsDeposit(false);
                      }
                    }}
                  >
                    <span className="text-xs">WITHDRAW</span>
                  </Button>
                </div>
                {tooltipVisible && (
                  <div
                    className="flex flex-1 -mt-6 ml-2"
                    onMouseEnter={() => setTooltipHover(true)}
                    onMouseLeave={() => setTooltipHover(false)}
                  >
                    <div className="text-gray-200 rounded bg-gray-200 bg-opacity-10 shadow-card flex-1 mt-6 h-6 w-[78px] flex items-center justify-center !border-0 shadow-transparent text-xs gap-1 cursor-pointer">
                      <a className="underline">Prologue NFT</a>
                      <span className="lg:hidden">only.</span>
                      <span className="hidden lg:block">
                        exclusive feature.
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <PositionInput
                isDeposit={isDeposit}
                useWeth={useWeth}
                toggleEth={() => setUseWeth(!useWeth)}
                value={positionAmount}
                setValue={onChangeAmount}
                onMax={onClickMax}
                txStatus={positionStatus}
                txHash={pendingTxHash}
                showTooltip={tooltipVisible}
                onFocus={() => setFocused(true)}
                balance={getBalanceInEther(getBalance()).toFixed(5)}
                usdVal={(parseFloat(positionAmount || "0") * ethPrice).toFixed(
                  2
                )}
                vaultBalance={getBalanceInEther(
                  vault.wethBalance || BigNumber.from(0)
                ).toFixed(2)}
              />
            </>
          ) : (
            <>
              <div className="flex flex-row-reverse px-2 py-3">
                {/* renew */}
                {selectedNft &&
                  selectedNft.isEscrowed &&
                  selectedNft.isRenewAvailable && (
                    <div className="w-[calc(100%-70px)] lg:w-1/2 pl-2 flex items-center gap-2">
                      <Button
                        type={
                          leverageTab === LeverageTab.Renew
                            ? "third"
                            : "secondary"
                        }
                        className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                          leverageTab === LeverageTab.Renew
                            ? ""
                            : "shadow-transparent"
                        }`}
                        disabled={leverageTab === LeverageTab.Renew}
                        onClick={() => {
                          handleHidePopup();
                          setLeverageTab(LeverageTab.Renew);
                        }}
                      >
                        <span className="text-xs">RENEW</span>
                      </Button>
                    </div>
                  )}
                {/* increase/decrease/refinance */}
                {selectedNft &&
                  selectedNft.isEscrowed &&
                  !selectedNft.isRenewAvailable && (
                    <div className="w-[calc(100%-70px)] lg:w-1/2 pl-2 flex items-center gap-2">
                      <Button
                        type={
                          leverageTab === LeverageTab.Increase
                            ? "third"
                            : "secondary"
                        }
                        className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                          leverageTab === LeverageTab.Increase
                            ? ""
                            : "shadow-transparent"
                        }`}
                        disabled={leverageTab === LeverageTab.Increase}
                        onClick={() => {
                          handleHidePopup();
                          setLeverageTab(LeverageTab.Increase);
                        }}
                      >
                        <span className="text-xs">INCREASE</span>
                      </Button>
                      <Button
                        type={
                          leverageTab === LeverageTab.Decrease
                            ? "third"
                            : "secondary"
                        }
                        className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                          leverageTab === LeverageTab.Decrease
                            ? ""
                            : "shadow-transparent"
                        }`}
                        disabled={leverageTab === LeverageTab.Decrease}
                        onClick={() => {
                          handleHidePopup();
                          setLeverageTab(LeverageTab.Decrease);
                        }}
                      >
                        <span className="text-xs">DECREASE</span>
                      </Button>
                      <Button
                        type={
                          leverageTab === LeverageTab.Refinance
                            ? "third"
                            : "secondary"
                        }
                        className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                          leverageTab === LeverageTab.Refinance
                            ? ""
                            : "shadow-transparent"
                        }`}
                        disabled={leverageTab === LeverageTab.Refinance}
                        onClick={() => {
                          handleHidePopup();
                          if (showRightModal()) {
                            setClosed(true);
                            setTimeout(() => {
                              setClosed(false);
                              setLeverageTab(LeverageTab.Refinance);
                            }, 700);
                          } else {
                            setLeverageTab(LeverageTab.Refinance);
                          }
                        }}
                      >
                        <span className="text-xs">REFINANCE</span>
                      </Button>
                    </div>
                  )}
                {/* approve / lever up */}
                {selectedNft && !selectedNft.isEscrowed && (
                  <div className="w-[calc(100%-70px)] lg:w-1/2 pl-2 flex items-center gap-2">
                    <Button
                      type={
                        leverageTab === LeverageTab.LeverUp
                          ? "third"
                          : "secondary"
                      }
                      className={`h-6 flex-1 flex items-center justify-center !border-0 ${
                        leverageTab === LeverageTab.LeverUp
                          ? ""
                          : "shadow-transparent"
                      }`}
                      disabled={leverageTab === LeverageTab.LeverUp}
                      onClick={() => setLeverageTab(LeverageTab.LeverUp)}
                    >
                      <span className="text-xs">
                        {leverageApproveRequired ? "APPROVE" : "LEVER UP"}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
              {selectedNft && (
                <LeverageInput
                  nft={selectedNft}
                  tab={leverageTab}
                  requireApprove={leverageApproveRequired}
                  onFocus={() => setFocused(true)}
                  sliderStep={sliderStep}
                  targetAmount={targetAmount}
                  loanLender={loanLender}
                  updateLoanLender={updateLoanLender}
                  onSetSliderStep={onSetSliderStep}
                  onSetTargetAmount={onSetTargetAmount}
                  getAmountFromSliderStep={getAmountFromSliderStep}
                  getSliderStepFromAmount={getSliderStepFromAmount}
                />
              )}
            </>
          )}
        </Card>
        <ConfirmPopup
          nft={selectedNft}
          vault={vault}
          borrowApr={getBorrowApr()}
          netApy={calculateNetApy()}
          additionalDebt={getAdditionalDebt()}
          sliderStep={sliderStep}
          targetAmount={targetAmount}
          oldPosition={
            oldPosition || getBalanceInEther(getPositionBalance()).toFixed(3)
          }
          positionChange={
            positionChange || getBalanceInEther(amountInWei).toFixed(3)
          }
          newPosition={
            newPosition ||
            getBalanceInEther(
              isDeposit
                ? getPositionBalance().add(amountInWei)
                : getPositionBalance().sub(amountInWei)
            ).toFixed(3)
          }
          positionSelected={positionSelected}
          isDeposit={isDeposit}
          isApprove={isApprove()}
          positionStatus={positionStatus}
          leverageTab={leverageTab}
          onLeverageMaxClicked={() => {}}
          show={showRightModal()}
          hiding={hiding}
          onConfirm={() =>
            positionSelected ? onConfirmPosition() : onConfirmLeverage()
          }
          onClose={onCloseRightModal}
          onSetSliderStep={onSetSliderStep}
          onSetTargetAmount={onSetTargetAmount}
        />
      </div>
    </Modal>
  );
}
