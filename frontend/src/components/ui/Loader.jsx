function Loader({ text = 'جاري التحميل...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-secondary" />

      <span className="text-sm text-text-muted">
        {text}
      </span>
    </div>
  )
}

export default Loader