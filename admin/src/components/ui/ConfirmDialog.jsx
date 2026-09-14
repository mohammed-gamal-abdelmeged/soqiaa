import { AlertTriangle } from "lucide-react";

import Modal from "./Modal";

export default function ConfirmDialog({
  isOpen,
  title = "تأكيد الإجراء",
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  onClose,
  onConfirm,
  variant = "danger",
}) {
  const confirmStyles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-emerald-700 hover:bg-emerald-800";

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`h-11 rounded-xl px-5 text-sm font-semibold text-white transition ${confirmStyles}`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="p-5">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </div>

        <p className="text-sm leading-6 text-slate-700">
          {description}
        </p>
      </div>
    </Modal>
  );
}