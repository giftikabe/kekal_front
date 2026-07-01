/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Pencil, Trash2, ShieldCheck, Power } from "lucide-react";
import { usersApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ui from "../components/ui.module.css";

type Tab = "users" | "roles" | "password";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}
interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
interface Permission {
  id: string;
  entity: string;
  action: string;
}

const ENTITIES = [
  "brand",
  "collections",
  "products",
  "events",
  "upcoming_events",
  "pages",
  "page_sections",
  "page_seo",
  "about_content_blocks",
  "navigation",
];
const ACTIONS = ["create", "read", "update", "delete"];

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

export default function UsersPage() {
  const { user: currentUser } = useAuthContext();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userModal, setUserModal] = useState<
    "create" | "delete" | "permissions" | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({ email: "", name: "", roleId: "" });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [userSaving, setUserSaving] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const [roleModal, setRoleModal] = useState<
    "create" | "delete" | "permissions" | null
  >(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [roleSaving, setRoleSaving] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: "", isError: false });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [u, r] = await Promise.all([
          usersApi.getAll(),
          usersApi.getRoles(),
        ]);
        setUsers(u as AdminUser[]);
        setRoles(r as Role[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openCreateUser = () => {
    const pw = generatePassword();
    setGeneratedPassword(pw);
    setUserForm({ email: "", name: "", roleId: "" });
    setPasswordCopied(false);
    setUserModal("create");
  };

  const handleCreateUser = async () => {
    setUserSaving(true);
    try {
      const result = (await usersApi.create({
        ...userForm,
        password: generatedPassword,
      })) as AdminUser;
      setUsers([
        ...users,
        { ...result, isActive: true, createdAt: new Date().toISOString() },
      ]);
      setUserModal(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUserSaving(false);
    }
  };

  const handleToggleUser = async (u: AdminUser) => {
    try {
      await usersApi.update(u.id, { isActive: !u.isActive });
      setUsers(
        users.map((usr) =>
          usr.id === u.id ? { ...usr, isActive: !u.isActive } : usr,
        ),
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setUserSaving(true);
    try {
      await usersApi.delete(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setUserModal(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUserSaving(false);
    }
  };

  const openUserPermissions = async (u: AdminUser) => {
    setSelectedUser(u);
    const perms = (await usersApi.getUserPermissions(u.id)) as Permission[];
    setUserPermissions(perms);
    setUserModal("permissions");
  };

  const toggleUserPermission = async (entity: string, action: string) => {
    if (!selectedUser) return;
    const existing = userPermissions.find(
      (p) => p.entity === entity && p.action === action,
    );
    if (existing) {
      await usersApi.deleteUserPermission(selectedUser.id, existing.id);
      setUserPermissions(userPermissions.filter((p) => p.id !== existing.id));
    } else {
      const result = (await usersApi.addUserPermission(selectedUser.id, {
        entity,
        action,
      })) as Permission;
      setUserPermissions([...userPermissions, result]);
    }
  };

  const handleCreateRole = async () => {
    setRoleSaving(true);
    try {
      const result = (await usersApi.createRole(roleForm)) as Role;
      setRoles([...roles, result]);
      setRoleModal(null);
      setRoleForm({ name: "", description: "" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRoleSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    setRoleSaving(true);
    try {
      await usersApi.deleteRole(selectedRole.id);
      setRoles(roles.filter((r) => r.id !== selectedRole.id));
      setRoleModal(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRoleSaving(false);
    }
  };

  const openRolePermissions = async (r: Role) => {
    setSelectedRole(r);
    const perms = (await usersApi.getRolePermissions(r.id)) as Permission[];
    setRolePermissions(perms);
    setRoleModal("permissions");
  };

  const toggleRolePermission = async (entity: string, action: string) => {
    if (!selectedRole) return;
    const existing = rolePermissions.find(
      (p) => p.entity === entity && p.action === action,
    );
    if (existing) {
      await usersApi.deleteRolePermission(selectedRole.id, existing.id);
      setRolePermissions(rolePermissions.filter((p) => p.id !== existing.id));
    } else {
      const result = (await usersApi.addRolePermission(selectedRole.id, {
        entity,
        action,
      })) as Permission;
      setRolePermissions([...rolePermissions, result]);
    }
  };

  const handlePasswordChange = async () => {
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ text: "Passwords do not match", isError: true });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({
        text: "Password must be at least 8 characters",
        isError: true,
      });
      return;
    }
    setPwSaving(true);
    setPwMsg({ text: "", isError: false });
    try {
      await usersApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ text: "Password changed successfully.", isError: false });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e: any) {
      setPwMsg({ text: e.message, isError: true });
    } finally {
      setPwSaving(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
  };

  const TABS = [
    { key: "users" as Tab, label: "Users" },
    { key: "roles" as Tab, label: "Roles" },
    { key: "password" as Tab, label: "Change Password" },
  ];

  return (
    <div>
      <div className={ui.pageHeader}>
        <div className={ui.pageTitle}>Users & Roles</div>
      </div>
      {error && <div className={ui.errorMsg}>{error}</div>}

      <div className={ui.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${ui.tab} ${tab === t.key ? ui.tabActive : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={ui.loading}>Loading...</div>
      ) : (
        <>
          {tab === "users" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 16,
                }}
              >
                <button
                  className={`${ui.btn} ${ui.btnPrimary}`}
                  onClick={openCreateUser}
                >
                  + New User
                </button>
              </div>
              <div className={ui.tableWrap}>
                <table className={ui.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => u.id !== "super-admin")
                      .map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.name}</strong>
                          </td>
                          <td style={{ fontSize: 12, color: "#666" }}>
                            {u.email}
                          </td>
                          <td>
                            <span
                              className={`${ui.badge} ${u.isActive ? ui.badgeGreen : ui.badgeRed}`}
                            >
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: "#999" }}>
                            {u.createdAt?.split("T")[0]}
                          </td>
                          <td>
                            <div className={ui.actions}>
                              <button
                                className={ui.iconBtn}
                                onClick={() => openUserPermissions(u)}
                                aria-label="Permissions"
                                title="Permissions"
                              >
                                <ShieldCheck size={14} />
                              </button>
                              <button
                                className={ui.iconBtn}
                                onClick={() => handleToggleUser(u)}
                                aria-label={
                                  u.isActive ? "Deactivate" : "Activate"
                                }
                                title={u.isActive ? "Deactivate" : "Activate"}
                              >
                                <Power size={14} />
                              </button>
                              <button
                                className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                                onClick={() => {
                                  setSelectedUser(u);
                                  setUserModal("delete");
                                }}
                                aria-label="Delete"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {userModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>New Admin User</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setUserModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Name *</label>
                          <input
                            className={ui.input}
                            value={userForm.name}
                            onChange={(e) =>
                              setUserForm({ ...userForm, name: e.target.value })
                            }
                            placeholder="e.g. Sara Tesfaye"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Email *</label>
                          <input
                            className={ui.input}
                            type="email"
                            value={userForm.email}
                            onChange={(e) =>
                              setUserForm({
                                ...userForm,
                                email: e.target.value,
                              })
                            }
                            placeholder="name@kekalstudio.com"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>
                            Assign Role (optional)
                          </label>
                          <select
                            className={ui.select}
                            value={userForm.roleId}
                            onChange={(e) =>
                              setUserForm({
                                ...userForm,
                                roleId: e.target.value,
                              })
                            }
                          >
                            <option value="">No role</option>
                            {roles.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div
                          style={{
                            background: "#f5f5f5",
                            border: "1px solid #eee",
                            padding: 16,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#666",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              marginBottom: 8,
                            }}
                          >
                            Auto-Generated Password
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <code
                              style={{
                                fontSize: 14,
                                fontFamily: "monospace",
                                color: "#000",
                                flex: 1,
                                wordBreak: "break-all",
                              }}
                            >
                              {generatedPassword}
                            </code>
                            <button
                              type="button"
                              className={`${ui.btn} ${ui.btnSecondary}`}
                              style={{
                                padding: "6px 12px",
                                fontSize: 11,
                                flexShrink: 0,
                              }}
                              onClick={copyPassword}
                            >
                              {passwordCopied ? "Copied ✓" : "Copy"}
                            </button>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#999",
                              marginTop: 8,
                            }}
                          >
                            Share this password with the new user. They should
                            change it on first login.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setUserModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleCreateUser}
                        disabled={userSaving}
                      >
                        {userSaving ? "Creating..." : "Create User"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {userModal === "delete" && selectedUser && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Delete User</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setUserModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.confirmText}>
                        Delete <strong>{selectedUser.name}</strong>?
                      </div>
                      <div className={ui.confirmSub}>
                        This cannot be undone.
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setUserModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={handleDeleteUser}
                        disabled={userSaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {userModal === "permissions" && selectedUser && (
                <div className={ui.overlay}>
                  <div className={ui.modal} style={{ maxWidth: 680 }}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>
                        Permissions — {selectedUser.name}
                      </div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setUserModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <PermissionGrid
                        entities={ENTITIES}
                        actions={ACTIONS}
                        permissions={userPermissions}
                        onToggle={toggleUserPermission}
                      />
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={() => setUserModal(null)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "roles" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: 16,
                }}
              >
                <button
                  className={`${ui.btn} ${ui.btnPrimary}`}
                  onClick={() => {
                    setRoleForm({ name: "", description: "" });
                    setRoleModal("create");
                  }}
                >
                  + New Role
                </button>
              </div>
              <div className={ui.tableWrap}>
                <table className={ui.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <strong>{r.name}</strong>
                        </td>
                        <td style={{ color: "#666", fontSize: 12 }}>
                          {r.description}
                        </td>
                        <td>
                          <div className={ui.actions}>
                            <button
                              className={ui.iconBtn}
                              onClick={() => openRolePermissions(r)}
                              aria-label="Permissions"
                              title="Permissions"
                            >
                              <ShieldCheck size={14} />
                            </button>
                            <button
                              className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                              onClick={() => {
                                setSelectedRole(r);
                                setRoleModal("delete");
                              }}
                              aria-label="Delete"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {roleModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>New Role</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setRoleModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Role Name *</label>
                          <input
                            className={ui.input}
                            value={roleForm.name}
                            onChange={(e) =>
                              setRoleForm({ ...roleForm, name: e.target.value })
                            }
                            placeholder="e.g. Editor, Manager"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Description</label>
                          <textarea
                            className={ui.textarea}
                            style={{ minHeight: 70 }}
                            value={roleForm.description}
                            onChange={(e) =>
                              setRoleForm({
                                ...roleForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="What can this role do?"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setRoleModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleCreateRole}
                        disabled={roleSaving}
                      >
                        {roleSaving ? "Creating..." : "Create Role"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {roleModal === "delete" && selectedRole && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Delete Role</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setRoleModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.confirmText}>
                        Delete role <strong>{selectedRole.name}</strong>?
                      </div>
                      <div className={ui.confirmSub}>
                        Users assigned this role will lose its permissions.
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setRoleModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={handleDeleteRole}
                        disabled={roleSaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {roleModal === "permissions" && selectedRole && (
                <div className={ui.overlay}>
                  <div className={ui.modal} style={{ maxWidth: 680 }}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>
                        Permissions — {selectedRole.name}
                      </div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setRoleModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <PermissionGrid
                        entities={ENTITIES}
                        actions={ACTIONS}
                        permissions={rolePermissions}
                        onToggle={toggleRolePermission}
                      />
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={() => setRoleModal(null)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "password" && (
            <div style={{ maxWidth: 480 }}>
              <div className={ui.card}>
                <div className={ui.cardTitle}>Change Your Password</div>
                <div className={ui.form}>
                  {[
                    {
                      key: "currentPassword" as const,
                      label: "Current Password",
                      field: "current" as const,
                    },
                    {
                      key: "newPassword" as const,
                      label: "New Password",
                      field: "new" as const,
                    },
                    {
                      key: "confirm" as const,
                      label: "Confirm New Password",
                      field: "confirm" as const,
                    },
                  ].map(({ key, label, field }) => (
                    <div key={key} className={ui.field}>
                      <label className={ui.label}>{label}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className={ui.input}
                          type={showPw[field] ? "text" : "password"}
                          value={pwForm[key]}
                          onChange={(e) =>
                            setPwForm({ ...pwForm, [key]: e.target.value })
                          }
                          style={{ paddingRight: 56 }}
                        />
                        <button
                          type="button"
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 11,
                            color: "#999",
                            fontWeight: 600,
                          }}
                          onClick={() =>
                            setShowPw({ ...showPw, [field]: !showPw[field] })
                          }
                        >
                          {showPw[field] ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  ))}
                  {pwMsg.text && (
                    <div
                      style={{
                        padding: "10px 14px",
                        background: pwMsg.isError ? "#fff5f5" : "#f0faf0",
                        border: `1px solid ${pwMsg.isError ? "#fcc" : "#c0e0c0"}`,
                        color: pwMsg.isError ? "#c00" : "#2a7a2a",
                        fontSize: 13,
                      }}
                    >
                      {pwMsg.text}
                    </div>
                  )}
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={handlePasswordChange}
                    disabled={pwSaving}
                  >
                    {pwSaving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PermissionGrid({
  entities,
  actions,
  permissions,
  onToggle,
}: {
  entities: string[];
  actions: string[];
  permissions: Permission[];
  onToggle: (entity: string, action: string) => void;
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className={ui.table}>
        <thead>
          <tr>
            <th>Entity</th>
            {actions.map((a) => (
              <th key={a} style={{ textAlign: "center" }}>
                {a}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => (
            <tr key={entity}>
              <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                {entity}
              </td>
              {actions.map((action) => {
                const checked = permissions.some(
                  (p) => p.entity === entity && p.action === action,
                );
                return (
                  <td key={action} style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(entity, action)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
