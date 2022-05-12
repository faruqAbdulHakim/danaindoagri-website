const CONFIG = {
  SUPABASE: {
    API_URL: process.env.SUPABASE_API_URL,
    API_KEY: process.env.SUPABASE_API_KEY,
    TABLE_NAME: {
      USERS: 'users',
      ROLE: 'role',
      PRODUCTS: 'products',
      PRODUCTS_PRICE: 'productsprice'
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
    },
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFESPAN: '1h',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_LIFESPAN: '3h',
  },
}

export default CONFIG;
