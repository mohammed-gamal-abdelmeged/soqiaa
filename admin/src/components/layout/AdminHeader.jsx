import { Menu } from "lucide-react";
import logo from "../../assets/brand/soqiaa-logo.png";

export default function AdminHeader({ onOpenSidebar }) {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="فتح القائمة"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

            <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Soqiaa"
            className="h-10 w-auto object-contain sm:h-10"
          />
        </div>

      </div>
    </header>
  );
}