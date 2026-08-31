function TextField({
  label,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  error,
  disabled = false,
  icon: Icon,
  dir,
  prefix,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-text-main">
        {label}
      </label>

      <div className="relative">
        {Icon && !prefix && (
          <Icon
            size={21}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
        )}

        {prefix && (
          <div
            dir="ltr"
            className="
        absolute right-4 top-1/2 z-10
        flex -translate-y-1/2 items-center gap-2
        border-l border-gray-300 pl-3
        text-base font-medium text-text-main
      "
          >
            <span>🇪🇬</span>
            <span>{prefix}</span>
          </div>
        )}

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          dir={dir}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
      h-12 w-full rounded-xl border bg-white px-4
      ${prefix ? "pr-28" : Icon ? "pr-12" : ""}
      text-base text-text-main outline-none transition
      placeholder:text-gray-400
      disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70
      ${
        error
          ? "border-red-500 focus:ring-2 focus:ring-red-100"
          : "border-outline focus:border-secondary focus:ring-1 focus:ring-secondary"
      }
    `}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextField;
