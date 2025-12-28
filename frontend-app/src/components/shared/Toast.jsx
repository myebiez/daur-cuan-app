import React from "react";
import { useApp } from "../../context/AppContext";

const Toast = () => {
  const { state } = useApp();

  if (!state.toast.visible) return null;

  const color =
    state.toast.type === "error"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-emerald-50 text-emerald-700 border-emerald-100";

  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-[60] px-4">
      <div
        className={`px-4 py-3 rounded-2xl shadow-lg border text-sm font-medium w-full max-w-xs text-center ${color}`}
      >
        {state.toast.message}
      </div>
    </div>
  );
};

export default Toast;
