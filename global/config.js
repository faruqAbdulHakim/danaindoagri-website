const CONFIG = {
  SUPABASE: {
    API_URL: process.env.SUPABASE_API_URL,
    API_KEY: process.env.SUPABASE_API_KEY,
    TABLE_NAME: {
      USERS: 'users',
      USERS_ROLE: 'users_role',
      ROLE: 'role',
    },
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFESPAN: '15m',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_LIFESPAN: '1h',
  },
}

export default CONFIG;
