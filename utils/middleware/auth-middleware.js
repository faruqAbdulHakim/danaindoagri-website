import supabase from '@/utils/supabase';
import JwtVerify from '@/utils/jwt-verify';
import CONFIG from '@/global/config';
import AuthHelper from '@/utils/supabase-helper/auth-helper';

const { TABLE_NAME } = CONFIG.SUPABASE;
const { 
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
} = CONFIG.JWT

const getUser = async (accessToken, refreshToken) => {
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

  const {
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken, 
    newSessionToken
  } = AuthHelper.generateJwtToken(User);
  await AuthHelper.updateSessionToken(User['id'], newSessionToken);

  // User properties: id, fullName, gender, dob, address, postalCode, email, password, tel, sessionToken, role
  delete User['id'];
  delete User['password'];
  delete User['sessionToken'];

  returnValue['User'] = User;
  returnValue['needUpdate']['isNeed'] = true;
  returnValue['needUpdate']['accessToken'] = newAccessToken;
  returnValue['needUpdate']['refreshToken'] = newRefreshToken;
  return returnValue;
}

const authMiddleware = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;
  const { User, error, needUpdate } = await getUser(accessToken, refreshToken);
  if (error) {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
    return {};
  }

  if (needUpdate['isNeed']) {
    console.log('Refreshed!')
    const { accessToken, refreshToken } = needUpdate;
    res.setHeader('set-cookie', [
      `accessToken=${accessToken}; Path=/;`,
      `refreshToken=${refreshToken}; Path=/;`
    ]);
  }

  return {User};
}

export default authMiddleware;
