const price = [
  {
    store: {
      _id: "2312sdawd21w",

      storeAddress: "76629970",

      storeName: "GraziellyStore",

      storeImage:
        "https://webstore-api-images.s3.sa-east-1.amazonaws.com/1709138971102_549635117.avif",
    },

    products: [
      {
        product: {
          _id: "jbdiwbd271g8b",

          title: "Short Jeans Feminino Cintura Alta Com Lycra Barra Desfiada",

          price: 59.9,

          discount: 0,

          dimensions: { weight: 0.12, height: 20, length: 20, width: 6 },

          thumbnail:
            "https://webstore-api-images.s3.sa-east-1.amazonaws.com/1709219244338_979488114.webp",
        },

        quantity: 1,
      },

      {
        product: {
          _id: "jbdiwbd271g8b",

          title: "Vestido Feminino Longo Para Festa Com Renda No Busto",

          price: 175.6,

          discount: 0,

          dimensions: { weight: 0.4, height: 160, length: 20, width: 3 },

          thumbnail:
            "https://webstore-api-images.s3.sa-east-1.amazonaws.com/1709219925468_841240873.webp",
        },

        quantity: 2,
      },
    ],

    shipment: [
      {
        id: 1,

        name: "PAC",

        error: "Dimensões do objeto ultrapassam o limite da transportadora.",

        company: {
          id: 1,

          name: "Correios",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png",
        },
      },

      {
        id: 2,

        name: "SEDEX",

        error: "Dimensões do objeto ultrapassam o limite da transportadora.",

        company: {
          id: 1,

          name: "Correios",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png",
        },
      },

      {
        id: 3,

        name: ".Package",

        price: "63.88",

        custom_price: "63.88",

        discount: "0.00",

        currency: "R$",

        delivery_time: 10,

        delivery_range: { min: 9, max: 10 },

        custom_delivery_time: 10,

        custom_delivery_range: { min: 9, max: 10 },

        packages: [
          {
            format: "box",

            dimensions: { height: 12, width: 12, length: 160 },

            weight: "0.92",

            insurance_value: "411.10",

            products: [
              { id: "65e09daca3cd888ee8776c63", quantity: 1 },

              { id: "65e0a055a3cd888ee8776ca9", quantity: 2 },
            ],
          },
        ],

        additional_services: {
          receipt: false,
          own_hand: false,
          collect: false,
        },

        company: {
          id: 2,

          name: "Jadlog",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png",
        },
      },

      {
        id: 4,

        name: ".Com",

        price: "60.28",

        custom_price: "60.28",

        discount: "0.00",

        currency: "R$",

        delivery_time: 8,

        delivery_range: { min: 7, max: 8 },

        custom_delivery_time: 8,

        custom_delivery_range: { min: 7, max: 8 },

        packages: [
          {
            format: "box",

            dimensions: { height: 12, width: 12, length: 160 },

            weight: "0.92",

            insurance_value: "411.10",

            products: [
              { id: "65e09daca3cd888ee8776c63", quantity: 1 },

              { id: "65e0a055a3cd888ee8776ca9", quantity: 2 },
            ],
          },
        ],

        additional_services: {
          receipt: false,
          own_hand: false,
          collect: false,
        },

        company: {
          id: 2,

          name: "Jadlog",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png",
        },
      },

      {
        id: 17,

        name: "Mini Envios",

        error: "Dimensões do objeto ultrapassam o limite da transportadora.",

        company: {
          id: 1,

          name: "Correios",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png",
        },
      },
    ],
  },

  {
    store: {
      _id: "jbdiwbd271g8b",

      storeAddress: "08451420",

      storeName: "DouglasStore",

      storeImage:
        "https://webstore-api-images.s3.sa-east-1.amazonaws.com/1709225421254_841068811.jpg",
    },

    products: [
      {
        product: {
          _id: "jbdiwbd271g8b",

          title: "Calça Skinny Preta Masculina Jeans Com Elastano Lycra 2023",

          price: 59,

          discount: 0,

          dimensions: { weight: 0.18, height: 30, length: 20, width: 5 },

          thumbnail:
            "https://webstore-api-images.s3.sa-east-1.amazonaws.com/1709225766351_710110715.webp",
        },

        quantity: 2,
      },
    ],

    shipment: [
      {
        id: 1,

        name: "PAC",

        price: "27.84",

        custom_price: "27.84",

        discount: "10.48",

        currency: "R$",

        delivery_time: 6,

        delivery_range: { min: 5, max: 6 },

        custom_delivery_time: 6,

        custom_delivery_range: { min: 5, max: 6 },

        packages: [
          {
            price: "27.84",

            discount: "10.48",

            format: "box",

            dimensions: { height: 10, width: 20, length: 30 },

            weight: "0.36",

            insurance_value: "118.00",

            products: [{ id: "65e0b726c2c36d132242f27f", quantity: 2 }],
          },
        ],

        additional_services: {
          receipt: false,
          own_hand: false,
          collect: false,
        },

        company: {
          id: 1,

          name: "Correios",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png",
        },
      },

      {
        id: 2,

        name: "SEDEX",

        price: "24.61",

        custom_price: "24.61",

        discount: "9.11",

        currency: "R$",

        delivery_time: 2,

        delivery_range: { min: 1, max: 2 },

        custom_delivery_time: 2,

        custom_delivery_range: { min: 1, max: 2 },

        packages: [
          {
            price: "24.61",

            discount: "9.11",

            format: "box",

            dimensions: { height: 10, width: 20, length: 30 },

            weight: "0.36",

            insurance_value: "118.00",

            products: [{ id: "65e0b726c2c36d132242f27f", quantity: 2 }],
          },
        ],

        additional_services: {
          receipt: false,
          own_hand: false,
          collect: false,
        },

        company: {
          id: 1,

          name: "Correios",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png",
        },
      },

      {
        id: 3,

        name: ".Package",

        price: "16.48",

        custom_price: "16.48",

        discount: "0.00",

        currency: "R$",

        delivery_time: 5,

        delivery_range: { min: 4, max: 5 },

        custom_delivery_time: 5,

        custom_delivery_range: { min: 4, max: 5 },

        packages: [
          {
            format: "box",

            dimensions: { height: 10, width: 20, length: 30 },

            weight: "0.36",

            insurance_value: "118.00",

            products: [{ id: "65e0b726c2c36d132242f27f", quantity: 2 }],
          },
        ],

        additional_services: {
          receipt: false,
          own_hand: false,
          collect: false,
        },

        company: {
          id: 2,

          name: "Jadlog",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png",
        },
      },

      {
        id: 4,

        name: ".Com",

        price: "15.31",

        custom_price: "15.31",

        discount: "0.00",

        currency: "R$",

        delivery_time: 4,

        delivery_range: { min: 3, max: 4 },

        custom_delivery_time: 4,

        custom_delivery_range: { min: 3, max: 4 },

        packages: [
          {
            format: "box",

            dimensions: { height: 10, width: 20, length: 30 },

            weight: "0.36",

            insurance_value: "118.00",

            products: [{ id: "65e0b726c2c36d132242f27f", quantity: 2 }],
          },
        ],

        additional_services: {
          receipt: false,
          own_hand: false,
          collect: false,
        },

        company: {
          id: 2,

          name: "Jadlog",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/jadlog.png",
        },
      },

      {
        id: 17,

        name: "Mini Envios",

        error: "Dimensões do objeto ultrapassam o limite da transportadora.",

        company: {
          id: 1,

          name: "Correios",

          picture:
            "https://sandbox.melhorenvio.com.br/images/shipping-companies/correios.png",
        },
      },
    ],
  },
];
export default price;
