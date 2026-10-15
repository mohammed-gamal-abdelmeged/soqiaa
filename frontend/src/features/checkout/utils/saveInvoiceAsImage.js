import logo from "../../../assets/images/logo.png";

const COLORS = {
  primary: "#0b2447",
  green: "#0b7a2d",
  greenSoft: "#f3faf5",
  text: "#344054",
  muted: "#7b8794",
  border: "#dfe7e2",
  panel: "#f8fbf9",
  white: "#ffffff",
};

const roundRect = (
  context,
  x,
  y,
  width,
  height,
  radius,
) => {
  const r =
    Math.min(
      radius,
      width / 2,
      height / 2,
    );

  context.beginPath();
  context.moveTo(
    x + r,
    y,
  );
  context.arcTo(
    x + width,
    y,
    x + width,
    y + height,
    r,
  );
  context.arcTo(
    x + width,
    y + height,
    x,
    y + height,
    r,
  );
  context.arcTo(
    x,
    y + height,
    x,
    y,
    r,
  );
  context.arcTo(
    x,
    y,
    x + width,
    y,
    r,
  );
  context.closePath();
};

const drawPanel = (
  context,
  x,
  y,
  width,
  height,
  {
    fill = COLORS.white,
    stroke = COLORS.border,
    radius = 24,
  } = {},
) => {
  roundRect(
    context,
    x,
    y,
    width,
    height,
    radius,
  );

  context.fillStyle =
    fill;

  context.fill();

  context.strokeStyle =
    stroke;

  context.lineWidth = 2;

  context.stroke();
};

const setFont = (
  context,
  size,
  weight = 400,
) => {
  context.font =
    `${weight} ${size}px Cairo, Arial, sans-serif`;
};

const wrapText = (
  context,
  text,
  maxWidth,
) => {
  const value =
    String(
      text ?? "",
    ).trim();

  if (!value) {
    return [
      "",
    ];
  }

  const words =
    value.split(
      /\s+/,
    );

  const lines = [];

  let currentLine = "";

  words.forEach(
    (word) => {
      const candidate =
        currentLine
          ? `${currentLine} ${word}`
          : word;

      if (
        context.measureText(
          candidate,
        ).width <=
          maxWidth ||
        !currentLine
      ) {
        currentLine =
          candidate;

        return;
      }

      lines.push(
        currentLine,
      );

      currentLine =
        word;
    },
  );

  if (currentLine) {
    lines.push(
      currentLine,
    );
  }

  return lines;
};

const loadImage =
  (source) =>
    new Promise(
      (
        resolve,
        reject,
      ) => {
        const image =
          new Image();

        image.onload =
          () =>
            resolve(
              image,
            );

        image.onerror =
          reject;

        image.src =
          source;
      },
    );

const canvasToBlob =
  (canvas) =>
    new Promise(
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

export async function saveInvoiceAsImage(
  order,
) {
  if (!order) {
    throw new Error(
      "Missing order",
    );
  }

  if (
    document.fonts?.ready
  ) {
    await document.fonts.ready;
  }

  const measureCanvas =
    document.createElement(
      "canvas",
    );

  const measureContext =
    measureCanvas.getContext(
      "2d",
    );

  if (!measureContext) {
    throw new Error(
      "Canvas unavailable",
    );
  }

  setFont(
    measureContext,
    28,
    700,
  );

  const addressLines =
    wrapText(
      measureContext,
      order.customer
        ?.address ||
        "غير محدد",
      350,
    );

  const productRowsHeight =
    Math.max(
      order.items?.length ||
        0,
      1,
    ) * 92;

  const addressExtra =
    Math.max(
      addressLines.length -
        1,
      0,
    ) * 28;

  const width =
    1400;

  const height =
    980 +
    productRowsHeight +
    addressExtra;

  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width =
    width;

  canvas.height =
    height;

  const context =
    canvas.getContext(
      "2d",
    );

  if (!context) {
    throw new Error(
      "Canvas unavailable",
    );
  }

  context.fillStyle =
    COLORS.white;

  context.fillRect(
    0,
    0,
    width,
    height,
  );

  context.direction =
    "rtl";

  context.textAlign =
    "right";

  context.textBaseline =
    "alphabetic";

  context.fillStyle =
    COLORS.green;

  context.fillRect(
    0,
    0,
    width,
    14,
  );

  const pagePadding =
    70;

  const contentWidth =
    width -
    pagePadding * 2;

  let y =
    70;

  let logoImage =
    null;

  try {
    logoImage =
      await loadImage(
        logo,
      );
  } catch {
    logoImage =
      null;
  }

  if (logoImage) {
    context.drawImage(
      logoImage,
      width -
        pagePadding -
        110,
      y,
      110,
      110,
    );
  }

  context.fillStyle =
    COLORS.primary;

  setFont(
    context,
    44,
    800,
  );

  context.fillText(
    "فاتورة سوقيا",
    width -
      pagePadding -
      140,
    y + 48,
  );

  context.fillStyle =
    COLORS.muted;

  setFont(
    context,
    22,
    500,
  );

  context.fillText(
    "ملخص طلبك بشكل واضح وبسيط",
    width -
      pagePadding -
      140,
    y + 86,
  );

  drawPanel(
    context,
    pagePadding,
    y,
    430,
    110,
    {
      fill:
        COLORS.greenSoft,
      radius: 22,
    },
  );

  context.fillStyle =
    COLORS.muted;

  setFont(
    context,
    20,
    600,
  );

  context.fillText(
    "رقم الطلب",
    pagePadding +
      390,
    y + 35,
  );

  context.direction =
    "ltr";

  context.textAlign =
    "left";

  context.fillStyle =
    COLORS.primary;

  setFont(
    context,
    25,
    800,
  );

  context.fillText(
    String(
      order.orderNumber ||
        "",
    ),
    pagePadding + 30,
    y + 76,
  );

  context.direction =
    "rtl";

  context.textAlign =
    "right";

  y +=
    160;

  context.strokeStyle =
    COLORS.border;

  context.lineWidth = 2;

  context.beginPath();

  context.moveTo(
    pagePadding,
    y,
  );

  context.lineTo(
    width - pagePadding,
    y,
  );

  context.stroke();

  y +=
    48;

  context.fillStyle =
    COLORS.primary;

  setFont(
    context,
    30,
    800,
  );

  context.fillText(
    "بيانات العميل",
    width -
      pagePadding,
    y,
  );

  y +=
    28;

  const infoGap =
    20;

  const cardWidth =
    (contentWidth -
      infoGap * 2) /
    3;

  const cardsY =
    y + 18;

  const customerCards = [
    {
      label: "الاسم",
      value:
        order.customer
          ?.name ||
        "غير محدد",
    },
    {
      label:
        "رقم الموبايل",
      value:
        order.customer
          ?.phone ||
        "غير محدد",
      ltr: true,
    },
    {
      label:
        "عنوان التوصيل",
      value:
        order.customer
          ?.address ||
        "غير محدد",
      wrap: true,
    },
  ];

  const customerCardHeight =
    132 +
    addressExtra;

  customerCards.forEach(
    (
      card,
      index,
    ) => {
      const x =
        width -
        pagePadding -
        cardWidth -
        index *
          (
            cardWidth +
            infoGap
          );

      drawPanel(
        context,
        x,
        cardsY,
        cardWidth,
        customerCardHeight,
        {
          fill:
            COLORS.panel,
          radius: 20,
        },
      );

      context.fillStyle =
        COLORS.muted;

      setFont(
        context,
        19,
        600,
      );

      context.direction =
        "rtl";

      context.textAlign =
        "right";

      context.fillText(
        card.label,
        x +
          cardWidth -
          24,
        cardsY + 36,
      );

      context.fillStyle =
        COLORS.text;

      setFont(
        context,
        24,
        700,
      );

      if (card.ltr) {
        context.direction =
          "ltr";

        context.textAlign =
          "left";

        context.fillText(
          card.value,
          x + 24,
          cardsY + 80,
        );

        context.direction =
          "rtl";

        context.textAlign =
          "right";

        return;
      }

      if (card.wrap) {
        const lines =
          wrapText(
            context,
            card.value,
            cardWidth -
              48,
          );

        lines.forEach(
          (
            line,
            lineIndex,
          ) => {
            context.fillText(
              line,
              x +
                cardWidth -
                24,
              cardsY +
                80 +
                lineIndex *
                  28,
            );
          },
        );

        return;
      }

      context.fillText(
        card.value,
        x +
          cardWidth -
          24,
        cardsY + 80,
      );
    },
  );

  y =
    cardsY +
    customerCardHeight +
    54;

  context.fillStyle =
    COLORS.primary;

  setFont(
    context,
    30,
    800,
  );

  context.fillText(
    "تفاصيل الطلب",
    width -
      pagePadding,
    y,
  );

  y +=
    28;

  const tableX =
    pagePadding;

  const tableWidth =
    contentWidth;

  const headerHeight =
    60;

  const rowHeight =
    92;

  drawPanel(
    context,
    tableX,
    y + 18,
    tableWidth,
    headerHeight +
      productRowsHeight,
    {
      fill:
        COLORS.white,
      radius: 22,
    },
  );

  context.fillStyle =
    "#f4f8f5";

  roundRect(
    context,
    tableX,
    y + 18,
    tableWidth,
    headerHeight,
    22,
  );

  context.fill();

  const colProduct =
    tableWidth *
    0.43;

  const colQty =
    tableWidth *
    0.14;

  const colUnit =
    tableWidth *
    0.20;

  const colTotal =
    tableWidth -
    colProduct -
    colQty -
    colUnit;

  const colRight =
    width -
    pagePadding;

  const productX =
    colRight - 24;

  const qtyX =
    colRight -
    colProduct -
    24;

  const unitX =
    colRight -
    colProduct -
    colQty -
    24;

  const totalX =
    colRight -
    colProduct -
    colQty -
    colUnit -
    24;

  context.fillStyle =
    COLORS.muted;

  setFont(
    context,
    19,
    700,
  );

  const headerY =
    y + 56;

  context.fillText(
    "المنتج",
    productX,
    headerY,
  );

  context.fillText(
    "الكمية",
    qtyX,
    headerY,
  );

  context.fillText(
    "سعر الوحدة",
    unitX,
    headerY,
  );

  context.fillText(
    "الإجمالي",
    totalX,
    headerY,
  );

  const items =
    order.items ||
    [];

  items.forEach(
    (
      item,
      index,
    ) => {
      const rowTop =
        y +
        18 +
        headerHeight +
        index *
          rowHeight;

      if (index > 0) {
        context.strokeStyle =
          "#edf1ee";

        context.beginPath();

        context.moveTo(
          tableX + 18,
          rowTop,
        );

        context.lineTo(
          tableX +
            tableWidth -
            18,
          rowTop,
        );

        context.stroke();
      }

      const itemPrice =
        item.finalPrice ??
        item.price ??
        0;

      const itemTotal =
        item.lineTotal ??
        itemPrice *
          (
            item.quantity ||
            0
          );

      context.fillStyle =
        COLORS.primary;

      setFont(
        context,
        22,
        800,
      );

      const itemNameLines =
        wrapText(
          context,
          item.name ||
            "منتج",
          colProduct - 50,
        ).slice(
          0,
          2,
        );

      itemNameLines.forEach(
        (
          line,
          lineIndex,
        ) => {
          context.fillText(
            line,
            productX,
            rowTop +
              38 +
              lineIndex *
                26,
          );
        },
      );

      if (item.unit) {
        context.fillStyle =
          COLORS.muted;

        setFont(
          context,
          16,
          500,
        );

        context.fillText(
          item.unit,
          productX,
          rowTop + 76,
        );
      }

      context.fillStyle =
        COLORS.text;

      setFont(
        context,
        21,
        700,
      );

      context.fillText(
        String(
          item.quantity ||
            0,
        ),
        qtyX,
        rowTop + 52,
      );

      context.fillText(
        `${itemPrice} ج.م`,
        unitX,
        rowTop + 52,
      );

      context.fillStyle =
        COLORS.primary;

      context.fillText(
        `${itemTotal} ج.م`,
        totalX,
        rowTop + 52,
      );
    },
  );

  y +=
    18 +
    headerHeight +
    productRowsHeight +
    48;

  const summaryWidth =
    540;

  const summaryHeight =
    discountAmount =>
      discountAmount > 0
        ? 280
        : 230;

  const discount =
    order.discountAmount ||
    0;

  const summaryX =
    pagePadding;

  const summaryH =
    summaryHeight(
      discount,
    );

  drawPanel(
    context,
    summaryX,
    y,
    summaryWidth,
    summaryH,
    {
      fill:
        COLORS.panel,
      radius: 22,
    },
  );

  const drawSummaryRow =
    (
      label,
      value,
      rowY,
      {
        green = false,
        large = false,
      } = {},
    ) => {
      context.direction =
        "rtl";

      context.textAlign =
        "right";

      context.fillStyle =
        green
          ? COLORS.green
          : COLORS.muted;

      setFont(
        context,
        large
          ? 28
          : 21,
        large
          ? 800
          : 600,
      );

      context.fillText(
        label,
        summaryX +
          summaryWidth -
          28,
        rowY,
      );

      context.direction =
        "ltr";

      context.textAlign =
        "left";

      context.fillStyle =
        green
          ? COLORS.green
          : COLORS.text;

      setFont(
        context,
        large
          ? 30
          : 22,
        800,
      );

      context.fillText(
        value,
        summaryX + 28,
        rowY,
      );

      context.direction =
        "rtl";

      context.textAlign =
        "right";
    };

  let summaryY =
    y + 52;

  drawSummaryRow(
    "سعر المنتجات",
    `${order.subtotal || 0} ج.م`,
    summaryY,
  );

  summaryY +=
    54;

  drawSummaryRow(
    "التوصيل",
    `${order.deliveryFee || 0} ج.م`,
    summaryY,
  );

  if (discount > 0) {
    summaryY +=
      54;

    drawSummaryRow(
      "الخصم",
      `-${discount} ج.م`,
      summaryY,
      {
        green: true,
      },
    );

    if (
      order.appliedCoupon
    ) {
      context.fillStyle =
        COLORS.muted;

      setFont(
        context,
        15,
        500,
      );

      context.fillText(
        `كود الخصم: ${order.appliedCoupon}`,
        summaryX +
          summaryWidth -
          28,
        summaryY + 26,
      );
    }
  }

  summaryY +=
    58;

  context.strokeStyle =
    COLORS.border;

  context.beginPath();

  context.moveTo(
    summaryX + 24,
    summaryY - 30,
  );

  context.lineTo(
    summaryX +
      summaryWidth -
      24,
    summaryY - 30,
  );

  context.stroke();

  drawSummaryRow(
    "الإجمالي",
    `${order.total || 0} ج.م`,
    summaryY,
    {
      green: true,
      large: true,
    },
  );

  y +=
    summaryH +
    58;

  context.direction =
    "rtl";

  context.textAlign =
    "center";

  context.fillStyle =
    COLORS.primary;

  setFont(
    context,
    27,
    800,
  );

  context.fillText(
    "شكرًا لاختياركم سوقيا",
    width / 2,
    y,
  );

  context.fillStyle =
    COLORS.muted;

  setFont(
    context,
    19,
    500,
  );

  context.fillText(
    "نتمنى لك تجربة تسوق سهلة ومريحة، ونسعد بخدمتك دائمًا.",
    width / 2,
    y + 38,
  );

  const pngBlob =
    await canvasToBlob(
      canvas,
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
      order.orderNumber ||
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
    () => {
      URL.revokeObjectURL(
        downloadUrl,
      );
    },
    1000,
  );
}
