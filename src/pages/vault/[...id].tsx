import { useRouter } from "next/router";
import { VaultDetails } from "@/components/vaults";
import vaults from "@/constants/vaults";
import { useEffect, useState } from "react";
import { Vault } from "@/types/vault";

export default function VaultDetailsPage() {
  const router = useRouter();

  const { id }: { id?: string[] } = router.query;
  const [vault, setVault] = useState<Vault>();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (id && id.length && Number(id[0]) < vaults.length) {
      setVault(vaults[Number(id[0])]);
    } else {
      router.push(`/`);
    }
  }, [id, router]);

  if (vault) {
    return <VaultDetails vault={vault} />;
  } else {
    return <div></div>;
  }
}
