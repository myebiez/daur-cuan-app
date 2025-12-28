import React, { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext";

// Import komponen UI yang sudah kita pisah
import Button from "../ui/Button";
import InputGroup from "../ui/InputGroup";

// --- SUB-COMPONENT: Form Redeem ---
const RedeemForm = ({ method }) => {
  const { state, actions } = useApp();
  const [amount, setAmount] = useState("");

  return (
    <div className="space-y-4">
      <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-800 text-sm">
        Saldo: <b>{state.wallet.points} pts</b>
      </div>
      <InputGroup
        label="Nominal Poin"
        type="number"
        placeholder="Min 1000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        fullWidth
        onClick={() => actions.redeemPoints(parseInt(amount), method)}
      >
        Redeem
      </Button>
    </div>
  );
};

// --- SUB-COMPONENT: Form Edit Profile ---
const EditProfileForm = () => {
  const { state, actions } = useApp();
  const [form, setForm] = useState({
    name: state.user.name,
    email: state.user.email,
  });

  return (
    <div className="space-y-4">
      <InputGroup
        label="Nama"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <InputGroup
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Button fullWidth onClick={() => actions.updateProfile(form)}>
        Simpan
      </Button>
    </div>
  );
};

// --- MAIN COMPONENT: Modal ---
// src/components/shared/Modal.jsx

const Modal = () => {
  const { state, actions } = useApp();

  // --- TAMBAHKAN PENGAMAN DISINI ---
  // Jika state belum siap atau modal tidak ada, jangan render apa-apa
  if (!state || !state.modal) return null;

  const { modal } = state;

  // Ubah baris yang error (modal.type) menjadi lebih aman dengan tanda tanya (?)
  if (!modal?.type) return null;

  let title = "";
  let content = null;

  // ... (kode sisanya sama)

  if (modal.type === "redeem") {
    title = `Redeem ${modal.data?.method}`;
    content = <RedeemForm method={modal.data?.method} />;
  } else if (modal.type === "editProfile") {
    title = "Edit Profil";
    content = <EditProfileForm />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
            {title}
          </h3>
          <button
            onClick={actions.closeModal}
            className="text-slate-500 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Modal;
