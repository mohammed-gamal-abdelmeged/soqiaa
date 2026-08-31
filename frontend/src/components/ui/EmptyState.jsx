function EmptyState({
  title = 'لا توجد بيانات',
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <h3 className="text-lg font-bold text-text-main">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState