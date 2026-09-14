export default function StatusSwitch({
  checked,
  onChange,
  activeLabel = "نشط",
  inactiveLabel = "غير نشط",
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-7 w-13 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-emerald-600" : "bg-red-500",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200",
            checked ? "right-1" : "right-7",
          ].join(" ")}
        />
      </button>

      <span
        className={[
          "text-sm font-semibold",
          checked
            ? "text-emerald-700"
            : "text-red-600",
        ].join(" ")}
      >
        {checked ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}