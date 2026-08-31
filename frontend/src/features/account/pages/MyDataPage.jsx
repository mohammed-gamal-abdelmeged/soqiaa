import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Modal from "../../../components/ui/Modal";

import { useAuth } from "../../auth/context/useAuth";
import { ordersMock } from "../../orders/data/orders.mock";

import { showSuccess } from "../../../lib/toast";

function MyDataPage() {
  const navigate = useNavigate();

  const { user, updateUser } = useAuth();

  const currentUser = user || {
    name: "مودي",
    phone: "01007349516",
    email: "mody@example.com",
    address: "شارع التحرير، الدقي، الجيزة",
  };

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [formData, setFormData] = useState(currentUser);

  const deliveredOrdersCount = ordersMock.filter(
    (order) => order.status === "delivered",
  ).length;

  const firstLetter = currentUser.name?.trim()?.charAt(0) || "س";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      return;
    }

    updateUser(formData);

    setIsEditOpen(false);

    showSuccess("تم تحديث بياناتك بنجاح");
  };

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
        <button type="button" onClick={() => navigate(-1)} aria-label="رجوع">
          <ArrowRight size={25} />
        </button>

        <h1 className="flex-1 text-center text-xl font-bold text-primary">
          بياناتي
        </h1>

        <div className="w-6" />
      </header>

      <main className="mx-auto w-full max-w-md px-5 py-5">
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
              <p className="text-sm text-white/70">أهلاً بيك</p>

              <h2 className="mt-1 text-2xl font-bold">{currentUser.name}</h2>
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
                <p className="text-sm text-white/70">الطلبات التي تم توصيلها</p>

                <p className="mt-1 text-3xl font-bold">
                  {deliveredOrdersCount}
                </p>
              </div>

              <CheckCircle2 size={35} />
            </div>
          </div>
        </section>

        {/* Data */}
        <section
          className="
            mt-5 rounded-3xl bg-white p-5
            shadow-[0_4px_20px_rgba(0,27,61,0.05)]
          "
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">بيانات الحساب</h2>

            <button
              type="button"
              onClick={() => {
                setFormData(currentUser);
                setIsEditOpen(true);
              }}
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
            <DataRow icon={UserRound} label="الاسم" value={currentUser.name} />

            <DataRow
              icon={Phone}
              label="رقم الموبايل"
              value={currentUser.phone}
            />
            <DataRow
              icon={MapPin}
              label="العنوان"
              value={currentUser.address}
            />
            <DataRow icon={Mail} label="الإيميل" value={currentUser.email} />
          </div>
        </section>
      </main>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="تعديل بياناتي"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <EditField
            label="الاسم"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <EditField
            label="رقم الموبايل"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <EditField
            label="العنوان"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

          {/* الإيميل عرض فقط */}
          <div>
            <label className="mb-1 block text-sm text-gray-500">الإيميل</label>

            <input
              value={formData.email}
              disabled
              className="
                w-full rounded-xl
                border border-gray-200
                bg-gray-100 p-3
                text-gray-500
              "
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="
                flex-1 rounded-xl
                border border-outline py-3
              "
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="
                flex-1 rounded-xl
                bg-secondary py-3
                font-semibold text-white
              "
            >
              حفظ التعديلات
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function DataRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-full bg-green-50
          text-secondary
        "
      >
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs text-gray-500">{label}</p>

        <p className="mt-1 font-medium text-primary">{value}</p>
      </div>
    </div>
  );
}

function EditField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-500">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full rounded-xl
          border border-outline p-3
          outline-none
          focus:border-secondary
          focus:ring-1 focus:ring-secondary
        "
      />
    </div>
  );
}

export default MyDataPage;
