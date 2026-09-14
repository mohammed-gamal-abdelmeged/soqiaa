export default function StatCard({
  title,
  value,
  icon: Icon,
  iconClassName = "",
}) {
  return (
    <article className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div>
        <p className="mb-2 text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="text-2xl font-bold tracking-tight text-slate-900">
          {Number(value).toLocaleString("ar-EG")}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon size={22} strokeWidth={1.8} />
      </div>
    </article>
  );
}