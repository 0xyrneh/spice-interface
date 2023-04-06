import { useState } from "react";
import vaults from "@/constants/vaults";
import Image from "next/image";
import Link from "next/link";
import { Vault } from "@/types/vault";

export default function VaultList() {
  const [activeVaultIndex, setActiveVaultIndex] = useState(0);

  const getActiveVault = () => vaults[activeVaultIndex];
  const getVaultBackground = (vault?: Vault) =>
    (vault ?? getActiveVault()).bg ?? "/assets/images/bgEmptyVault.png";

  return (
    <div className="flex flex-col">
      <div
        className="aspect-[1930/1080] bg-cover hidden md:flex flex-col-reverse px-20 py-16 gap-3.5 text-light font-Sanomat font-semibold"
        style={{
          backgroundImage: `url(${getVaultBackground()})`,
        }}
      >
        <div className="flex px-5 gap-[22px] pt-9 overflow-x-auto">
          {vaults.map((vault, index) => (
            <button
              key={`vault-${index}`}
              className="flex flex-col-reverse aspect-[328/219] bg-cover min-w-[328px] px-4 py-[26px] text-lg rounded shadow-sm border-1 border-light hover:-translate-y-2"
              style={{
                backgroundImage: `url(${getVaultBackground(vault)})`,
              }}
              onClick={() => setActiveVaultIndex(index)}
            >
              {vault.name}
            </button>
          ))}
        </div>
        <div className="flex items-center mt-5 font-SuisseIntl gap-15">
          <div className="flex flex-col">
            <span className="text-gray text-xl">TVL</span>
            <span className="text-1.5xl">Ξ{getActiveVault().tvl}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray text-xl">APY</span>
            <span className="text-1.5xl">{getActiveVault().apy}%</span>
          </div>
          <button className="flex justify-between items-center rounded bg-secondary bg-opacity-45 px-4.5 py-3 gap-16 hover:border-1 hover:border-light">
            <span className="font-Sanomat text-xl">View Vault</span>
            <Image
              src="/assets/icons/arrowRight.svg"
              width={18}
              height={14}
              alt=""
            />
          </button>
        </div>
        <h3 className="text-2xl font-SuisseIntl">
          BY {getActiveVault().creator.toUpperCase()}
        </h3>
        <h2 className="text-2.5xl">{getActiveVault().name}</h2>
      </div>
      <div className="bg-secondary bg-opacity-[.95] h-20 hidden md:flex items-center justify-center">
        <span className="text-light text-xl font-Sanomat font-semibold">
          The Prologue Leverage Vault is now LIVE! Deposit now to support
          Prologue Holders 🐪🏜️
        </span>
      </div>
      <div className="hidden md:flex flex-col font-semibold px-20 py-25">
        <h1 className="text-2.5xl text-yellow font-Sanomat">Vault List</h1>

        <table className="text-gray font-SuisseIntl text-base mx-5 border-b-1 border-b-gray">
          <thead>
            <tr className="table table-fixed w-full text-right border-b-1 border-b-gray">
              <th className="text-left py-2">Vault</th>
              <th>TVL</th>
              <th>APY</th>
              <th>1d Change</th>
              <th>7d Change</th>
              <th>Creator</th>
              <th>Receipt Token</th>
            </tr>
          </thead>
          <tbody className="block max-h-[876px] overflow-y-auto no-scrollbar [&>tr>td]:pt-4 [&>:last-child>td]:py-4">
            {vaults.map((vault, index) => (
              <tr
                key={`vault-${index}`}
                onClick={() => setActiveVaultIndex(index)}
                className="vault-row table table-fixed w-full text-right cursor-pointer"
              >
                <td className="text-left">
                  <div
                    className={`${
                      vault.favorite
                        ? "border-l-yellow"
                        : "border-l-transparent"
                    } border-l-8 flex items-center h-[70px] ml-px gap-5.5 bg-secondary rounded-l pl-[42px]`}
                  >
                    <Image src={vault.icon} width={42} height={42} alt="" />
                    {vault.name}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end h-[70px] bg-secondary">
                    Ξ{vault.tvl}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end h-[70px] bg-secondary">
                    {vault.apy}%
                  </div>
                </td>
                <td
                  className={` ${
                    vault.oneDayChange >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  <div className="flex items-center justify-end h-[70px] bg-secondary">
                    {vault.oneDayChange >= 0
                      ? "+" + vault.oneDayChange
                      : vault.oneDayChange}
                    %
                  </div>
                </td>
                <td
                  className={` ${
                    vault.sevenDayChange >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  <div className="flex items-center justify-end h-[70px] bg-secondary">
                    {vault.sevenDayChange >= 0
                      ? "+" + vault.sevenDayChange
                      : vault.sevenDayChange}
                    %
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end h-[70px] bg-secondary">
                    {vault.creator}
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-end mr-px h-[70px] bg-secondary rounded-r pr-12.5">
                    {vault.receiptToken}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-center mt-10">
          <Link
            target="__blank"
            href="https://docs.spicefi.xyz/"
            className="text-yellow font-SuisseIntl text-1.5xl"
          >
            Want to create your own vault? →
          </Link>
        </div>
      </div>

      <div className="bg-secondary bg-opacity-[.95] hidden md:flex items-center justify-center pt-11 pb-10 text-gray text-base">
        <div className="flex gap-16">
          <div className="flex flex-col gap-[30px]">
            <div className="flex gap-3">
              <Image
                src="/assets/icons/docs.svg"
                width={20}
                height={20}
                alt=""
              />
              <Link target="__blank" href="https://docs.spicefi.xyz/">
                Docs
              </Link>
            </div>
            <div className="flex gap-3">
              <Image
                src="/assets/icons/github.svg"
                width={20}
                height={20}
                alt=""
              />
              <Link target="__blank" href="https://github.com">
                Github
              </Link>
            </div>
          </div>

          <Image
            src="/assets/icons/spice.svg"
            width={81.75}
            height={75}
            alt=""
          />

          <div className="flex flex-col gap-[30px]">
            <div className="flex gap-3">
              <Image
                src="/assets/icons/discord.svg"
                width={20}
                height={20}
                alt=""
              />
              <Link
                target="__blank"
                href="https://discord.com/invite/spicefinance"
              >
                Discord
              </Link>
            </div>
            <div className="flex gap-3">
              <Image
                src="/assets/icons/twitter.svg"
                width={20}
                height={20}
                alt=""
              />
              <Link target="__blank" href="https://twitter.com/spice_finance">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center md:hidden h-screen text-yellow-light px-[26px] gap-3 font-semibold">
        <h1 className="text-[26px] font-Sanomat text-shadow-yellow-light">
          Mobile is not supported.
        </h1>
        <h3 className="text-base font-SuisseIntl text-shadow-yellow-light">
          To interact with the Spice dApp, please use a desktop.
        </h3>
      </div>
    </div>
  );
}
