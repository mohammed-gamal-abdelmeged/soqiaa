import { useEffect } from "react";

import {
  useMyProfile,
} from "../../account/hooks/useMyProfile";

function CustomerStep({
  customerData,
  setCustomerData,
}) {
  const {
    data: user,
  } = useMyProfile();

  useEffect(() => {
    if (!user) {
      return;
    }

    setCustomerData(
      (current) => ({
        ...current,

        name:
          current.name ||
          user.fullName ||
          "",

        phone:
          current.phone ||
          user.phone ||
          "",

        address:
          current.address ||
          user.address
            ?.fullAddress ||
          "",
      }),
    );
  }, [
    user,
    setCustomerData,
  ]);

  const handleChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setCustomerData(
      (current) => ({
        ...current,
        [name]: value,
      }),
    );
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-5 text-xl font-bold text-primary">
        بيانات التوصيل
      </h2>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-text-muted">
            الاسم
          </label>

          <input
            name="name"
            value={
              customerData.name
            }
            onChange={
              handleChange
            }
            autoComplete="name"
            className="
              w-full rounded-xl
              border border-outline
              p-3 outline-none
              focus:border-secondary
              focus:ring-1
              focus:ring-secondary
            "
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-muted">
            رقم الموبايل
          </label>

          <input
            name="phone"
            type="tel"
            inputMode="tel"
            value={
              customerData.phone
            }
            onChange={
              handleChange
            }
            autoComplete="tel"
            className="
              w-full rounded-xl
              border border-outline
              p-3 outline-none
              focus:border-secondary
              focus:ring-1
              focus:ring-secondary
            "
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-muted">
            عنوان التوصيل
          </label>

          <textarea
            name="address"
            value={
              customerData.address
            }
            onChange={
              handleChange
            }
            autoComplete="street-address"
            placeholder="اكتب عنوان التوصيل بالتفصيل"
            className="
              h-24 w-full resize-none
              rounded-xl
              border border-outline
              p-3 outline-none
              focus:border-secondary
              focus:ring-1
              focus:ring-secondary
            "
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerStep;