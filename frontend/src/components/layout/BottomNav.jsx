import {
  Home,
  LayoutGrid,
  ShoppingCart,
  ReceiptText,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useCart } from "../../features/cart/context/useCart";

const navigationItems = [
  {
    label: "الرئيسية",
    to: "/home",
    icon: Home,
  },
  {
    label: "الأقسام",
    to: "/categories",
    icon: LayoutGrid,
  },
  {
    label: "السلة",
    to: "/cart",
    icon: ShoppingCart,
    isCart: true,
  },
  {
    label: "طلباتي",
    to: "/orders",
    icon: ReceiptText,
  },
  {
    label: "حسابي",
    to: "/profile",
    icon: User,
  },
];

function BottomNav() {
  const { totalItems } = useCart();

  return (
    <nav
      className="
        fixed bottom-0 left-0 z-50
        w-full
        border-t border-gray-100
        bg-white
        px-3 pb-3 pt-2
        shadow-[0_-6px_24px_rgba(0,27,61,0.08)]
        md:hidden
      "
    >
      <div
        className="
          relative mx-auto
          flex h-[68px] max-w-md
          items-center justify-between
        "
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;

          if (item.isCart) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={`السلة - ${totalItems} منتج`}
                className="
                  relative z-20
                  flex w-[74px]
                  flex-col items-center
                  justify-end
                  text-xs
                "
              >
                <div
                  className="
                    absolute -top-10
                    flex h-[75px] w-[75px]
                    items-center justify-center
                    rounded-full
                    border-[5px]
                    bg-secondary
                    text-white
                    shadow-[0_8px_0px_rgba(0,110,28,0.3)]
                    transition
                    active:scale-95
                  "
                >
                  <ShoppingCart size={31} strokeWidth={2.2} />

                  {totalItems > 0 && (
                    <span
                      className="
                        absolute -right-1 -top-1
                        flex h-6 min-w-6
                        items-center justify-center
                        rounded-full
                        border-2 border-white
                        bg-[#0b8f2a]
                        px-1 text-[11px]
                        font-bold text-white
                        shadow-sm
                      "
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>

                <span
                  className="
                    mt-11 font-semibold
                    text-secondary
                  "
                >
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex min-w-14
                flex-col items-center
                justify-center
                rounded-xl px-2 py-1
                text-xs transition
                ${
                  isActive
                    ? "bg-green-50 font-semibold text-secondary"
                    : "text-gray-500"
                }
              `}
            >
              <Icon size={23} />

              <span className="mt-1">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;