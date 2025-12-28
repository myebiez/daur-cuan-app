import React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const Badge = ({ children, status = "Active", className = "" }) => {
  // Logic warna berdasarkan Status
  const styles = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Maintenance: "bg-amber-100 text-amber-700 border-amber-200",
    Full: "bg-rose-100 text-rose-700 border-rose-200",
  };

  // Logic Icon berdasarkan Status
  const icons = {
    Active: <CheckCircle2 size={12} className="mr-1" />,
    Maintenance: <AlertCircle size={12} className="mr-1" />,
    Full: <XCircle size={12} className="mr-1" />,
  };

  // Label Text (Jika children kosong, gunakan default text)
  const label =
    children ||
    (status === "Active"
      ? "Tersedia"
      : status === "Maintenance"
      ? "Perbaikan"
      : "Penuh");

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center w-fit ${
        styles[status] || styles.Active
      } ${className}`}
    >
      {icons[status]}
      {label}
    </span>
  );
};

export default Badge;
