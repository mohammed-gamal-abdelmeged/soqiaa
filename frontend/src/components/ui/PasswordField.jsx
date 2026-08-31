import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordField({
  label,
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  error,
  disabled = false,
  icon: Icon,
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-main"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={21}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
        )}

        <input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`
            h-12 w-full rounded-xl border bg-white
            px-4 pl-12 ${Icon ? 'pr-12' : ''}
            text-base text-text-main outline-none transition
            placeholder:text-gray-400
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70
            ${
              error
                ? 'border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-outline focus:border-secondary focus:ring-1 focus:ring-secondary'
            }
          `}
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          disabled={disabled}
          aria-label={showPassword ? 'إخفاء الباسورد' : 'إظهار الباسورد'}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <Eye size={21} />
          ) : (
            <EyeOff size={21} />
          )}
        </button>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default PasswordField