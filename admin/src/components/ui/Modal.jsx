import { X } from "lucide-react";

export default function Modal({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidth = "max-w-2xl",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Overlay */}
      <button
        type="button"
        aria-label="إغلاق النافذة"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          relative z-10 flex w-full flex-col overflow-hidden
          rounded-2xl border border-slate-200 bg-white shadow-2xl
          ${maxWidth}

          max-h-[94dvh]
          sm:max-h-[92dvh]
          lg:max-h-[88vh]
        `}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-5 lg:px-6">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={19} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-4 lg:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}