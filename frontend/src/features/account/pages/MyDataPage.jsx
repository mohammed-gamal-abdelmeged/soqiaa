import { useState } from "react";

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
    EMPTY_FORM
  );

  const handleOpenEdit = () => {
    if (!user) {
      return;
    }

    setFormData({
      fullName:
        user.fullName || "",

      phone:
        user.phone || "",

      address:
        user.address
          ?.fullAddress || "",
    });

    setIsEditOpen(true);
  };

  const handleChange = (
    event
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
      })
    );
  };

  const handleSave = async () => {
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
        "من فضلك أكمل كل البيانات"
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
        false
      );

      showSuccess(
        "تم تحديث بياناتك بنجاح"
      );
    } catch (mutationError) {
      showError(
        mutationError
          ?.message ||
          "تعذر تحديث البيانات"
      );
    }
  };

  if (isPending) {
    return (
      <PageShell
        onBack={() =>
          navigate(-1)
        }
      >
        <div
          className="
            flex min-h-[320px]
            items-center justify-center
          "
        >
          <span
            className="
              h-8 w-8 animate-spin
              rounded-full
              border-2
              border-gray-200
              border-t-secondary
            "
          />
        </div>
      </PageShell>
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
            rounded-3xl bg-white
            p-6 text-center
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
      {/* Hero */}
      <section
        className="
          overflow-hidden rounded-3xl
          bg-primary p-6 text-white
          shadow-[0_10px_30px_rgba(0,27,61,0.12)]
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              flex h-16 w-16
              items-center justify-center
              rounded-full bg-white/10
              text-2xl font-bold
            "
          >
            {firstLetter}
          </div>

          <div>
            <p className="text-sm text-white/70">
              أهلاً بيك
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {user.fullName}
            </h2>
          </div>
        </div>

        <div
          className="
            mt-6 rounded-2xl
            bg-white/10 p-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">
                الطلبات التي تم توصيلها
              </p>

              <p className="mt-1 text-3xl font-bold">
                {user.deliveredOrdersCount}
              </p>
            </div>

            <CheckCircle2
              size={35}
            />
          </div>
        </div>
      </section>

      {/* Account Data */}
      <section
        className="
          mt-5 rounded-3xl
          bg-white p-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">
            بيانات الحساب
          </h2>

          <button
            type="button"
            onClick={
              handleOpenEdit
            }
            className="
              rounded-xl bg-green-50
              px-4 py-2 text-sm
              font-semibold text-secondary
            "
          >
            تعديل
          </button>
        </div>

        <div className="mt-5 divide-y divide-gray-100">
          <DataRow
            icon={UserRound}
            label="الاسم"
            value={
              user.fullName
            }
          />

          <DataRow
            icon={Phone}
            label="رقم الموبايل"
            value={
              user.phone
            }
          />

          <DataRow
            icon={MapPin}
            label="العنوان"
            value={
              address
            }
          />
        </div>
      </section>

      <Modal
        isOpen={
          isEditOpen
        }
        onClose={() =>
          !updateProfile
            .isPending &&
          setIsEditOpen(
            false
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
                  false
                )
              }
              disabled={
                updateProfile
                  .isPending
              }
              className="
                flex-1 rounded-xl
                border border-outline
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
              className="
                flex flex-1
                items-center
                justify-center
                rounded-xl
                bg-secondary py-3
                font-semibold text-white
                disabled:cursor-not-allowed
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
          sticky top-0 z-40
          flex h-16 items-center
          bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <button
          type="button"
          onClick={
            onBack
          }
          aria-label="رجوع"
        >
          <ArrowRight
            size={25}
          />
        </button>

        <h1 className="flex-1 text-center text-xl font-bold text-primary">
          بياناتي
        </h1>

        <div className="w-6" />
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
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
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <div
        className="
          flex h-10 w-10
          shrink-0 items-center
          justify-center
          rounded-full bg-green-50
          text-secondary
        "
      >
        <Icon
          size={19}
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words font-medium text-primary">
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
        name={name}
        value={value}
        onChange={
          onChange
        }
        disabled={
          disabled
        }
        className="
          w-full rounded-xl
          border border-outline
          p-3 outline-none
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