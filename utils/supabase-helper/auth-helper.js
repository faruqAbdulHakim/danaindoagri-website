import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import supabase from '@/utils/supabase';
import JwtVerify from '@/utils/jwt-verify';
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
      id,
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


  getUser: async (accessToken, refreshToken) => {
    const returnValue = {
      User: undefined,
      error: undefined,
      needUpdate: {
        isNeed: false,
        accessToken: undefined,
        refreshToken: undefined
      }
    }
    const { 
      decoded: decodedAccessToken, 
      error: accessTokenError 
    } = JwtVerify(accessToken, ACCESS_TOKEN_SECRET);
    if (!accessTokenError) {
      delete decodedAccessToken['iat'];
      delete decodedAccessToken['exp'];
      returnValue['User'] = decodedAccessToken;
      return returnValue;
    } 
  
    // use refresh token to get new accesstoken
    const {
      decoded: decodedRefreshToken,
      error: refreshTokenError
    } = JwtVerify(refreshToken, REFRESH_TOKEN_SECRET);
    if (refreshTokenError) {
      returnValue['error'] = 'JWT_ERROR'
      return returnValue;
    }
  
    const { id, sessionToken } = decodedRefreshToken;
    const { data: User, error: usernotfound } = await supabase.from(TABLE_NAME.USERS)
      .select(`
        *,
        ${TABLE_NAME.ROLE} (
          id, roleName
        )
      `)
      .eq('id', id)
      .single();
    if (usernotfound) {
      returnValue['error'] = 'USER_NOT_FOUND';
      return returnValue;
    }
  
    const isSessionTokenMatch = User.sessionToken === sessionToken;
    if (!isSessionTokenMatch) {
      returnValue['error'] = 'SESSION_TOKEN_NOT_MATCH';
      return returnValue;
    }

    // generate new token
    const {
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken, 
      newSessionToken
    } = AuthHelper.generateJwtToken(User);
    await AuthHelper.updateSessionToken(User['id'], newSessionToken);

    // User properties: id, fullName, gender, dob, address, postalCode, email, password, tel, sessionToken, roles
    delete User['password'];
    delete User['sessionToken'];
  
    returnValue['User'] = User;
    returnValue['needUpdate']['isNeed'] = true;
    returnValue['needUpdate']['accessToken'] = newAccessToken;
    returnValue['needUpdate']['refreshToken'] = newRefreshToken;
    return returnValue;
  },


}

export default AuthHelper;
