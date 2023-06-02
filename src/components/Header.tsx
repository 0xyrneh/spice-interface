import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

import LogoSVG from "@/assets/icons/logo.svg";
import { NavOption } from "@/types/common";
import { VaultSearch, ConnectWallet } from "@/components/common";
import { NAV_OPTIONS } from "@/constants";
import { useUI } from "@/hooks";
import useAuth from "@/hooks/useAuth";
import {
  fetchVaultGlobalDataAsync,
  fetchLendGlobalDataAsync,
  fetchNftGlobalDataAsync,
  fetchVaultUserDataAsync,
  fetchLendUserLoanDataAsync,
  fetchLendUserWethDataAsync,
  resetLendUserLoanData,
  fetchLendUserNftApproveDataAsync,
} from "@/state/actions";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { VaultInfo } from "@/types/vault";
import { getSpiceFiLendingAddresses } from "@/utils/addressHelpers";
import { connectorLocalStorageKey } from "@/config/constants/wallet";
import { ConnectorNames } from "@/types/wallet";

const Header = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // const { account } = useWeb3React();
  const account = "0x013823485705f0773Ba8230D6Ed0B06a3d95C706";
  const { vaults, defaultVault } = useAppSelector((state) => state.vault);
  const router = useRouter();
  const { blur } = useUI();
  const { login } = useAuth();
  const lendAddrs = getSpiceFiLendingAddresses();
  const userNfts = defaultVault?.userInfo?.nftsRaw || [];

  const dispatch = useAppDispatch();

  const persistConnect = () => {
    const connectorId = window.localStorage.getItem(
      connectorLocalStorageKey
    ) as ConnectorNames;
    if (connectorId) {
      login(connectorId);
    }
  };

  const fetchData = async () => {
    dispatch(fetchVaultGlobalDataAsync());
    dispatch(fetchLendGlobalDataAsync());
    dispatch(fetchNftGlobalDataAsync());
  };

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 60000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    persistConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (vaults.length === 0) return;

    vaults.map((row: VaultInfo) => {
      dispatch(fetchVaultUserDataAsync(account, row));
      return row;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, vaults.length]);

  useEffect(() => {
    dispatch(resetLendUserLoanData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    lendAddrs.map((lendAddr: any) => {
      dispatch(
        fetchLendUserLoanDataAsync(lendAddr, account, defaultVault?.address)
      );
      dispatch(fetchLendUserWethDataAsync(lendAddr, account));
      return lendAddr;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, defaultVault]);

  useEffect(() => {
    if (userNfts.length === 0) return;

    lendAddrs.map((lendAddr: any) =>
      userNfts.map((row: any) => {
        dispatch(
          fetchLendUserNftApproveDataAsync(lendAddr, row.tokenId, account)
        );
        return row;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userNfts.length]);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const linkClass = (option: NavOption) => {
    if (
      router.pathname === option.href ||
      router.pathname.startsWith(option.href + "/", 0) ||
      (option.name === "Vaults" &&
        router.pathname.startsWith("/vault" + "/", 0))
    ) {
      return "text-orange-200 text-shadow-orange-900";
    }
    return "hover:text-gray-300";
  };

  const activeTab = () => {
    for (let i = 0; i < NAV_OPTIONS.length; i += 1) {
      const option = NAV_OPTIONS[i];
      if (
        router.pathname === option.href ||
        router.pathname.startsWith(option.href + "/", 0)
      ) {
        return option;
      }
    }
    return NAV_OPTIONS[1];
  };

  return (
    <div
      className={`z-10 hidden ${
        activeTab().breakpoint
      }:flex fixed w-full h-16 bg-gray-700 bg-opacity-90 items-center justify-between px-8 font-bold
      max-w-[${activeTab().maxWidth}] ${
        activeTab().name !== "Vaults" || show ? "top-0" : "-top-[64px]"
      } ${blur ? "blur-[5px]" : ""}`}
      style={{ transition: "top 0.4s ease-in-out" }}
    >
      <div className="flex-1 flex items-center gap-7 xl:gap-10 min-w-[420px] xl:min-w-[500px]">
        <Link href="/">
          <LogoSVG />
        </Link>

        {NAV_OPTIONS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`hidden md:flex text-gray-200 text-xs xl:text-sm ${linkClass(
              item
            )}`}
          >
            {item.name.toUpperCase()}
          </Link>
        ))}
      </div>

      <VaultSearch />
      <div className="flex-1 flex justify-end">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Header;
