import { useEffect, useState } from "react";
import { checkoutApi } from "../api";

interface CommerceStatus {
  is_active: boolean;
  currency: string;
}

let cached: CommerceStatus | null = null;

export function useCommerce() {
  const [status, setStatus] = useState<CommerceStatus | null>(cached);
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    if (cached !== null) {
      setStatus(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;

    checkoutApi
      .getStatus()
      .then((data) => {
        if (cancelled) return;
        cached = data;
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setStatus({ is_active: false, currency: "ETB" });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    isActive: status?.is_active || false,
    currency: status?.currency || "ETB",
    loading,
  };
}
