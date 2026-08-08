/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { useAuthContext } from "../hooks/AuthContext";
import { commerceApi } from "../api/client";
import ui from "../components/ui.module.css";

const STATUS_COLORS: Record<string, string> = {
  pending: ui.badgeGray,
  paid: ui.badgeGreen,
  processing: ui.badgeBlack,
  shipped: ui.badgeBlack,
  delivered: ui.badgeGreen,
  cancelled: ui.badgeRed,
  refunded: ui.badgeRed,
};

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

const formatETB = (cents: number) => `ETB ${(cents / 100).toLocaleString()}`;

export default function CommercePage() {
  const { hasPermission } = useAuthContext();

  const [settings, setSettings] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "orders">("overview");

  const [credentialsForm, setCredentialsForm] = useState({
    chapa_public_key: "",
    chapa_secret_key: "",
    chapa_webhook_secret: "",
  });
  const [showSecrets, setShowSecrets] = useState({ key: false, webhook: false });
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);

  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState({ status: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const data = await commerceApi.getSettings();
      setSettings(data);
      setCredentialsForm({
        chapa_public_key: data.chapa_public_key || "",
        chapa_secret_key: "",
        chapa_webhook_secret: data.chapa_webhook_secret || "",
      });
      if (data.is_active) {
        await Promise.all([loadStats(), loadOrders()]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await commerceApi.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load stats");
    }
  }

  async function loadOrders(params?: string) {
    try {
      const data = await commerceApi.getOrders(params);
      setOrders(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
    }
  }

  async function handleSaveCredentials() {
    setSaving(true);
    setTestResult(null);
    try {
      const result: any = await commerceApi.saveSettings(credentialsForm);
      if (result.success) {
        setTestResult({ success: true });
        setCredentialsSaved(true);
      } else {
        setTestResult({ success: false, error: result.error });
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err?.message || "Failed to save credentials" });
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate() {
    setSaving(true);
    try {
      await commerceApi.activate();
      setActivateModal(false);
      await loadSettings();
    } catch (err: any) {
      setError(err?.message || "Failed to activate");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    setSaving(true);
    try {
      await commerceApi.deactivate();
      setDeactivateModal(false);
      await loadSettings();
    } catch (err: any) {
      setError(err?.message || "Failed to deactivate");
    } finally {
      setSaving(false);
    }
  }

  function applyOrderFilters() {
    const params = new URLSearchParams();
    if (orderStatusFilter) params.set("status", orderStatusFilter);
    if (orderSearch) params.set("search", orderSearch);
    const qs = params.toString();
    loadOrders(qs ? `?${qs}` : "");
  }

  function openOrder(order: any) {
    setSelectedOrder(order);
    setOrderForm({ status: order.status, notes: order.notes || "" });
    setOrderModal(true);
  }

  async function handleSaveOrder() {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const updated = await commerceApi.updateOrder(selectedOrder.id, orderForm);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
      setOrderModal(false);
      if (settings?.is_active) loadStats();
    } catch (err: any) {
      setError(err?.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  function parseJson(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (loading) return <div className={ui.loading}>Loading...</div>;

  return (
    <div>
      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Commerce</h1>
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {settings?.is_active && (
        <div className={ui.tabs}>
          <button
            className={tab === "overview" ? ui.tabActive : ui.tab}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={tab === "orders" ? ui.tabActive : ui.tab}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>
        </div>
      )}

      {(!settings?.is_active || tab === "overview") && (
        <OverviewTab
          settings={settings}
          stats={stats}
          orders={orders}
          credentialsForm={credentialsForm}
          setCredentialsForm={setCredentialsForm}
          showSecrets={showSecrets}
          setShowSecrets={setShowSecrets}
          testResult={testResult}
          saving={saving}
          onSaveCredentials={handleSaveCredentials}
          activateModal={activateModal}
          setActivateModal={setActivateModal}
          onActivate={handleActivate}
          deactivateModal={deactivateModal}
          setDeactivateModal={setDeactivateModal}
          onDeactivate={handleDeactivate}
          onViewAllOrders={() => setTab("orders")}
          onViewOrder={openOrder}
          formatETB={formatETB}
        />
      )}

      {settings?.is_active && tab === "orders" && (
        <OrdersTab
          orders={orders}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          orderSearch={orderSearch}
          setOrderSearch={setOrderSearch}
          onApply={applyOrderFilters}
          onViewOrder={openOrder}
          formatETB={formatETB}
        />
      )}

      {orderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          orderForm={orderForm}
          setOrderForm={setOrderForm}
          onClose={() => setOrderModal(false)}
          onSave={handleSaveOrder}
          saving={saving}
          parseJson={parseJson}
          canUpdate={hasPermission("commerce", "update")}
        />
      )}
    </div>
  );
}

function OverviewTab(props: any) {
  const {
    settings,
    stats,
    orders,
    credentialsForm,
    setCredentialsForm,
    showSecrets,
    setShowSecrets,
    testResult,
    saving,
    onSaveCredentials,
    activateModal,
    setActivateModal,
    onActivate,
    deactivateModal,
    setDeactivateModal,
    onDeactivate,
    onViewAllOrders,
    onViewOrder,
    formatETB,
  } = props;

  if (!settings?.is_active) {
    return (
      <div className={ui.card} style={{ maxWidth: 560, margin: "40px auto" }}>
        <ShoppingBag size={40} color="#ccc" style={{ display: "block", marginBottom: 16 }} />
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Ready to activate commerce?</h2>
        <p>
          Connect your Chapa account to start accepting payments. Use test keys to explore
          without processing real payments.
        </p>

        <div className={ui.form}>
          <div className={ui.field}>
            <label className={ui.label}>Chapa Public Key</label>
            <input
              className={ui.input}
              type="text"
              value={credentialsForm.chapa_public_key}
              onChange={(e) =>
                setCredentialsForm({ ...credentialsForm, chapa_public_key: e.target.value })
              }
            />
          </div>

          <div className={ui.field}>
            <label className={ui.label}>Chapa Secret Key</label>
            <div style={{ position: "relative" }}>
              <input
                className={ui.input}
                type={showSecrets.key ? "text" : "password"}
                value={credentialsForm.chapa_secret_key}
                onChange={(e) =>
                  setCredentialsForm({ ...credentialsForm, chapa_secret_key: e.target.value })
                }
              />
              <button
                type="button"
                className={ui.iconBtn}
                onClick={() => setShowSecrets({ ...showSecrets, key: !showSecrets.key })}
              >
                {showSecrets.key ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={ui.field}>
            <label className={ui.label}>Webhook Secret</label>
            <div style={{ position: "relative" }}>
              <input
                className={ui.input}
                type={showSecrets.webhook ? "text" : "password"}
                value={credentialsForm.chapa_webhook_secret}
                onChange={(e) =>
                  setCredentialsForm({ ...credentialsForm, chapa_webhook_secret: e.target.value })
                }
              />
              <button
                type="button"
                className={ui.iconBtn}
                onClick={() => setShowSecrets({ ...showSecrets, webhook: !showSecrets.webhook })}
              >
                {showSecrets.webhook ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <p className={ui.hint}>Find your keys at dashboard.chapa.co</p>

          {testResult?.success && (
            <p style={{ color: "green" }}>✓ Credentials verified — ready to activate</p>
          )}
          {testResult?.error && <div className={ui.errorMsg}>{testResult.error}</div>}

          <button
            type="button"
            className={`${ui.btn} ${ui.btnPrimary}`}
            style={{ width: "100%", marginTop: 16 }}
            disabled={saving}
            onClick={onSaveCredentials}
          >
            Test & Save Credentials
          </button>

          {testResult?.success && (
            <button
              type="button"
              className={`${ui.btn} ${ui.btnPrimary}`}
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setActivateModal(true)}
            >
              Activate Commerce
            </button>
          )}
        </div>

        {activateModal && (
          <div className={ui.overlay}>
            <div className={ui.modal}>
              <div className={ui.modalHeader}>
                <h3 className={ui.modalTitle}>Activate Commerce</h3>
                <button className={ui.modalClose} onClick={() => setActivateModal(false)}>
                  ×
                </button>
              </div>
              <div className={ui.modalBody}>
                <p className={ui.confirmText}>
                  Activating commerce will show the cart on your website. Continue?
                </p>
              </div>
              <div className={ui.modalFooter}>
                <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setActivateModal(false)}>
                  Cancel
                </button>
                <button className={`${ui.btn} ${ui.btnPrimary}`} disabled={saving} onClick={onActivate}>
                  Activate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className={ui.card}>
          <div className={ui.cardTitle}>Total Orders</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats?.total_orders ?? 0}</div>
        </div>
        <div className={ui.card}>
          <div className={ui.cardTitle}>Total Revenue</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {formatETB(stats?.total_revenue ?? 0)}
          </div>
        </div>
        <div className={ui.card}>
          <div className={ui.cardTitle}>Pending</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats?.pending_count ?? 0}</div>
        </div>
        <div className={ui.card}>
          <div className={ui.cardTitle}>This Month</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>
            {formatETB(stats?.this_month_revenue ?? 0)}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Recent Orders</h2>
      <OrdersTable orders={orders.slice(0, 10)} onViewOrder={onViewOrder} formatETB={formatETB} />
      <button className={`${ui.btn} ${ui.btnSecondary}`} style={{ marginTop: 12 }} onClick={onViewAllOrders}>
        View All Orders →
      </button>

      <div className={ui.card} style={{ border: "1px solid #fcc", padding: 16, marginTop: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Deactivate Commerce</h3>
        <p>This will hide the cart from your website. Existing orders are not affected.</p>
        <button className={`${ui.btn} ${ui.btnDanger}`} onClick={() => setDeactivateModal(true)}>
          Deactivate
        </button>
      </div>

      {deactivateModal && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <h3 className={ui.modalTitle}>Deactivate Commerce</h3>
              <button className={ui.modalClose} onClick={() => setDeactivateModal(false)}>
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
              <p className={ui.confirmText}>
                This will hide the cart from your website. Existing orders are not affected.
              </p>
              <p className={ui.confirmSub}>Are you sure you want to continue?</p>
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setDeactivateModal(false)}>
                Cancel
              </button>
              <button className={`${ui.btn} ${ui.btnDanger}`} disabled={saving} onClick={onDeactivate}>
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab(props: any) {
  const {
    orders,
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearch,
    setOrderSearch,
    onApply,
    onViewOrder,
    formatETB,
  } = props;

  return (
    <div>
      <div className={ui.fieldRow} style={{ marginBottom: 16 }}>
        <div className={ui.field}>
          <label className={ui.label}>Status</label>
          <select
            className={ui.select}
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className={ui.field}>
          <label className={ui.label}>Search</label>
          <input
            className={ui.input}
            placeholder="Search order # or email"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
          />
        </div>
        <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={onApply}>
          Apply
        </button>
      </div>

      <OrdersTable orders={orders} onViewOrder={onViewOrder} formatETB={formatETB} />
    </div>
  );
}

function OrdersTable({ orders, onViewOrder, formatETB }: any) {
  if (orders.length === 0) {
    return <div className={ui.empty}>No orders found</div>;
  }

  return (
    <div className={ui.tableWrap}>
      <table className={ui.table}>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.customer_name}</td>
              <td>{order.customer_email}</td>
              <td>{order.total === 0 ? "TBD" : formatETB(order.total)}</td>
              <td>
                <span className={`${ui.badge} ${STATUS_COLORS[order.status] || ui.badgeGray}`}>
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
              <td>
                <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => onViewOrder(order)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderDetailModal(props: any) {
  const { order, orderForm, setOrderForm, onClose, onSave, saving, parseJson, canUpdate } = props;

  const address = parseJson(order.shipping_address);
  const items = parseJson(order.items) || [];

  return (
    <div className={ui.overlay}>
      <div className={ui.modal} style={{ maxWidth: 640 }}>
        <div className={ui.modalHeader}>
          <h3 className={ui.modalTitle}>Order {order.order_number}</h3>
          <button className={ui.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={ui.modalBody}>
          <h4>Customer</h4>
          <p>Name: {order.customer_name}</p>
          <p>Email: {order.customer_email}</p>
          <p>Phone: {order.customer_phone}</p>
          <p>
            Address:{" "}
            {address
              ? `${address.street || ""} ${address.city || ""} ${address.country || ""}`.trim()
              : order.shipping_address}
          </p>

          <h4>Items</h4>
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4>Payment</h4>
          <p>Total: {(order.total / 100).toLocaleString()} {order.currency}</p>
          <p>Currency: {order.currency}</p>
          <p>Transaction Ref: {order.chapa_tx_ref || "—"}</p>
          <p>Verified At: {order.payment_verified_at || "Not yet verified"}</p>

          <h4>Status</h4>
          <span className={`${ui.badge} ${STATUS_COLORS[order.status] || ui.badgeGray}`}>
            {order.status}
          </span>

          <div className={ui.field} style={{ marginTop: 12 }}>
            <label className={ui.label}>Change Status</label>
            <select
              className={ui.select}
              value={orderForm.status}
              onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
              disabled={!canUpdate}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={ui.field}>
            <label className={ui.label}>Notes (internal)</label>
            <textarea
              className={ui.textarea}
              value={orderForm.notes}
              onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              disabled={!canUpdate}
            />
          </div>

          {canUpdate && (
            <button className={`${ui.btn} ${ui.btnPrimary}`} disabled={saving} onClick={onSave}>
              Save Changes
            </button>
          )}
        </div>
        <div className={ui.modalFooter}>
          <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


