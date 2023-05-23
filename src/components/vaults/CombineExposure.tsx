import { useEffect, useState } from "react";

import { VaultInfo } from "@/types/vault";
import { MarketplaceExposure, CollectionExposure } from "../vaults";

type Props = {
  vault?: VaultInfo;
  className?: string;
  hasToggle?: boolean;
};

export default function CombineExposure({ vault, hasToggle }: Props) {
  const [exposureKey, setExposureKey] = useState("collection");

  const onToggle = () => {
    if (!hasToggle) return;
    if (exposureKey === "marketplace") setExposureKey("collection");
    else setExposureKey("marketplace");
  };

  useEffect(() => {
    setExposureKey("collection");
  }, [vault?.address]);

  return (
    <>
      <MarketplaceExposure
        className={`flex-1 ${exposureKey === "marketplace" ? "" : "hidden"}`}
        vault={vault}
        hasToggle={hasToggle}
        onToggle={onToggle}
      />
      <CollectionExposure
        className={`flex-1 ${exposureKey === "collection" ? "" : "hidden"}`}
        vault={vault}
        hasToggle={hasToggle}
        onToggle={onToggle}
      />
    </>
  );
}
