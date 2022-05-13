import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import supabase from '@/utils/supabase';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import CONFIG from '@/global/config';

const { TABLE_NAME, ROLE_NAME } = CONFIG.SUPABASE;
const { 
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFESPAN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFESPAN
} = CONFIG.JWT

const AuthHelper = {
  userRegister: async (formRegister) => {
    // get customer role ID
    const { data: role, error: roleError } = await supabase.from(TABLE_NAME.ROLE)
      .select('id')
      .eq('roleName', ROLE_NAME.CUSTOMERS)
      .single();
    if (roleError) return {error: roleError};
    formRegister.roleId = role.id;

    // register
    const { data, error: registerError } = await supabase.from(TABLE_NAME.USERS)
      .insert([formRegister]);
    if (registerError) return {error: registerError};

    return {data};
  },


  isRegistered: async (email) => {
    const { data } = await UsersHelper.getUserByEmail(email);
    return data !== null;
  },


  updateSessionToken: async (id, newSessionToken) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .update({ sessionToken: newSessionToken })
      .match({ id });
    return { data, error }
  },


  generateJwtToken: (User) => {
    const accessTokenPayload = {...User};
    delete accessTokenPayload.password;
    delete accessTokenPayload.sessionToken;
    delete accessTokenPayload.deleted;

    const newSessionToken = bcrypt.genSaltSync(10);
    const refreshTokenPayload = {
      id: User.id,
      sessionToken: newSessionToken,
    }

    const accessToken = jwt.sign(
      accessTokenPayload, 
      ACCESS_TOKEN_SECRET, 
      {
        expiresIn: ACCESS_TOKEN_LIFESPAN,
      }
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_LIFESPAN,
      }
    );

    return {
      accessToken,
      refreshToken,
      newSessionToken
    };
  },

}

export default AuthHelper;
