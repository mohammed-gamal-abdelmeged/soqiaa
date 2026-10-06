import {
  Check,
} from "lucide-react";

function SuccessToast({
  message,
  name,
}) {
  return (
    <div
      dir="rtl"
      className="
        success-toast-card
        relative
        w-[calc(100vw-32px)]
        max-w-sm
        overflow-hidden
        rounded-2xl
        border
        border-secondary/15
        bg-white/95
        px-5
        py-4
        shadow-[0_16px_45px_rgba(0,27,61,0.14)]
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-secondary/10
            text-secondary
          "
        >
          <Check
            size={24}
            strokeWidth={3}
          />
        </div>

        <div className="min-w-0">
          <p
            className="
              truncate
              text-sm
              font-bold
              text-primary
            "
          >
            اهلا بيك
            {name
              ? ` ${name}`
              : ""}
          </p>

          <p
            className="
              mt-1
              text-sm
              leading-6
              text-text-muted
            "
          >
            {message}
          </p>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          h-1
          w-full
          bg-secondary/10
        "
      >
        <div
          className="
            success-toast-progress
            h-full
            bg-secondary
          "
        />
      </div>
    </div>
  );
}

export default SuccessToast;