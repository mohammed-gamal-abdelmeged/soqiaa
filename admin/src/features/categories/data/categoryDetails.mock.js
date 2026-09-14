export const categoryDetailsMock = {
  grocery: {
    id: 1,
    name: 'البقالة',
    slug: 'grocery',

    banner: {
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDhpNvAhzzcqHSHPwcn0fMLBEUIrB74Lk9g8ecdexj95Czer0DCORMJqvTYUoVA0pVh1PrK6194h7T5qeBPelH3FvfShjfdC1P6kLYYUyTsTbLH44JJhz5EzOKIAkUSmYoMJoWiltwLBYbDJHWLd5so7prCTxGZpwVXv9e4UYWR5meiiZ9pRy9Z-3IIZj58zj1q-UrjH8x-PhvBEHcHd8Whi0IHrW3V-SsEY7z9QUFfbvaQqKkjSVwI',
      title: 'أساسيات البيت',
      subtitle: 'كل اللي تحتاجه بأفضل جودة',
    },

    subcategories: [
      { id: 1, name: 'أرز ومكرونة' },
      { id: 2, name: 'سكر' },
      { id: 3, name: 'زيت' },
      { id: 4, name: 'صلصة' },
      { id: 5, name: 'شاي وقهوة' },
      { id: 6, name: 'معلبات' },
    ],

    products: [
      {
        id: 1,
        name: 'أرز مصري ممتاز المطبخ',
        unit: '1 كيلو',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCMqCiKA0yMYsFnJpRBYVLduxWhPM24XDVKfS5K3WUQRsmhejGeXlTa3PY5tYExeRuKyRb3kzM53zNH9PbxnfD6ZQUgrexhMNEyyLEVjVRQlVgqhOYOjqUbX6W4Dcy3YTTcKc6etRwsTr7C7d9wASL6l4eRkvB7IWs0PlkD9CKbqo-Bvrp9R38FBMZP7W_YyQK1Knj9VCrUa7RKnkfB9Fk2XlrZ_9adVqi8xOQlMByNrjqndrDKwSKG',
        price: 39,
        discountPercentage: 10,
        subcategoryId: 1,
        badge: null,
      },
      {
        id: 2,
        name: 'مكرونة اسباجيتي إيطاليانو',
        unit: '400 جرام',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDBTkNJUmFjplJAwFYe3i4QodzkHeRy7SABtvacIdvdKiR8DUjG_42exS4J-GjlC0POYVrhsnFdh9-w4ExzCFdu8u8MdG9JjgpgmhTST05LZaNs3tqtnbICIaeq4M-HXVfngnE1RJfJs2d3WKVsdLtqanyx3HNa9-WHoRRvdr39of9ol2ylyUwPXspEfX3IZsyqQ949I3ja-G0_XT-CLiZFDt2dB1VhhutFVX_1ttHwTELJnWLW7wQX',
        price: 14,
        discountPercentage: 0,
        subcategoryId: 1,
        badge: null,
      },
      {
        id: 3,
        name: 'زيت عباد الشمس عافية',
        unit: '1 لتر',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDfjcNFGeiVi4LEmQOJII966np4iZmfdVgJxboNIkzSrAKdrVBXPFoMC-qCoReVjHSi1JSFhXi5vqnblGTVWnyuVX7mJCnADlawRYCxlvXyfEA_CbuVg6xFXqDiPxkfe4I8lEyXBN28xls5dVUsyCveZgI3yh-A8Cu6-kp3GhjxvwMQUfBEkVN1k8LpGx7Ry2UBaPp7i5jwS0crWsLHm3298xzEFpV7iNj_IE3Cq0EjToymy2PUIjvq',
        price: 65,
        discountPercentage: 0,
        subcategoryId: 3,
        badge: null,
      },
      {
        id: 4,
        name: 'سكر أبيض ناعم الأسرة',
        unit: '1 كيلو',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB1x08-S5GUzCefR0GUuy_fR4eAL9gswCNUSOoClgmq8ib1pNpVlqiRqbFYnujPUWShjyZmhuPP2Sz5z0pVu44LA2BCBNLmH30aB3SNdUX82Ztddm4PCPZHFFS8_bca2bMNAQuKop3KvGdXe_j2ScEf8GhesViTx43OGsYH_tdTdhQgBQMcRL3ucHhsQTqI0Jos4Xsa467_MACswUb5dPlAceRNEFSH65kPe7c9G1jPXTIzdPfrFNHL',
        price: 27,
        discountPercentage: 0,
        subcategoryId: 2,
        badge: 'الأكثر مبيعاً',
      },
    ],
  },

  drinks: {
    id: 2,
    name: 'مشروبات',
    slug: 'drinks',

    banner: {
      image: '/mock/drinks-banner.jpg',
      title: 'انتعاش في كل وقت',
      subtitle: 'مشروبات باردة وعصائر لكل الأذواق',
    },

    subcategories: [
      { id: 1, name: 'مياه' },
      { id: 2, name: 'عصائر' },
      { id: 3, name: 'مشروبات غازية' },
    ],

    products: [
      {
        id: 201,
        name: 'عصير برتقال',
        unit: '1 لتر',
        image: '/mock/orange-juice.png',
        price: 30,
        discountPercentage: 0,
        subcategoryId: 2,
      },
      {
        id: 202,
        name: 'مياه معدنية',
        unit: '1.5 لتر',
        image: '/mock/water.png',
        price: 12,
        discountPercentage: 0,
        subcategoryId: 1,
      },
    ],
  },

  snacks: {
    id: 3,
    name: 'سناكس',
    slug: 'snacks',

    banner: {
      image: '/mock/snacks-banner.jpg',
      title: 'وقت السناكس',
      subtitle: 'اختيارات خفيفة ولذيذة',
    },

    subcategories: [
      { id: 1, name: 'شيبسي' },
      { id: 2, name: 'شوكولاتة' },
      { id: 3, name: 'بسكويت' },
    ],

    products: [
      {
        id: 301,
        name: 'شيبسي ملح',
        unit: '70 جرام',
        image: '/mock/chips.png',
        price: 15,
        discountPercentage: 0,
        subcategoryId: 1,
      },
      {
        id: 302,
        name: 'شوكولاتة بالحليب',
        unit: '45 جرام',
        image: '/mock/chocolate.png',
        price: 25,
        discountPercentage: 8,
        subcategoryId: 2,
      },
    ],
  },

  'dairy-cheese': {
    id: 4,
    name: 'ألبان وجبن',
    slug: 'dairy-cheese',

    banner: {
      image: '/mock/dairy-banner.jpg',
      title: 'طازج كل يوم',
      subtitle: 'ألبان وجبن بأفضل جودة',
    },

    subcategories: [
      { id: 1, name: 'لبن' },
      { id: 2, name: 'جبن' },
      { id: 3, name: 'زبادي' },
    ],

    products: [
      {
        id: 401,
        name: 'لبن كامل الدسم',
        unit: '1 لتر',
        image: '/mock/milk.png',
        price: 42,
        discountPercentage: 0,
        subcategoryId: 1,
      },
      {
        id: 402,
        name: 'جبنة بيضاء',
        unit: '500 جرام',
        image: '/mock/cheese.png',
        price: 55,
        discountPercentage: 0,
        subcategoryId: 2,
      },
    ],
  },

  fresh: {
    id: 5,
    name: 'فريش',
    slug: 'fresh',

    banner: {
      image: '/mock/fresh-banner.jpg',
      title: 'طازج وصحي',
      subtitle: 'خضار وفاكهة مختارة يوميًا',
    },

    subcategories: [
      { id: 1, name: 'خضروات' },
      { id: 2, name: 'فاكهة' },
    ],

    products: [
      {
        id: 501,
        name: 'طماطم طازجة',
        unit: '1 كيلو',
        image: '/mock/tomato.png',
        price: 22,
        discountPercentage: 0,
        subcategoryId: 1,
      },
      {
        id: 502,
        name: 'برتقال',
        unit: '1 كيلو',
        image: '/mock/orange.png',
        price: 35,
        discountPercentage: 0,
        subcategoryId: 2,
      },
    ],
  },

  cleaners: {
    id: 6,
    name: 'منظفات',
    slug: 'cleaners',

    banner: {
      image: '/mock/cleaners-banner.jpg',
      title: 'نظافة أسهل',
      subtitle: 'كل احتياجات البيت في مكان واحد',
    },

    subcategories: [
      { id: 1, name: 'منظفات أرضيات' },
      { id: 2, name: 'غسيل ملابس' },
      { id: 3, name: 'غسيل أطباق' },
    ],

    products: [
      {
        id: 601,
        name: 'منظف أرضيات',
        unit: '1 لتر',
        image: '/mock/cleaner.png',
        price: 48,
        discountPercentage: 0,
        subcategoryId: 1,
      },
      {
        id: 602,
        name: 'سائل غسيل أطباق',
        unit: '750 مل',
        image: '/mock/dish-soap.png',
        price: 32,
        discountPercentage: 5,
        subcategoryId: 3,
      },
    ],
  },
}