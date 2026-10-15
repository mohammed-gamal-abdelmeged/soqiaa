import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
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
    isSavingInvoice,
    setIsSavingInvoice,
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
  | Save Invoice As Image
  |--------------------------------------------------------------------------
  */

  const blobToDataUrl =
    (blob) =>
      new Promise(
        (
          resolve,
          reject,
        ) => {
          const reader =
            new FileReader();

          reader.onload =
            () =>
              resolve(
                reader.result,
              );

          reader.onerror =
            reject;

          reader.readAsDataURL(
            blob,
          );
        },
      );

  const inlineInvoiceImages =
    async (element) => {
      const imageElements =
        Array.from(
          element.querySelectorAll(
            "img",
          ),
        );

      await Promise.all(
        imageElements.map(
          async (
            imageElement,
          ) => {
            const source =
              imageElement.currentSrc ||
              imageElement.src;

            if (
              !source ||
              source.startsWith(
                "data:",
              )
            ) {
              return;
            }

            try {
              const response =
                await fetch(
                  source,
                  {
                    credentials:
                      "same-origin",
                  },
                );

              if (
                !response.ok
              ) {
                return;
              }

              const imageBlob =
                await response.blob();

              imageElement.src =
                await blobToDataUrl(
                  imageBlob,
                );
            } catch {
              /*
               * لو تعذر تحويل صورة ثانوية،
               * نكمل حفظ الفاتورة بدل ما نوقف الطلب.
               */
            }
          },
        ),
      );
    };

  const handleSaveInvoice =
    async () => {
      if (
        isSavingInvoice
      ) {
        return;
      }

      const invoice =
        document.getElementById(
          "invoice",
        );

      if (!invoice) {
        showError(
          "تعذر تجهيز الفاتورة للحفظ",
        );

        return;
      }

      setIsSavingInvoice(
        true,
      );

      let stagingContainer =
        null;

      let svgUrl =
        null;

      try {
        const invoiceClone =
          invoice.cloneNode(
            true,
          );

        await inlineInvoiceImages(
          invoiceClone,
        );

        stagingContainer =
          document.createElement(
            "div",
          );

        Object.assign(
          stagingContainer.style,
          {
            position:
              "fixed",
            left:
              "-10000px",
            top:
              "0",
            width:
              "760px",
            background:
              "#ffffff",
            pointerEvents:
              "none",
          },
        );

        Object.assign(
          invoiceClone.style,
          {
            width:
              "760px",
            maxWidth:
              "760px",
            background:
              "#ffffff",
          },
        );

        stagingContainer.appendChild(
          invoiceClone,
        );

        document.body.appendChild(
          stagingContainer,
        );

        if (
          document.fonts?.ready
        ) {
          await document.fonts.ready;
        }

        const width =
          760;

        const height =
          Math.ceil(
            invoiceClone
              .getBoundingClientRect()
              .height,
          );

        if (
          !height ||
          height < 1
        ) {
          throw new Error(
            "Invalid invoice height",
          );
        }

        const serializedInvoice =
          new XMLSerializer()
            .serializeToString(
              invoiceClone,
            );

        const svgMarkup =
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <foreignObject x="0" y="0" width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;background:#ffffff;">
                ${serializedInvoice}
              </div>
            </foreignObject>
          </svg>`;

        const svgBlob =
          new Blob(
            [
              svgMarkup,
            ],
            {
              type:
                "image/svg+xml;charset=utf-8",
            },
          );

        svgUrl =
          URL.createObjectURL(
            svgBlob,
          );

        const renderedImage =
          new Image();

        await new Promise(
          (
            resolve,
            reject,
          ) => {
            renderedImage.onload =
              resolve;

            renderedImage.onerror =
              reject;

            renderedImage.src =
              svgUrl;
          },
        );

        const scale =
          2;

        const canvas =
          document.createElement(
            "canvas",
          );

        canvas.width =
          width *
          scale;

        canvas.height =
          height *
          scale;

        const context =
          canvas.getContext(
            "2d",
          );

        if (!context) {
          throw new Error(
            "Canvas unavailable",
          );
        }

        context.scale(
          scale,
          scale,
        );

        context.fillStyle =
          "#ffffff";

        context.fillRect(
          0,
          0,
          width,
          height,
        );

        context.drawImage(
          renderedImage,
          0,
          0,
          width,
          height,
        );

        const pngBlob =
          await new Promise(
            (
              resolve,
              reject,
            ) => {
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve(
                      blob,
                    );

                    return;
                  }

                  reject(
                    new Error(
                      "PNG generation failed",
                    ),
                  );
                },
                "image/png",
                1,
              );
            },
          );

        const downloadUrl =
          URL.createObjectURL(
            pngBlob,
          );

        const link =
          document.createElement(
            "a",
          );

        const safeOrderNumber =
          String(
            completedOrder
              ?.orderNumber ||
              "order",
          ).replace(
            /[^a-zA-Z0-9_-]/g,
            "-",
          );

        link.href =
          downloadUrl;

        link.download =
          `soqiaa-invoice-${safeOrderNumber}.png`;

        document.body.appendChild(
          link,
        );

        link.click();

        link.remove();

        setTimeout(
          () =>
            URL.revokeObjectURL(
              downloadUrl,
            ),
          1000,
        );

        showSuccess(
          "تم حفظ الفاتورة على جهازك",
        );

        setIsSuccessOpen(
          false,
        );

        navigate(
          "/orders",
          {
            replace: true,
          },
        );
      } catch {
        showError(
          "تعذر حفظ الفاتورة كصورة، حاول مرة أخرى",
        );
      } finally {
        if (
          svgUrl
        ) {
          URL.revokeObjectURL(
            svgUrl,
          );
        }

        if (
          stagingContainer
            ?.parentNode
        ) {
          stagingContainer.remove();
        }

        setIsSavingInvoice(
          false,
        );
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
                  handleSaveInvoice
                }
                disabled={
                  isSavingInvoice
                }
                aria-busy={
                  isSavingInvoice
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
                  transition
                  disabled:cursor-wait
                  disabled:opacity-60
                "
              >
                <Download
                  size={20}
                />

                {isSavingInvoice
                  ? "جاري حفظ الفاتورة..."
                  : "احفظ فاتورتك"}
              </button>

              <button
                type="button"
                onClick={
                  handleFinishOrder
                }
                disabled={
                  isSavingInvoice
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-outline
                  py-3
                  font-semibold
                  disabled:cursor-not-allowed
                  disabled:opacity-60
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