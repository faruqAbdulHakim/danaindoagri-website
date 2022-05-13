import CookiesHelper from '../functions/cookies-helper';
import AuthHelper from '../supabase-helper/auth-helper';
import JwtVerify from '../jwt-verify';

import CONFIG from '@/global/config';
import UsersHelper from '../supabase-helper/users-helper';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = CONFIG.JWT;

const authMiddleware = async (req, res) => {
  let User;
  try {
    const { accessToken, refreshToken } = req.cookies;
    const { decoded: decodedAccessToken } = JwtVerify(accessToken, ACCESS_TOKEN_SECRET);
  
    if (decodedAccessToken) {
      delete decodedAccessToken.iat;
      delete decodedAccessToken.exp;
      User = decodedAccessToken;
    } else {
      // if access token error, refreshed with refresh token
      const { decoded: decodedRefreshToken } = JwtVerify(refreshToken, REFRESH_TOKEN_SECRET);
      if (!decodedRefreshToken) throw new Error();
    
      const { id, sessionToken } = decodedRefreshToken;
      const { data: newUser } = await UsersHelper.getUserById(id);
      if (newUser?.sessionToken !== sessionToken) throw new Error();
    
      const {
        accessToken: newAccessToken, 
        refreshToken: newRefreshToken, 
        newSessionToken
      } = AuthHelper.generateJwtToken(newUser);
    
      const { error: updateTokenError } = await AuthHelper.updateSessionToken(id, newSessionToken);
      if (updateTokenError) throw new Error();

      CookiesHelper.updateToken(res, newAccessToken, newRefreshToken);
      delete newUser.password;
      delete newUser.sessionToken;
      delete newUser.deleted;

      User = newUser;
    }

    return { User };
  } catch (e) {
    console.log(e)
    CookiesHelper.clearToken(res);
    return { User: null };
  }
}

export default authMiddleware;
