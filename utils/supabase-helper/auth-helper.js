import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import supabase from '@/utils/supabase';
import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;
const { 
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFESPAN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFESPAN
} = CONFIG.JWT

const AuthHelper = {
  userRegister: async (formRegister) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .insert([formRegister]);
    if (error) return {error};
    const userId = data[0]['id']

    const { data: role, error: roleError } = await supabase.from(TABLE_NAME.ROLE)
      .select('id')
      .eq('roleName', 'customer')
      .single();
    if (roleError) return {error: roleError};
    const roleId = role.id;

    const { error: userRoleError } = await supabase.from(TABLE_NAME.USERS_ROLE)
      .insert([{userId, roleId}]);
    if ( userRoleError ) return {error: userRoleError};

    return {data};
  },


  login: async (formLogin) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .select(`
        *, 
        ${TABLE_NAME.ROLE} (
          id, roleName
        )
      `)
      .eq('email', formLogin['email'])
      .single();
    return { data, error };
  },


  isRegistered: async (email) => {
    const { data } = await supabase.from(TABLE_NAME.USERS)
      .select('id')
      .eq('email', email)
      .single();
    return data !== null
  },


  updateSessionToken: async (id, newSessionToken) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .update({ sessionToken: newSessionToken })
      .match({ id });
    return { data, error }
  },


  generateJwtToken: (User) => {
    // User properties: id, fullName, gender, dob, address, postalCode, email, password, tel, sessionToken, role
    const {id, fullName, gender, dob, address, postalCode, email, tel, role} = User
    const accessTokenPayload = {
      fullName,
      gender,
      dob,
      address,
      postalCode,
      email,
      tel,
      role,
    };

    const newSessionToken = bcrypt.genSaltSync(10);
    const refreshTokenPayload = {
      id,
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
