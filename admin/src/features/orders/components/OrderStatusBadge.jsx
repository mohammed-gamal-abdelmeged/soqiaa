import { getOrderStatusMeta } from "../utils/orderStatus";

export default function OrderStatusBadge({
  status,
}) {
  const statusMeta =
    getOrderStatusMeta(status);

  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-full border px-2.5 py-1",
        "text-[11px] font-semibold",
        statusMeta.className,
      ].join(" ")}
    >
      {statusMeta.label}
    </span>
  );
}