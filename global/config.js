const CONFIG = {
  SUPABASE: {
    API_URL: process.env.SUPABASE_API_URL,
    API_KEY: process.env.SUPABASE_API_KEY,
    TABLE_NAME: {
      USERS: 'users',
      ROLE: 'role',
      PRODUCTS: 'products',
      PRODUCTS_WSPRICE: 'productswsprice',
      CITIES: 'cities',
      CITY_TYPE: 'citytype',
      PROVINCES: 'provinces',
      ONLINE_ORDERS: 'onlineorders',
      OFFLINE_ORDERS: 'offlineorders',
      ORDER_DETAIL: 'orderdetail',
    },
    ROLE_NAME: {
      CUSTOMERS: 'customer',
      MARKETING: 'marketing',
      PRODUCTION: 'produksi',
      OWNER: 'pemilik usaha',
    },
    BUCKETS: {

      AVATARS: {
        BUCKETS_NAME: 'avatars',
        AVATAR_BASE_URL: 'https://zjksleeilkmawgxpibva.supabase.co/storage/v1/object/public/avatars',
      },
      PRODUCTS: {
        BUCKETS_NAME: 'products',
        PRODUCTS_BASE_URL: 'https://zjksleeilkmawgxpibva.supabase.co/storage/v1/object/public/products'
      },
      PROOF_OF_PAYMENT: {
        BUCKETS_NAME: 'proofofpayment',
        BASE_URL: 'https://zjksleeilkmawgxpibva.supabase.co/storage/v1/object/public/proofofpayment'
      }
    },
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFESPAN: '1h',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_LIFESPAN: '3h',
  },
  RAJAONGKIR: {
    DEFAULT_ORIGIN: '160',
    API_KEY: process.env.RAJAONGKIR_API_KEY,
    ACCOUNT_TYPE: 'starter',
  },
}

export default CONFIG;
