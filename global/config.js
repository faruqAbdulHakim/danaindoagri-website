const CONFIG = {
  SUPABASE: {
    API_URL: process.env.SUPABASE_API_URL,
    API_KEY: process.env.SUPABASE_API_KEY,
    TABLE_NAME: {
      USERS: 'users',
      ROLE: 'role',
      RESOURCE: 'resource',
      RESOURCE_ROLE: 'resourcesRole',
    },
    ROLE_NAME: {
      CUSTOMERS: 'customer',
    },
    RESOURCE_NAME: {
      USERS: 'users',
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
