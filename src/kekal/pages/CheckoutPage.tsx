import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { checkoutApi } from "../api";

interface CheckoutFormState {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useCart();

  const [form, setForm] = useState<CheckoutFormState>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/collections");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(field: keyof CheckoutFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !form.customer_name ||
      !form.customer_email ||
      !form.customer_phone ||
      !form.shipping_address
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await checkoutApi.initiate({
        items,
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        shipping_address: JSON.stringify({ full: form.shipping_address }),
      });
      window.location.href = response.payment_url;
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "var(--section-pad-block) var(--section-pad-inline)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-display-md)",
          fontWeight: 300,
        }}
      >
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <section style={{ marginTop: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "var(--text-body-lg)", fontWeight: 500 }}>
            Your Information
          </h2>

          <div style={{ marginTop: "var(--space-sm)" }}>
            <label style={{ display: "block", fontSize: "var(--text-label)" }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.customer_name}
              onChange={(e) => handleChange("customer_name", e.target.value)}
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          <div style={{ marginTop: "var(--space-sm)" }}>
            <label style={{ display: "block", fontSize: "var(--text-label)" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.customer_email}
              onChange={(e) => handleChange("customer_email", e.target.value)}
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          <div style={{ marginTop: "var(--space-sm)" }}>
            <label style={{ display: "block", fontSize: "var(--text-label)" }}>
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={form.customer_phone}
              onChange={(e) => handleChange("customer_phone", e.target.value)}
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>

          <div style={{ marginTop: "var(--space-sm)" }}>
            <label style={{ display: "block", fontSize: "var(--text-label)" }}>
              Shipping Address
            </label>
            <textarea
              required
              rows={3}
              placeholder="Street, City, Country"
              value={form.shipping_address}
              onChange={(e) => handleChange("shipping_address", e.target.value)}
              style={{ width: "100%", padding: "0.75rem" }}
            />
          </div>
        </section>

        <section style={{ marginTop: "var(--space-lg)" }}>
          <h2 style={{ fontSize: "var(--text-body-lg)", fontWeight: 500 }}>
            Order Summary
          </h2>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{ display: "flex", gap: "var(--space-sm)", padding: "var(--space-xs) 0" }}
            >
              <img
                src={item.mainImage}
                alt={item.name}
                loading="lazy"
                decoding="async"
                style={{ width: 50, height: 50, objectFit: "cover" }}
              />
              <div>
                <p>{item.name}</p>
                <p style={{ color: "var(--color-mute)" }}>Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
          <p style={{ color: "var(--color-mute)", marginTop: "var(--space-sm)" }}>
            Final total will be confirmed upon order processing.
          </p>
        </section>

        {error && <p style={{ color: "red", marginTop: "var(--space-sm)" }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "1rem 2rem",
            border: "1px solid var(--color-ink)",
            background: "var(--color-ink)",
            color: "var(--color-paper)",
            cursor: submitting ? "not-allowed" : "pointer",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wide)",
            fontSize: "var(--text-label)",
            marginTop: "var(--space-lg)",
          }}
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}