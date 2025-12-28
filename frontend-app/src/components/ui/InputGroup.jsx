import React from "react";

const InputGroup = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-slate-700 dark:text-slate-200">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
    />
  </div>
);

export default InputGroup;
