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

  const handleLogout = async () => {
    try {
      await logout();

      navigate(
        "/login",
        {
          replace: true,
        },
      );
    } catch (logoutError) {
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
        navigate("/orders"),
    },
    {
      label: "المفضلة",
      icon: Heart,
      badge: favoritesCount,
      onClick: () =>
        navigate("/favorites"),
    },
    {
      label: "بياناتي",
      icon: UserRound,
      onClick: () =>
        navigate("/my-data"),
    },
  ];

  if (isPending) {
    return (
      <div
        className="
          flex min-h-screen
          items-center justify-center
          bg-[#f8f9fa]
        "
      >
        <span
          className="
            h-8 w-8 animate-spin
            rounded-full border-2
            border-gray-200
            border-t-secondary
          "
        />
      </div>
    );
  }

  if (
    isError ||
    !currentUser
  ) {
    return (
      <div
        className="
          flex min-h-screen
          items-center justify-center
          bg-[#f8f9fa] px-5
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
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <header
        className="
          sticky top-0 z-40
          flex h-16 items-center
          justify-center bg-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <h1 className="text-2xl font-bold text-secondary">
          حسابي
        </h1>
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
        {/* Profile */}
        <section
          className="
            flex items-center gap-4
            rounded-3xl bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <div
            className="
              flex h-20 w-20
              shrink-0 items-center
              justify-center
              rounded-full bg-secondary
              text-3xl font-bold
              text-white
            "
          >
            {firstLetter}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-primary">
              {currentUser.fullName}
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <Phone
                  size={15}
                />

                {currentUser.phone}
              </p>

              <p className="flex items-start gap-2">
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
            mt-5 overflow-hidden
            rounded-3xl bg-white
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
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
                    flex w-full
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                    p-5 text-right
                    transition
                    last:border-none
                    hover:bg-gray-50
                    active:bg-gray-100
                  "
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={22}
                      className="text-secondary"
                    />

                    <span className="font-semibold text-primary">
                      {
                        item.label
                      }
                    </span>

                    {item.badge >
                      0 && (
                      <span
                        className="
                          flex h-6
                          min-w-6
                          items-center
                          justify-center
                          rounded-full
                          bg-green-50
                          px-2 text-xs
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
              flex w-full
              items-center
              justify-between p-5
              text-right transition
              hover:bg-red-50
              active:bg-red-100
            "
          >
            <div className="flex items-center gap-3">
              <LogOut
                size={22}
                className="text-red-500"
              />

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

        <p className="py-6 text-center text-xs text-gray-400">
          SOUQIA 2026
        </p>
      </main>

      <BottomNav />
    </div>
  );
}

export default AccountPage;