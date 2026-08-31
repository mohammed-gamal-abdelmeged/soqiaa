import { X } from 'lucide-react'

function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-xl`}
      >
        <div className="flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-bold text-text-main">
              {title}
            </h2>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mr-auto text-red-500 transition hover:text-gray-800"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>

        <div className={title ? 'mt-4' : ''}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal