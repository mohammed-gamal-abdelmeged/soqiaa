import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/context/useAuth'

function CustomerStep({
  customerData,
  setCustomerData,
}) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    setCustomerData((current) => ({
      ...current,
      name: current.name || user.name || '',
      phone: current.phone || user.phone || '',
      email: current.email || user.email || '',
    }))
  }, [user, setCustomerData])

  const handleChange = (event) => {
    const { name, value } = event.target

    setCustomerData((current) => ({
      ...current,
      [name]: value,
    }))
  }

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
            value={customerData.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline p-3 outline-none focus:border-secondary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-muted">
            رقم الموبايل
          </label>

          <input
            name="phone"
            value={customerData.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline p-3 outline-none focus:border-secondary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-muted">
            الإيميل
          </label>

          <input
            name="email"
            value={customerData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-outline p-3 outline-none focus:border-secondary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-text-muted">
            عنوان التوصيل
          </label>

          <textarea
            name="address"
            value={customerData.address}
            onChange={handleChange}
            placeholder="اكتب عنوان التوصيل بالتفصيل"
            className="h-24 w-full resize-none rounded-xl border border-outline p-3 outline-none focus:border-secondary"
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerStep