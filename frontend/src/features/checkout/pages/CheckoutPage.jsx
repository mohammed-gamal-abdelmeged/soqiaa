import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Printer,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import CheckoutStepper from "../components/CheckoutStepper";
import CartStep from "../components/CartStep";
import CustomerStep from "../components/CustomerStep";
import ReviewStep from "../components/ReviewStep";
import Invoice from "../components/Invoice";

import {
  useCart,
} from "../../cart/context/useCart";

import {
  useCreateOrder,
  usePreviewOrder,
} from "../../orders/hooks/useOrders";

import Modal from "../../../components/ui/Modal";

import {
  showError,
  showSuccess,
} from "../../../lib/toast";

function CheckoutPage() {
  const navigate =
    useNavigate();

  const {
    items,
  } = useCart();

  const previewOrderMutation =
    usePreviewOrder();

  const createOrderMutation =
    useCreateOrder();

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    isSuccessOpen,
    setIsSuccessOpen,
  ] = useState(false);

  const [
    appliedCoupon,
    setAppliedCoupon,
  ] = useState(null);

  const [
    checkoutPreview,
    setCheckoutPreview,
  ] = useState(null);

  const [
    completedOrder,
    setCompletedOrder,
  ] = useState(null);

  const [
    customerData,
    setCustomerData,
  ] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const goNext =
    async () => {
      if (
        currentStep === 1 &&
        items.length === 0
      ) {
        return;
      }

      if (
        currentStep === 1
      ) {
        setCurrentStep(2);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      if (
        currentStep === 2
      ) {
        const name =
          customerData.name.trim();

        const phone =
          customerData.phone.trim();

        const address =
          customerData.address.trim();

        if (
          !name ||
          !phone ||
          !address
        ) {
          showError(
            "من فضلك أكمل بيانات التوصيل",
          );

          return;
        }

        try {
          const preview =
            await previewOrderMutation
              .mutateAsync({
                couponCode:
                  appliedCoupon ||
                  undefined,
              });

          setCheckoutPreview(
            preview,
          );

          setAppliedCoupon(
            preview.couponCode ||
              null,
          );

          setCurrentStep(3);

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } catch (error) {
          showError(
            error?.message ||
              "تعذر مراجعة الطلب",
          );
        }
      }
    };

  const goBack = () => {
    if (
      currentStep > 1
    ) {
      setCurrentStep(
        (current) =>
          current - 1,
      );

      return;
    }

    navigate(-1);
  };

  const confirmOrder =
    async () => {
      if (
        createOrderMutation
          .isPending
      ) {
        return;
      }

      try {
        const order =
          await createOrderMutation
            .mutateAsync({
              customerName:
                customerData
                  .name
                  .trim(),

              customerPhone:
                customerData
                  .phone
                  .trim(),

              deliveryAddress:
                customerData
                  .address
                  .trim(),

              couponCode:
                appliedCoupon ||
                undefined,
            });

        setCompletedOrder(
          order,
        );

        setIsSuccessOpen(
          true,
        );

        showSuccess(
          "تم تأكيد طلبك بنجاح",
        );
      } catch (error) {
        showError(
          error?.message ||
            "تعذر تأكيد الطلب",
        );
      }
    };

  const handlePrint = () => {
    window.print();
  };

  const handleFinishOrder =
    () => {
      setIsSuccessOpen(
        false,
      );

      navigate(
        "/orders",
        {
          replace: true,
        },
      );
    };

  const isProcessing =
    previewOrderMutation
      .isPending ||
    createOrderMutation
      .isPending;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28">
      <header
        className="
          sticky top-0 z-50
          flex h-16 items-center
          bg-white px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]
        "
      >
        <button
          type="button"
          onClick={
            goBack
          }
          disabled={
            isProcessing
          }
          aria-label="رجوع"
          className="
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <ArrowRight
            size={26}
          />
        </button>

        <h1 className="flex-1 text-center text-2xl font-bold text-secondary">
          إتمام الطلب
        </h1>

        <div className="w-7" />
      </header>

      <CheckoutStepper
        currentStep={
          currentStep
        }
      />

      <main className="mx-auto w-full max-w-md px-5 py-6">
        {currentStep ===
          1 && (
          <CartStep
            appliedCoupon={
              appliedCoupon
            }
            setAppliedCoupon={
              setAppliedCoupon
            }
          />
        )}

        {currentStep ===
          2 && (
          <CustomerStep
            customerData={
              customerData
            }
            setCustomerData={
              setCustomerData
            }
          />
        )}

        {currentStep ===
          3 && (
          <ReviewStep
            customerData={
              customerData
            }
            preview={
              checkoutPreview
            }
          />
        )}
      </main>

      <div
        className="
          fixed bottom-0 left-0
          z-40 flex w-full gap-3
          rounded-t-2xl border-t
          border-gray-100
          bg-white p-4
          shadow-[0_-10px_30px_rgba(0,27,61,0.12)]
        "
      >
        {currentStep >
          1 && (
          <button
            type="button"
            onClick={
              goBack
            }
            disabled={
              isProcessing
            }
            className="
              flex-1 rounded-xl
              border border-primary
              py-4 font-semibold
              text-primary
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            رجوع
          </button>
        )}

        <button
          type="button"
          onClick={
            currentStep ===
            3
              ? confirmOrder
              : goNext
          }
          disabled={
            isProcessing ||
            (
              currentStep ===
                1 &&
              items.length ===
                0
            )
          }
          className="
            flex-[2] rounded-xl
            bg-secondary py-4
            font-semibold text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span className="flex items-center justify-center gap-2">
            {isProcessing ? (
              <>
                <span
                  className="
                    h-5 w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                {currentStep ===
                3
                  ? "جاري تأكيد الطلب..."
                  : "جاري مراجعة الطلب..."}
              </>
            ) : (
              <>
                {currentStep ===
                  1 && (
                  <>
                    التالي

                    <ArrowLeft
                      size={20}
                    />
                  </>
                )}

                {currentStep ===
                  2 && (
                  <>
                    مراجعة الطلب

                    <ArrowLeft
                      size={20}
                    />
                  </>
                )}

                {currentStep ===
                  3 && (
                  <>
                    تأكيد الطلب

                    <Check
                      size={20}
                    />
                  </>
                )}
              </>
            )}
          </span>
        </button>
      </div>

      <Modal
        isOpen={
          isSuccessOpen
        }
        onClose={
          handleFinishOrder
        }
        title="تم تأكيد طلبك بنجاح 🎉"
        maxWidth="max-w-xl"
      >
        {completedOrder && (
          <div className="max-h-[75vh] overflow-y-auto">
            <Invoice
              orderNumber={
                completedOrder
                  .orderNumber
              }
              items={
                completedOrder
                  .items
              }
              customer={
                completedOrder
                  .customer
              }
              subtotal={
                completedOrder
                  .subtotal
              }
              deliveryFee={
                completedOrder
                  .deliveryFee
              }
              discountAmount={
                completedOrder
                  .discountAmount
              }
              appliedCoupon={
                completedOrder
                  .appliedCoupon
              }
              total={
                completedOrder
                  .total
              }
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={
                  handlePrint
                }
                className="
                  flex flex-1
                  items-center
                  justify-center
                  gap-2 rounded-xl
                  bg-secondary py-3
                  font-semibold
                  text-white
                "
              >
                <Printer
                  size={20}
                />

                اطبع فاتورتك بأمان
              </button>

              <button
                type="button"
                onClick={
                  handleFinishOrder
                }
                className="
                  flex-1 rounded-xl
                  border border-outline
                  py-3 font-semibold
                "
              >
                تم
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckoutPage;