import {
  Heart,
  Home,
  LayoutGrid,
  PackageSearch,
  ReceiptText,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  useCart,
} from "../../features/cart/context/useCart";

import logo from "../../assets/images/logo.png";

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
    label: "العروض",
    to: "/offers",
    icon: PackageSearch,
  },
  {
    label: "طلباتي",
    to: "/orders",
    icon: ReceiptText,
  },
];

function StoreHeader() {
  const {
    totalItems,
  } = useCart();

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-white/40
        bg-white/75
        backdrop-blur-xl
        backdrop-saturate-150
        shadow-[0_4px_20px_rgba(0,27,61,0.04)]
      "
    >
      <div
        className="
          relative
          mx-auto
          flex
          h-20
          w-full
          max-w-[1180px]
          items-center
          justify-center
          px-5

          md:justify-between
          md:gap-6

          lg:px-6
        "
      >
        {/* Logo */}
        <NavLink
          to="/home"
          className="
            shrink-0

            md:order-1
          "
          aria-label="الصفحة الرئيسية"
        >
          <img
            src={logo}
            alt="سوقيا"
            className="
              h-16
              w-16
              object-contain

              md:h-[68px]
              md:w-[68px]
            "
          />
        </NavLink>

        {/* Desktop / Tablet Navigation */}
        <nav
          className="
            hidden
            min-w-0
            flex-1
            items-center
            justify-center
            gap-1

            md:flex
            md:order-2

            lg:gap-2
          "
        >
          {navigationItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  className={({
                    isActive,
                  }) => `
                    flex
                    items-center
                    gap-2
                    whitespace-nowrap
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    transition

                    lg:px-4

                    ${
                      isActive
                        ? "bg-green-50 text-secondary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                    }
                  `}
                >
                  <Icon
                    size={18}
                  />

                  <span>
                    {
                      item.label
                    }
                  </span>
                </NavLink>
              );
            },
          )}
        </nav>

        {/* Desktop / Tablet Actions */}
        <div
          className="
            hidden
            shrink-0
            items-center
            gap-2

            md:flex
            md:order-3
          "
        >
          <NavLink
            to="/favorites"
            aria-label="المفضلة"
            className={({ isActive }) => `
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              transition

              ${
                isActive
                  ? "bg-green-50 text-secondary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
              }
            `}
          >
            <Heart
              size={21}
            />
          </NavLink>

          <NavLink
            to="/cart"
            aria-label={`السلة - ${totalItems} منتج`}
            className={({ isActive }) => `
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              transition

              ${
                isActive
                  ? "bg-green-50 text-secondary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
              }
            `}
          >
            <ShoppingCart
              size={22}
            />

            {totalItems > 0 && (
              <span
                className="
                  absolute
                  -left-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary
                  px-1
                  text-[10px]
                  font-bold
                  leading-none
                  text-white
                "
              >
                {totalItems > 99
                  ? "99+"
                  : totalItems}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex
              items-center
              gap-2
              rounded-xl
              px-3
              py-2.5
              text-sm
              font-semibold
              transition

              ${
                isActive
                  ? "bg-green-50 text-secondary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary"
              }
            `}
          >
            <User
              size={20}
            />

            <span
              className="
                hidden

                lg:inline
              "
            >
              حسابي
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default StoreHeader;