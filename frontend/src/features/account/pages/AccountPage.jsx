import {
  ChevronLeft,
  Heart,
  LogOut,
  MapPin,
  Phone,
  ReceiptText,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import BottomNav from "../../../components/layout/BottomNav";
import StoreHeader from "../../../components/layout/StoreHeader";

import AccountPageSkeleton from "../../../components/loaders/AccountPageSkeleton";

import {
  showError,
} from "../../../lib/toast";

import {
  useAuth,
} from "../../auth/context/useAuth";

import {
  useFavorites,
} from "../../favorites/context/useFavorites";

import {
  useMyProfile,
} from "./../hooks/useMyProfile";

function AccountPage() {
  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const {
    favoritesCount,
  } = useFavorites();

  const {
    data: currentUser,
    isPending,
    isError,
    error,
  } = useMyProfile();

  const handleLogout =
    async () => {
      try {
        await logout();

        navigate(
          "/login",
          {
            replace: true,
          },
        );
      } catch (
        logoutError
      ) {
        showError(
          logoutError?.message ||
            "تعذر تسجيل الخروج",
        );
      }
    };

  const menuItems = [
    {
      label: "طلباتي",
      icon: ReceiptText,
      onClick: () =>
        navigate(
          "/orders",
        ),
    },
    {
      label: "المفضلة",
      icon: Heart,
      badge:
        favoritesCount,
      onClick: () =>
        navigate(
          "/favorites",
        ),
    },
    {
      label: "بياناتي",
      icon: UserRound,
      onClick: () =>
        navigate(
          "/my-data",
        ),
    },
  ];

  if (isPending) {
    return (
      <AccountPageSkeleton />
    );
  }

  if (
    isError ||
    !currentUser
  ) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f8f9fa]
          px-5
        "
      >
        <div className="text-center">
          <p className="font-semibold text-primary">
            تعذر تحميل بيانات الحساب
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {error?.message ||
              "حاول مرة أخرى"}
          </p>
        </div>
      </div>
    );
  }

  const firstLetter =
    currentUser.fullName
      ?.trim()
      ?.charAt(0) ||
    "س";

  const address =
    currentUser.address
      ?.fullAddress ||
    "لا يوجد عنوان";

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 md:pb-10">
      {/* Tablet / Desktop Header */}
      <div className="hidden md:block">
        <StoreHeader />
      </div>

      {/* Mobile Header */}
      <header
        className="
          sticky
          top-0
          z-40
          flex
          h-16
          items-center
          justify-center
          bg-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]

          md:hidden
        "
      >
        <h1 className="text-2xl font-bold text-secondary">
          حسابي
        </h1>
      </header>

      <main
        className="
          mx-auto
          w-full
          max-w-md
          px-5
          py-5

          md:max-w-3xl
          md:px-6
          md:py-8

          lg:max-w-[1000px]
          lg:py-10
        "
      >
        <div
          className="
            lg:grid
            lg:grid-cols-[360px_minmax(0,1fr)]
            lg:items-start
            lg:gap-6
          "
        >
          {/* Profile */}
          <section
            className="
              flex
              items-center
              gap-4
              rounded-3xl
              bg-white
              p-5
              shadow-[0_4px_20px_rgba(0,27,61,0.05)]

              md:p-6

              lg:flex-col
              lg:items-center
              lg:p-7
              lg:text-center
            "
          >
            <div
              className="
                flex
                h-20
                w-20
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-secondary
                text-3xl
                font-bold
                text-white

                md:h-24
                md:w-24
                md:text-4xl

                lg:h-28
                lg:w-28
              "
            >
              {firstLetter}
            </div>

            <div
              className="
                min-w-0
                flex-1

                lg:w-full
              "
            >
              <h2
                className="
                  text-xl
                  font-bold
                  text-primary

                  md:text-2xl
                "
              >
                {
                  currentUser.fullName
                }
              </h2>

              <div
                className="
                  mt-3
                  space-y-2
                  text-sm
                  text-gray-500

                  md:text-base

                  lg:mt-5
                "
              >
                <p
                  className="
                    flex
                    items-center
                    gap-2

                    lg:justify-center
                  "
                >
                  <Phone
                    size={15}
                  />

                  {
                    currentUser.phone
                  }
                </p>

                <p
                  className="
                    flex
                    items-start
                    gap-2

                    lg:justify-center
                  "
                >
                  <MapPin
                    size={15}
                    className="mt-1 shrink-0"
                  />

                  <span>
                    {address}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Menu */}
          <section
            className="
              mt-5
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-[0_4px_20px_rgba(0,27,61,0.05)]

              md:mt-6

              lg:mt-0
            "
          >
            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <button
                    key={
                      item.label
                    }
                    type="button"
                    onClick={
                      item.onClick
                    }
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      border-b
                      border-gray-100
                      p-5
                      text-right
                      transition
                      last:border-none
                      hover:bg-gray-50
                      active:bg-gray-100

                      md:p-6
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-green-50

                          md:h-11
                          md:w-11
                        "
                      >
                        <Icon
                          size={22}
                          className="text-secondary"
                        />
                      </div>

                      <span
                        className="
                          font-semibold
                          text-primary

                          md:text-base
                        "
                      >
                        {
                          item.label
                        }
                      </span>

                      {item.badge >
                        0 && (
                        <span
                          className="
                            flex
                            h-6
                            min-w-6
                            items-center
                            justify-center
                            rounded-full
                            bg-green-50
                            px-2
                            text-xs
                            font-bold
                            text-secondary
                          "
                        >
                          {
                            item.badge
                          }
                        </span>
                      )}
                    </div>

                    <ChevronLeft
                      size={20}
                      className="text-gray-400"
                    />
                  </button>
                );
              },
            )}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                flex
                w-full
                items-center
                justify-between
                p-5
                text-right
                transition
                hover:bg-red-50
                active:bg-red-100

                md:p-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50

                    md:h-11
                    md:w-11
                  "
                >
                  <LogOut
                    size={22}
                    className="text-red-500"
                  />
                </div>

                <span className="font-semibold text-red-500">
                  تسجيل الخروج
                </span>
              </div>

              <ChevronLeft
                size={20}
                className="text-red-300"
              />
            </button>
          </section>
        </div>

        <p
          className="
            py-6
            text-center
            text-xs
            text-gray-400

            md:pt-8
          "
        >
          SOUQIA 2026
        </p>
      </main>

      <BottomNav />
    </div>
  );
}

export default AccountPage;