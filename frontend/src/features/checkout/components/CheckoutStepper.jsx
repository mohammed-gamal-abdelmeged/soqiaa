import { Check } from 'lucide-react'

const steps = [
  'السلة',
  'بيانات العميل',
  'تأكيد الطلب',
]

function CheckoutStepper({ currentStep }) {
  const progress =
    currentStep === 1
      ? '0%'
      : currentStep === 2
        ? '50%'
        : '100%'

  return (
    <div className="bg-white px-5 py-4 shadow-sm">
      <div className="relative flex items-start justify-between">
        <div className="absolute left-[10%] right-[10%] top-4 h-1 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-secondary transition-all"
            style={{ width: progress }}
          />
        </div>

        {steps.map((label, index) => {
          const stepNumber = index + 1
          const completed = stepNumber < currentStep
          const active = stepNumber <= currentStep

          return (
            <div
              key={label}
              className="z-10 flex w-1/3 flex-col items-center gap-1"
            >
              <div
                className={`
                  flex h-8 w-8 items-center justify-center
                  rounded-full text-sm font-semibold
                  ${
                    active
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-500'
                  }
                `}
              >
                {completed ? (
                  <Check size={17} />
                ) : (
                  stepNumber
                )}
              </div>

              <span
                className={`
                  text-center text-xs
                  ${
                    active
                      ? 'font-semibold text-secondary'
                      : 'text-gray-500'
                  }
                `}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CheckoutStepper