// CheckoutPage.jsx

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Printer,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import CheckoutStepper from '../components/CheckoutStepper'
import CartStep from '../components/CartStep'
import CustomerStep from '../components/CustomerStep'
import ReviewStep from '../components/ReviewStep'
import Invoice from '../components/Invoice'

import { useCart } from '../../cart/context/useCart'
import Modal from '../../../components/ui/Modal'
import { showSuccess } from '../../../lib/toast'

function CheckoutPage() {
  const navigate = useNavigate()

  const {
    items,
    subtotal,
    getFinalPrice,
    clearCart,
  } = useCart()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)

  // الخصم هنا بدل CartStep
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  const deliveryFee = 15

  const discountAmount = Math.round(
    subtotal * (discountPercentage / 100),
  )

  const total =
    subtotal - discountAmount + deliveryFee

  const orderNumber =
    `SQ${Date.now().toString().slice(-6)}`

  const goNext = () => {
    if (currentStep === 1 && items.length === 0) {
      return
    }

    if (currentStep === 2) {
      if (
        !customerData.name ||
        !customerData.phone ||
        !customerData.address
      ) {
        return
      }
    }

    if (currentStep < 3) {
      setCurrentStep((current) => current + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((current) => current - 1)
      return
    }

    navigate(-1)
  }

  const confirmOrder = () => {
    setIsSuccessOpen(true)
    showSuccess('تم تأكيد طلبك بنجاح')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28">
      <header
        className="
          sticky top-0 z-50
          flex h-16 items-center bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <button
          type="button"
          onClick={goBack}
          aria-label="رجوع"
        >
          <ArrowRight size={26} />
        </button>

        <h1 className="flex-1 text-center text-2xl font-bold text-secondary">
          إتمام الطلب
        </h1>

        <div className="w-7" />
      </header>

      <CheckoutStepper currentStep={currentStep} />

      <main className="mx-auto w-full max-w-md px-5 py-6">
        {currentStep === 1 && (
          <CartStep
            discountPercentage={discountPercentage}
            setDiscountPercentage={setDiscountPercentage}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />
        )}

        {currentStep === 2 && (
          <CustomerStep
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            customerData={customerData}
            discountPercentage={discountPercentage}
            discountAmount={discountAmount}
            appliedCoupon={appliedCoupon}
          />
        )}
      </main>

      <div
        className="
          fixed bottom-0 left-0 z-40
          flex w-full gap-3
          rounded-t-2xl border-t border-gray-100
          bg-white p-4
          shadow-[0_-10px_30px_rgba(0,27,61,0.12)]
        "
      >
        {currentStep > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="
              flex-1 rounded-xl border border-primary
              py-4 font-semibold text-primary
            "
          >
            رجوع
          </button>
        )}

        <button
          type="button"
          onClick={
            currentStep === 3
              ? confirmOrder
              : goNext
          }
          disabled={
            currentStep === 1 &&
            items.length === 0
          }
          className="
            flex-[2] rounded-xl bg-secondary
            py-4 font-semibold text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span className="flex items-center justify-center gap-2">
            {currentStep === 1 && (
              <>
                التالي
                <ArrowLeft size={20} />
              </>
            )}

            {currentStep === 2 && (
              <>
                مراجعة الطلب
                <ArrowLeft size={20} />
              </>
            )}

            {currentStep === 3 && (
              <>
                تأكيد الطلب
                <Check size={20} />
              </>
            )}
          </span>
        </button>
      </div>

      <Modal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="تم تأكيد طلبك بنجاح 🎉"
        maxWidth="max-w-xl"
      >
        <div className="max-h-[75vh] overflow-y-auto">
          <Invoice
            orderNumber={orderNumber}
            items={items}
            customer={customerData}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discountPercentage={discountPercentage}
            discountAmount={discountAmount}
            appliedCoupon={appliedCoupon}
            total={total}
            getFinalPrice={getFinalPrice}
          />

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="
                flex flex-1 items-center justify-center gap-2
                rounded-xl bg-secondary py-3
                font-semibold text-white
              "
            >
              <Printer size={20} />
              اطبع فاتورتك بأمان
            </button>

            <button
              type="button"
              onClick={() => {
                clearCart()
                setIsSuccessOpen(false)
                navigate('/')
              }}
              className="
                flex-1 rounded-xl border border-outline
                py-3 font-semibold
              "
            >
              تم
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CheckoutPage