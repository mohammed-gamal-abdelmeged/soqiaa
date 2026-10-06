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
import StoreHeader from "../../../components/layout/StoreHeader";

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

  const hasUnavailableItems =
    items.some(
      (item) =>
        item.isAvailable ===
        false,
    );

  /*
  |--------------------------------------------------------------------------
  | Next Step
  |--------------------------------------------------------------------------
  */

  const goNext =
    async () => {
      if (
        currentStep === 1 &&
        items.length === 0
      ) {
        return;
      }

      /*
       * مينفعش نسيب المستخدم يكمل
       * وفي السلة منتج غير متوفر.
       */
      if (
        currentStep === 1 &&
        hasUnavailableItems
      ) {
        showError(
          "احذف المنتجات المعلّمة بالأحمر من السلة قبل المتابعة",
        );

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

        /*
         * حماية إضافية:
         * لو المنتج أصبح غير متوفر
         * أثناء ما المستخدم في الخطوة الثانية.
         */
        if (
          items.some(
            (item) =>
              item.isAvailable ===
              false,
          )
        ) {
          showError(
            "فيه منتج في السلة لم يعد متوفرًا، ارجع للسلة واحذفه أولًا",
          );

          setCurrentStep(1);

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

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
          /*
           * لو المنتج اختفى أو بقى
           * غير متوفر بين الخطوات،
           * الباك يفضل طبقة الحماية الأخيرة.
           */
          if (
            error?.code ===
              "PRODUCT_UNAVAILABLE" ||
            error?.code ===
              "PRODUCT_OUT_OF_STOCK" ||
            error?.code ===
              "INSUFFICIENT_STOCK"
          ) {
            showError(
              error?.message ||
                "فيه منتج في السلة لم يعد متوفرًا",
            );

            setCurrentStep(1);

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });

            return;
          }

          showError(
            error?.message ||
              "تعذر مراجعة الطلب",
          );
        }
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Back
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Confirm Order
  |--------------------------------------------------------------------------
  */

  const confirmOrder =
    async () => {
      if (
        createOrderMutation
          .isPending
      ) {
        return;
      }

      /*
       * حماية إضافية قبل إنشاء
       * الطلب النهائي.
       */
      if (
        items.some(
          (item) =>
            item.isAvailable ===
            false,
        )
      ) {
        showError(
          "فيه منتج في السلة لم يعد متوفرًا، احذفه قبل تأكيد الطلب",
        );

        setCurrentStep(1);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

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
        if (
          error?.code ===
            "PRODUCT_UNAVAILABLE" ||
          error?.code ===
            "PRODUCT_OUT_OF_STOCK" ||
          error?.code ===
            "INSUFFICIENT_STOCK"
        ) {
          showError(
            error?.message ||
              "فيه منتج في السلة لم يعد متوفرًا",
          );

          setCurrentStep(1);

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          return;
        }

        showError(
          error?.message ||
            "تعذر تأكيد الطلب",
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Print
  |--------------------------------------------------------------------------
  */

  const handlePrint = () => {
    const invoice =
      document.getElementById(
        "invoice",
      );

    if (!invoice) {
      showError(
        "تعذر تجهيز الفاتورة للطباعة",
      );

      return;
    }

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700",
      );

    if (!printWindow) {
      showError(
        "من فضلك اسمح بفتح نافذة الطباعة",
      );

      return;
    }

    const styles = Array.from(
      document.querySelectorAll(
        'link[rel="stylesheet"], style',
      ),
    )
      .map(
        (style) =>
          style.outerHTML,
      )
      .join("");

    printWindow.document.write(`
      <!doctype html>

      <html
        lang="ar"
        dir="rtl"
      >
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>
            فاتورة سوقيا
          </title>

          ${styles}

          <style>
            @page {
              size: A4;
              margin: 14mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              min-height: auto;
              background: white;
            }

            body {
              direction: rtl;
              color: #191c1d;
            }

            .print-page {
              width: 100%;
              margin: 0 auto;
            }

            #invoice {
              width: 100% !important;
              max-width: 100% !important;

              margin: 0 auto !important;
              padding: 0 !important;

              border-radius: 0 !important;
              background: white !important;
              box-shadow: none !important;
              overflow: visible !important;
            }

            #invoice img {
              max-width: 100%;
            }

            #invoice > div {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            @media print {
              html,
              body {
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }

              .print-page {
                width: 100%;
                margin: 0;
                padding: 0;
              }

              #invoice {
                width: 100% !important;
                max-width: 100% !important;

                margin: 0 !important;
                padding: 0 !important;

                border-radius: 0 !important;
                box-shadow: none !important;

                -webkit-print-color-adjust:
                  exact !important;

                print-color-adjust:
                  exact !important;
              }
            }
          </style>
        </head>

        <body>
          <main class="print-page">
            ${invoice.outerHTML}
          </main>
        </body>
      </html>
    `);

    printWindow.document.close();

    const printInvoice =
      () => {
        printWindow.focus();

        printWindow.print();

        printWindow.close();
      };

    if (
      printWindow.document
        .readyState ===
      "complete"
    ) {
      setTimeout(
        printInvoice,
        300,
      );
    } else {
      printWindow.onload =
        () => {
          setTimeout(
            printInvoice,
            300,
          );
        };
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Finish
  |--------------------------------------------------------------------------
  */

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
    <div
      className="
        min-h-screen
        bg-[#f8f9fa]
        pb-28

        md:pb-10
      "
    >
      {/* Tablet / Desktop Navigation */}
      <div className="hidden md:block">
        <StoreHeader />
      </div>

      {/* Mobile Header */}
      <header
        className="
          sticky
          top-0
          z-50
          flex
          h-16
          items-center
          bg-white
          px-5
          shadow-[0_4px_20px_rgba(0,27,61,0.05)]

          md:hidden
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

      {/* Desktop Page Title */}
      <div
        className="
          hidden

          md:mx-auto
          md:block
          md:w-full
          md:max-w-5xl
          md:px-6
          md:pb-2
          md:pt-8

          lg:max-w-[1180px]
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-primary

            lg:text-4xl
          "
        >
          إتمام الطلب
        </h1>

        <p className="mt-2 text-text-muted">
          راجع سلتك وكمل بيانات التوصيل لتأكيد طلبك.
        </p>
      </div>

      <CheckoutStepper
        currentStep={
          currentStep
        }
      />

      <main
        className={`
          mx-auto
          w-full
          max-w-md
          px-5
          py-6

          md:px-6
          md:py-8

          ${
            currentStep === 1
              ? "md:max-w-5xl lg:max-w-[1180px]"
              : "md:max-w-3xl lg:max-w-4xl"
          }
        `}
      >
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

      {/* Checkout Actions */}
      <div
        className="
          fixed
          bottom-0
          left-0
          z-40
          flex
          w-full
          gap-3
          rounded-t-2xl
          border-t
          border-gray-100
          bg-white
          p-4
          shadow-[0_-10px_30px_rgba(0,27,61,0.12)]

          md:static
          md:mx-auto
          md:mb-10
          md:max-w-3xl
          md:rounded-2xl
          md:border
          md:px-5
          md:py-4
          md:shadow-[0_8px_30px_rgba(0,27,61,0.06)]

          lg:max-w-4xl
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
              flex-1
              rounded-xl
              border
              border-primary
              py-4
              font-semibold
              text-primary
              disabled:cursor-not-allowed
              disabled:opacity-50

              md:max-w-[220px]
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
          aria-busy={
            isProcessing
          }
          className="
            flex-[2]
            rounded-xl
            bg-secondary
            py-4
            font-semibold
            text-white
            transition
            active:scale-[0.98]
            disabled:cursor-wait
            disabled:opacity-50
            disabled:active:scale-100

            md:px-8
          "
        >
          <span className="flex items-center justify-center gap-2">
            {isProcessing ? (
              currentStep ===
              3
                ? "جاري تأكيد الطلب..."
                : "جاري مراجعة الطلب..."
            ) : (
              <>
                {currentStep ===
                  1 && (
                  <>
                    {hasUnavailableItems
                      ? "احذف المنتجات غير المتاحة"
                      : "التالي"}

                    {!hasUnavailableItems && (
                      <ArrowLeft
                        size={
                          20
                        }
                      />
                    )}
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
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-secondary
                  py-3
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
                  flex-1
                  rounded-xl
                  border
                  border-outline
                  py-3
                  font-semibold
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