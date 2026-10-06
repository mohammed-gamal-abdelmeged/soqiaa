import {
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import Modal from "../../../components/ui/Modal";

import MyDataPageSkeleton from "../../../components/loaders/MyDataPageSkeleton";

import {
  showError,
  showSuccess,
} from "../../../lib/toast";

import {
  useMyProfile,
  useUpdateMyProfile,
} from "../hooks/useMyProfile";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  address: "",
};

function MyDataPage() {
  const navigate =
    useNavigate();

  const {
    data: user,
    isPending,
    isError,
    error,
  } = useMyProfile();

  const updateProfile =
    useUpdateMyProfile();

  const [
    isEditOpen,
    setIsEditOpen,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState(
    EMPTY_FORM,
  );

  const handleOpenEdit =
    () => {
      if (!user) {
        return;
      }

      setFormData({
        fullName:
          user.fullName ||
          "",

        phone:
          user.phone ||
          "",

        address:
          user.address
            ?.fullAddress ||
          "",
      });

      setIsEditOpen(
        true,
      );
    };

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,

        [name]:
          value,
      }),
    );
  };

  const handleSave =
    async () => {
      const fullName =
        formData.fullName.trim();

      const phone =
        formData.phone.trim();

      const address =
        formData.address.trim();

      if (
        !fullName ||
        !phone ||
        !address
      ) {
        showError(
          "من فضلك أكمل كل البيانات",
        );

        return;
      }

      try {
        await updateProfile
          .mutateAsync({
            fullName,
            phone,
            address,
          });

        setIsEditOpen(
          false,
        );

        showSuccess(
          "تم تحديث بياناتك بنجاح",
        );
      } catch (
        mutationError
      ) {
        showError(
          mutationError
            ?.message ||
            "تعذر تحديث البيانات",
        );
      }
    };

  if (isPending) {
    return (
      <MyDataPageSkeleton />
    );
  }

  if (
    isError ||
    !user
  ) {
    return (
      <PageShell
        onBack={() =>
          navigate(-1)
        }
      >
        <div
          className="
            rounded-3xl
            bg-white
            p-6
            text-center
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <p className="font-semibold text-primary">
            تعذر تحميل بيانات الحساب
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {error?.message}
          </p>
        </div>
      </PageShell>
    );
  }

  const firstLetter =
    user.fullName
      ?.trim()
      ?.charAt(0) ||
    "س";

  const address =
    user.address
      ?.fullAddress ||
    "لا يوجد عنوان";

  return (
    <PageShell
      onBack={() =>
        navigate(-1)
      }
    >
      <div
        className="
          lg:grid
          lg:grid-cols-[0.8fr_1.2fr]
          lg:items-start
          lg:gap-6
        "
      >
        {/* Hero */}
        <section
          className="
            overflow-hidden
            rounded-3xl
            bg-primary
            p-6
            text-white
            shadow-[0_10px_30px_rgba(0,27,61,0.12)]

            md:p-7

            lg:sticky
            lg:top-28
            lg:rounded-[30px]
            lg:p-8
          "
        >
          <div
            className="
              flex
              items-center
              gap-4

              lg:flex-col
              lg:items-start
            "
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-2xl
                font-bold

                md:h-20
                md:w-20
                md:text-3xl
              "
            >
              {firstLetter}
            </div>

            <div>
              <p
                className="
                  text-sm
                  text-white/70

                  md:text-base
                "
              >
                أهلاً بيك
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-bold

                  md:text-3xl
                "
              >
                {
                  user.fullName
                }
              </h2>
            </div>
          </div>

          <div
            className="
              mt-6
              rounded-2xl
              bg-white/10
              p-4

              md:p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-sm
                    text-white/70

                    md:text-base
                  "
                >
                  الطلبات التي تم توصيلها
                </p>

                <p
                  className="
                    mt-1
                    text-3xl
                    font-bold

                    md:text-4xl
                  "
                >
                  {
                    user.deliveredOrdersCount
                  }
                </p>
              </div>

              <CheckCircle2
                size={35}
                className="
                  md:h-10
                  md:w-10
                "
              />
            </div>
          </div>
        </section>

        {/* Account Data */}
        <section
          className="
            mt-5
            rounded-3xl
            bg-white
            p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]

            md:mt-6
            md:p-7

            lg:mt-0
            lg:rounded-[30px]
            lg:p-8
          "
        >
          <div className="flex items-center justify-between">
            <h2
              className="
                text-lg
                font-bold
                text-primary

                md:text-2xl
              "
            >
              بيانات الحساب
            </h2>

            <button
              type="button"
              onClick={
                handleOpenEdit
              }
              className="
                rounded-xl
                bg-green-50
                px-4
                py-2
                text-sm
                font-semibold
                text-secondary

                md:px-5
                md:py-2.5
              "
            >
              تعديل
            </button>
          </div>

          <div
            className="
              mt-5
              divide-y
              divide-gray-100

              md:mt-6
            "
          >
            <DataRow
              icon={
                UserRound
              }
              label="الاسم"
              value={
                user.fullName
              }
            />

            <DataRow
              icon={
                Phone
              }
              label="رقم الموبايل"
              value={
                user.phone
              }
            />

            <DataRow
              icon={
                MapPin
              }
              label="العنوان"
              value={
                address
              }
            />
          </div>
        </section>
      </div>

      <Modal
        isOpen={
          isEditOpen
        }
        onClose={() =>
          !updateProfile
            .isPending &&
          setIsEditOpen(
            false,
          )
        }
        title="تعديل بياناتي"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <EditField
            label="الاسم"
            name="fullName"
            value={
              formData.fullName
            }
            onChange={
              handleChange
            }
            disabled={
              updateProfile
                .isPending
            }
          />

          <EditField
            label="رقم الموبايل"
            name="phone"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
            disabled={
              updateProfile
                .isPending
            }
          />

          <EditField
            label="العنوان"
            name="address"
            value={
              formData.address
            }
            onChange={
              handleChange
            }
            disabled={
              updateProfile
                .isPending
            }
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                setIsEditOpen(
                  false,
                )
              }
              disabled={
                updateProfile
                  .isPending
              }
              className="
                flex-1
                rounded-xl
                border
                border-outline
                py-3
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                updateProfile
                  .isPending
              }
              aria-busy={
                updateProfile
                  .isPending
              }
              className="
                flex
                flex-1
                items-center
                justify-center
                rounded-xl
                bg-secondary
                py-3
                font-semibold
                text-white
                disabled:cursor-wait
                disabled:opacity-60
              "
            >
              {updateProfile
                .isPending
                ? "جاري الحفظ..."
                : "حفظ التعديلات"}
            </button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}

function PageShell({
  children,
  onBack,
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header
        className="
          sticky
          top-0
          z-40
          bg-white
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-full
            items-center
            px-5

            md:h-20
            md:max-w-5xl
            md:px-6

            lg:max-w-[1180px]
          "
        >
          <button
            type="button"
            onClick={
              onBack
            }
            aria-label="رجوع"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              transition
              active:scale-90
            "
          >
            <ArrowRight
              size={25}
            />
          </button>

          <h1
            className="
              flex-1
              text-center
              text-xl
              font-bold
              text-primary

              md:text-2xl

              lg:text-3xl
            "
          >
            بياناتي
          </h1>

          <div className="w-10" />
        </div>
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
        {children}
      </main>
    </div>
  );
}

function DataRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        py-4
        first:pt-0
        last:pb-0

        md:gap-4
        md:py-5
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-green-50
          text-secondary

          md:h-12
          md:w-12
        "
      >
        <Icon
          size={19}
        />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-xs
            text-gray-500

            md:text-sm
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            break-words
            font-medium
            text-primary

            md:text-base
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function EditField({
  label,
  name,
  value,
  onChange,
  disabled,
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-500">
        {label}
      </label>

      <input
        name={
          name
        }
        value={
          value
        }
        onChange={
          onChange
        }
        disabled={
          disabled
        }
        className="
          w-full
          rounded-xl
          border
          border-outline
          p-3
          outline-none
          focus:border-secondary
          focus:ring-1
          focus:ring-secondary
          disabled:cursor-not-allowed
          disabled:bg-gray-100
        "
      />
    </div>
  );
}

export default MyDataPage;