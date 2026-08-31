export const ordersMock = [
  {
    id: 1,
    orderNumber: '12345',
    createdAt: '2026-08-25T14:30:00',

    status: 'out_for_delivery',

    items: [
      {
        id: 1,
        name: 'أرز مصري ممتاز المطبخ',
        unit: '1 كيلو',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCMqCiKA0yMYsFnJpRBYVLduxWhPM24XDVKfS5K3WUQRsmhejGeXlTa3PY5tYExeRuKyRb3kzM53zNH9PbxnfD6ZQUgrexhMNEyyLEVjVRQlVgqhOYOjqUbX6W4Dcy3YTTcKc6etRwsTr7C7d9wASL6l4eRkvB7IWs0PlkD9CKbqo-Bvrp9R38FBMZP7W_YyQK1Knj9VCrUa7RKnkfB9Fk2XlrZ_9adVqi8xOQlMByNrjqndrDKwSKG',
        price: 39,
        discountPercentage: 10,
        quantity: 3,
        stock: 50,
      },
      {
        id: 2,
        name: 'مكرونة اسباجيتي إيطاليانو',
        unit: '400 جرام',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDBTkNJUmFjplJAwFYe3i4QodzkHeRy7SABtvacIdvdKiR8DUjG_42exS4J-GjlC0POYVrhsnFdh9-w4ExzCFdu8u8MdG9JjgpgmhTST05LZaNs3tqtnbICIaeq4M-HXVfngnE1RJfJs2d3WKVsdLtqanyx3HNa9-WHoRRvdr39of9ol2ylyUwPXspEfX3IZsyqQ949I3ja-G0_XT-CLiZFDt2dB1VhhutFVX_1ttHwTELJnWLW7wQX',
        price: 14,
        discountPercentage: 0,
        quantity: 2,
        stock: 40,
      },
      {
        id: 3,
        name: 'سكر أبيض ناعم الأسرة',
        unit: '1 كيلو',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB1x08-S5GUzCefR0GUuy_fR4eAL9gswCNUSOoClgmq8ib1pNpVlqiRqbFYnujPUWShjyZmhuPP2Sz5z0pVu44LA2BCBNLmH30aB3SNdUX82Ztddm4PCPZHFFS8_bca2bMNAQuKop3KvGdXe_j2ScEf8GhesViTx43OGsYH_tdTdhQgBQMcRL3ucHhsQTqI0Jos4Xsa467_MACswUb5dPlAceRNEFSH65kPe7c9G1jPXTIzdPfrFNHL',
        price: 27,
        discountPercentage: 0,
        quantity: 1,
        stock: 30,
      },
      {
        id: 4,
        name: 'زيت عباد الشمس عافية',
        unit: '1 لتر',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDfjcNFGeiVi4LEmQOJII966np4iZmfdVgJxboNIkzSrAKdrVBXPFoMC-qCoReVjHSi1JSFhXi5vqnblGTVWnyuVX7mJCnADlawRYCxlvXyfEA_CbuVg6xFXqDiPxkfe4I8lEyXBN28xls5dVUsyCveZgI3yh-A8Cu6-kp3GhjxvwMQUfBEkVN1k8LpGx7Ry2UBaPp7i5jwS0crWsLHm3298xzEFpV7iNj_IE3Cq0EjToymy2PUIjvq',
        price: 65,
        discountPercentage: 0,
        quantity: 1,
        stock: 25,
      },
    ],

    total: 225,
  },

  {
    id: 2,
    orderNumber: '12344',
    createdAt: '2026-08-20T12:15:00',

    status: 'delivered',

    items: [
      {
        id: 1,
        name: 'أرز مصري ممتاز المطبخ',
        unit: '1 كيلو',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCMqCiKA0yMYsFnJpRBYVLduxWhPM24XDVKfS5K3WUQRsmhejGeXlTa3PY5tYExeRuKyRb3kzM53zNH9PbxnfD6ZQUgrexhMNEyyLEVjVRQlVgqhOYOjqUbX6W4Dcy3YTTcKc6etRwsTr7C7d9wASL6l4eRkvB7IWs0PlkD9CKbqo-Bvrp9R38FBMZP7W_YyQK1Knj9VCrUa7RKnkfB9Fk2XlrZ_9adVqi8xOQlMByNrjqndrDKwSKG',
        price: 39,
        discountPercentage: 10,
        quantity: 2,
        stock: 50,
      },
      {
        id: 2,
        name: 'مكرونة اسباجيتي إيطاليانو',
        unit: '400 جرام',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDBTkNJUmFjplJAwFYe3i4QodzkHeRy7SABtvacIdvdKiR8DUjG_42exS4J-GjlC0POYVrhsnFdh9-w4ExzCFdu8u8MdG9JjgpgmhTST05LZaNs3tqtnbICIaeq4M-HXVfngnE1RJfJs2d3WKVsdLtqanyx3HNa9-WHoRRvdr39of9ol2ylyUwPXspEfX3IZsyqQ949I3ja-G0_XT-CLiZFDt2dB1VhhutFVX_1ttHwTELJnWLW7wQX',
        price: 14,
        discountPercentage: 0,
        quantity: 1,
        stock: 40,
      },
    ],

    total: 84,
  },

  {
    id: 3,
    orderNumber: '12346',
    createdAt: '2026-08-25T15:10:00',

    status: 'preparing',

    items: [
      {
        id: 3,
        name: 'سكر أبيض ناعم الأسرة',
        unit: '1 كيلو',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB1x08-S5GUzCefR0GUuy_fR4eAL9gswCNUSOoClgmq8ib1pNpVlqiRqbFYnujPUWShjyZmhuPP2Sz5z0pVu44LA2BCBNLmH30aB3SNdUX82Ztddm4PCPZHFFS8_bca2bMNAQuKop3KvGdXe_j2ScEf8GhesViTx43OGsYH_tdTdhQgBQMcRL3ucHhsQTqI0Jos4Xsa467_MACswUb5dPlAceRNEFSH65kPe7c9G1jPXTIzdPfrFNHL',
        price: 27,
        discountPercentage: 0,
        quantity: 2,
        stock: 30,
      },
    ],

    total: 69,
  },

  {
    id: 4,
    orderNumber: '12347',
    createdAt: '2026-08-25T16:45:00',

    status: 'received',

    items: [
      {
        id: 4,
        name: 'زيت عباد الشمس عافية',
        unit: '1 لتر',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDfjcNFGeiVi4LEmQOJII966np4iZmfdVgJxboNIkzSrAKdrVBXPFoMC-qCoReVjHSi1JSFhXi5vqnblGTVWnyuVX7mJCnADlawRYCxlvXyfEA_CbuVg6xFXqDiPxkfe4I8lEyXBN28xls5dVUsyCveZgI3yh-A8Cu6-kp3GhjxvwMQUfBEkVN1k8LpGx7Ry2UBaPp7i5jwS0crWsLHm3298xzEFpV7iNj_IE3Cq0EjToymy2PUIjvq',
        price: 65,
        discountPercentage: 0,
        quantity: 1,
        stock: 25,
      },
    ],

    total: 80,
  },
  {
  id: 5,
  orderNumber: '12345',
  createdAt: '2026-08-25T14:30:00',

  status: 'out_for_delivery',

  customer: {
    name: 'مودي',
    phone: '01007349516',
    address: 'شارع التحرير، الدقي، الجيزة',
  },

  items: [
    {
        id: 4,
        name: 'زيت عباد الشمس عافية',
        unit: '1 لتر',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDfjcNFGeiVi4LEmQOJII966np4iZmfdVgJxboNIkzSrAKdrVBXPFoMC-qCoReVjHSi1JSFhXi5vqnblGTVWnyuVX7mJCnADlawRYCxlvXyfEA_CbuVg6xFXqDiPxkfe4I8lEyXBN28xls5dVUsyCveZgI3yh-A8Cu6-kp3GhjxvwMQUfBEkVN1k8LpGx7Ry2UBaPp7i5jwS0crWsLHm3298xzEFpV7iNj_IE3Cq0EjToymy2PUIjvq',
        price: 65,
        discountPercentage: 0,
        quantity: 1,
        stock: 25,
      },
  ],

  subtotal: 210,
  discountAmount: 20,
  discountPercentage: 10,
  appliedCoupon: 'SOQIA10',
  deliveryFee: 15,
  total: 205,
}
]