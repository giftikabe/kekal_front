import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { checkoutApi } from "../api";

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [txRef, setTxRef] = useState("");

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("tx_ref");
    if (!ref) {
      setLoading(false);
      return;
    }
    setTxRef(ref);

    checkoutApi
      .verify(ref)
      .then((data) => {
        setVerified(!!data.verified);
        setOrderNumber(data.order_number || "");
        setLoading(false);
      })
      .catch(() => {
        setVerified(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "var(--section-pad-block) 0",
        }}
      >
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (verified) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "var(--section-pad-block) var(--section-pad-inline)",
        }}
      >
        <Check size={48} color="var(--color-ink)" aria-hidden="true" />
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-display-md)",
          }}
        >
          Thank you for your order!
        </h1>
        <p style={{ fontSize: "var(--text-display-sm)", fontWeight: 300 }}>
          Order #{orderNumber}
        </p>
        <p style={{ color: "var(--color-mute)" }}>
          Your order details have been sent to your email. Our team will be in
          touch regarding delivery.
        </p>
        <Link
          to="/collections"
          style={{
            display: "inline-block",
            marginTop: "var(--space-md)",
            padding: "1rem 2rem",
            border: "1px solid var(--color-ink)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wide)",
            fontSize: "var(--text-label)",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        padding: "var(--section-pad-block) var(--section-pad-inline)",
      }}
    >
      <X size={48} color="var(--color-ink)" aria-hidden="true" />
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display-md)",
        }}
      >
        Payment could not be verified
      </h1>
      <p style={{ color: "var(--color-mute)" }}>
        Please contact us with your transaction reference: {txRef}
      </p>
      <Link to="/contact">Contact us</Link>
    </div>
  );
}