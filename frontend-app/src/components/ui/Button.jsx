import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  fullWidth = false,
  ...props
}) => {
  const base = fullWidth ? "w-full" : "inline-flex";
  const variantClass =
    variant === "primary"
      ? "py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg"
      : "py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200";

  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
