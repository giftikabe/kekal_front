import { Link } from "react-router-dom";
import styles from "./Btn.module.css";

interface BtnProps {
  label: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "text";
  size?: "sm" | "md";
  fullWidth?: boolean;
}

export default function Btn({ label, to, href, onClick, variant = "primary", size = "md", fullWidth = false }: BtnProps) {
  const className = `${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.full : ""}`;

  if (to) return <Link to={to} className={className}>{label}</Link>;
  if (href) return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{label}</a>;
  return <button className={className} onClick={onClick}>{label}</button>;
}
