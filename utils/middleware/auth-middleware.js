import CookiesHelper from '../functions/cookies-helper';
import AuthHelper from '../supabase-helper/auth-helper';

const authMiddleware = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  const { User, error, needUpdate } = await AuthHelper.getUser(accessToken, refreshToken);
  if (error) {
    CookiesHelper.clearToken(res);
    return {};
  }

  if (needUpdate['isNeed']) {
    const { accessToken, refreshToken } = needUpdate;
    CookiesHelper.updateToken(accessToken, refreshToken);
  }

  return {User};
}

export default authMiddleware;
