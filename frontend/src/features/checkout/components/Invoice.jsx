import logo from "../../../assets/images/logo.png";

function Invoice({
  orderNumber,
  items,
  customer,
  subtotal,
  deliveryFee = 0,
  discountAmount = 0,
  appliedCoupon = null,
  total,
}) {
  return (
    <div
      id="invoice"
      className="invoice-root"
    >
      <style>{`
        .invoice-root {
          width: 100%;
          color: #0b2447;
          direction: rtl;
          font-family: inherit;
        }

        .invoice-paper {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid #e6ece8;
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 12px 36px rgba(0, 27, 61, 0.07);
        }

        .invoice-topline {
          height: 6px;
          background: #0b7a2d;
        }

        .invoice-body {
          padding: 26px;
        }

        .invoice-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 24px;
          padding-bottom: 22px;
          border-bottom: 1px solid #e5e7eb;
        }

        .invoice-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .invoice-logo {
          width: 72px;
          height: 72px;
          object-fit: contain;
        }

        .invoice-title {
          margin: 0;
          font-size: 26px;
          line-height: 1.25;
          font-weight: 800;
          color: #0b2447;
        }

        .invoice-subtitle {
          margin: 6px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .invoice-order-box {
          min-width: 190px;
          border: 1px solid #dce5df;
          border-radius: 16px;
          padding: 13px 16px;
          background: #f8fbf9;
          text-align: right;
        }

        .invoice-order-label {
          margin: 0 0 5px;
          color: #6b7280;
          font-size: 12px;
        }

        .invoice-order-number {
          margin: 0;
          direction: ltr;
          text-align: right;
          font-size: 14px;
          font-weight: 800;
          color: #0b2447;
          overflow-wrap: anywhere;
        }

        .invoice-section {
          padding: 22px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .invoice-section-title {
          margin: 0 0 14px;
          font-size: 16px;
          font-weight: 800;
          color: #0b2447;
        }

        .invoice-customer-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .invoice-info-card {
          min-width: 0;
          border: 1px solid #edf0ee;
          border-radius: 14px;
          padding: 12px 14px;
          background: #fbfcfb;
        }

        .invoice-info-label {
          margin: 0 0 5px;
          color: #8a94a3;
          font-size: 11px;
        }

        .invoice-info-value {
          margin: 0;
          color: #1f2937;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .invoice-products {
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
        }

        .invoice-products-head,
        .invoice-product-row {
          display: grid;
          grid-template-columns:
            minmax(0, 1.8fr)
            minmax(70px, 0.55fr)
            minmax(90px, 0.7fr)
            minmax(90px, 0.7fr);
          align-items: center;
          column-gap: 12px;
        }

        .invoice-products-head {
          padding: 11px 14px;
          background: #f5f8f6;
          color: #667085;
          font-size: 11px;
          font-weight: 700;
        }

        .invoice-product-row {
          padding: 14px;
          border-top: 1px solid #edf0ee;
          color: #344054;
          font-size: 12px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .invoice-product-name {
          min-width: 0;
          font-size: 13px;
          font-weight: 800;
          color: #0b2447;
          line-height: 1.55;
        }

        .invoice-product-unit {
          display: block;
          margin-top: 3px;
          color: #8a94a3;
          font-size: 10px;
          font-weight: 500;
        }

        .invoice-number {
          direction: ltr;
          unicode-bidi: plaintext;
          text-align: right;
          white-space: nowrap;
        }

        .invoice-summary-wrap {
          display: flex;
          justify-content: flex-end;
          padding-top: 22px;
        }

        .invoice-summary {
          width: min(100%, 360px);
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 16px;
          background: #fcfdfc;
        }

        .invoice-summary-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 6px 0;
          color: #667085;
          font-size: 13px;
        }

        .invoice-summary-value {
          direction: ltr;
          white-space: nowrap;
          color: #344054;
          font-weight: 700;
        }

        .invoice-discount {
          color: #0b7a2d;
        }

        .invoice-coupon {
          display: block;
          margin-top: 3px;
          color: #8a94a3;
          font-size: 10px;
        }

        .invoice-total {
          margin-top: 8px;
          padding-top: 14px;
          border-top: 1px solid #d8dedb;
          color: #0b2447;
          font-size: 17px;
          font-weight: 800;
        }

        .invoice-total .invoice-summary-value {
          color: #0b7a2d;
          font-size: 19px;
        }

        .invoice-footer {
          padding: 20px 26px 24px;
          border-top: 1px solid #edf0ee;
          background: #fbfdfb;
          text-align: center;
        }

        .invoice-thanks {
          margin: 0;
          color: #0b2447;
          font-size: 14px;
          font-weight: 800;
        }

        .invoice-footer-note {
          margin: 5px 0 0;
          color: #7b8794;
          font-size: 11px;
          line-height: 1.7;
        }

        @media screen and (max-width: 560px) {
          .invoice-body {
            padding: 18px;
          }

          .invoice-header {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .invoice-brand {
            justify-content: center;
            text-align: center;
          }

          .invoice-logo {
            width: 62px;
            height: 62px;
          }

          .invoice-title {
            font-size: 22px;
          }

          .invoice-order-box {
            min-width: 0;
          }

          .invoice-customer-grid {
            grid-template-columns: 1fr;
          }

          .invoice-products-head {
            display: none;
          }

          .invoice-product-row {
            grid-template-columns: 1fr auto;
            row-gap: 8px;
          }

          .invoice-product-row > :nth-child(2),
          .invoice-product-row > :nth-child(3) {
            color: #667085;
            font-size: 11px;
          }

          .invoice-product-row > :nth-child(4) {
            grid-column: 2;
            grid-row: 1;
            font-weight: 800;
            color: #0b2447;
          }

          .invoice-summary {
            width: 100%;
          }
        }

        @media print {
          .invoice-root {
            color: #111827;
          }

          .invoice-paper {
            max-width: none;
            border: 1px solid #d8dedb;
            border-radius: 0;
            box-shadow: none;
          }

          .invoice-body {
            padding: 8mm 9mm 6mm;
          }

          .invoice-footer {
            padding: 5mm 9mm 6mm;
          }

          .invoice-header,
          .invoice-section,
          .invoice-summary {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .invoice-products {
            break-inside: auto;
            page-break-inside: auto;
          }
        }
      `}</style>

      <div className="invoice-paper">
        <div className="invoice-topline" />

        <div className="invoice-body">
          <header className="invoice-header">
            <div className="invoice-brand">
              <img
                src={logo}
                alt="سوقيا"
                className="invoice-logo"
              />

              <div>
                <h2 className="invoice-title">
                  فاتورة سوقيا
                </h2>

                <p className="invoice-subtitle">
                  ملخص طلبك بشكل واضح وبسيط
                </p>
              </div>
            </div>

            <div className="invoice-order-box">
              <p className="invoice-order-label">
                رقم الطلب
              </p>

              <p className="invoice-order-number">
                {orderNumber}
              </p>
            </div>
          </header>

          <section className="invoice-section">
            <h3 className="invoice-section-title">
              بيانات العميل
            </h3>

            <div className="invoice-customer-grid">
              <div className="invoice-info-card">
                <p className="invoice-info-label">
                  الاسم
                </p>

                <p className="invoice-info-value">
                  {customer.name}
                </p>
              </div>

              <div className="invoice-info-card">
                <p className="invoice-info-label">
                  رقم الموبايل
                </p>

                <p
                  dir="ltr"
                  className="invoice-info-value"
                >
                  {customer.phone}
                </p>
              </div>

              <div className="invoice-info-card">
                <p className="invoice-info-label">
                  عنوان التوصيل
                </p>

                <p className="invoice-info-value">
                  {customer.address}
                </p>
              </div>
            </div>
          </section>

          <section className="invoice-section">
            <h3 className="invoice-section-title">
              تفاصيل الطلب
            </h3>

            <div className="invoice-products">
              <div className="invoice-products-head">
                <span>المنتج</span>
                <span>الكمية</span>
                <span>سعر الوحدة</span>
                <span>الإجمالي</span>
              </div>

              {items.map(
                (item) => {
                  const itemPrice =
                    item.finalPrice ??
                    item.price;

                  const itemTotal =
                    item.lineTotal ??
                    itemPrice *
                      item.quantity;

                  return (
                    <div
                      key={
                        item.orderItemId ??
                        item.id
                      }
                      className="invoice-product-row"
                    >
                      <div className="invoice-product-name">
                        {item.name}

                        {item.unit && (
                          <span className="invoice-product-unit">
                            {item.unit}
                          </span>
                        )}
                      </div>

                      <div className="invoice-number">
                        {item.quantity}
                      </div>

                      <div className="invoice-number">
                        {itemPrice} ج.م
                      </div>

                      <div className="invoice-number">
                        {itemTotal} ج.م
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <div className="invoice-summary-wrap">
              <div className="invoice-summary">
                <div className="invoice-summary-row">
                  <span>
                    سعر المنتجات
                  </span>

                  <span className="invoice-summary-value">
                    {subtotal} ج.م
                  </span>
                </div>

                <div className="invoice-summary-row">
                  <span>
                    التوصيل
                  </span>

                  <span className="invoice-summary-value">
                    {deliveryFee} ج.م
                  </span>
                </div>

                {discountAmount >
                  0 && (
                  <div className="invoice-summary-row invoice-discount">
                    <div>
                      <span>
                        الخصم
                      </span>

                      {appliedCoupon && (
                        <span className="invoice-coupon">
                          كود الخصم:{" "}
                          {
                            appliedCoupon
                          }
                        </span>
                      )}
                    </div>

                    <span className="invoice-summary-value invoice-discount">
                      - {discountAmount} ج.م
                    </span>
                  </div>
                )}

                <div className="invoice-summary-row invoice-total">
                  <span>
                    الإجمالي
                  </span>

                  <span className="invoice-summary-value">
                    {total} ج.م
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="invoice-footer">
          <p className="invoice-thanks">
            شكرًا لاختياركم سوقيا
          </p>

          <p className="invoice-footer-note">
            نتمنى لك تجربة تسوق سهلة ومريحة، ونسعد بخدمتك دائمًا.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Invoice;
