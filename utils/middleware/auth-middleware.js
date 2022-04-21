import AuthHelper from '../supabase-helper/auth-helper';

const authMiddleware = async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  const { User, error, needUpdate } = await AuthHelper.getUser(accessToken, refreshToken);
  if (error) {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
    return {};
  }

  if (needUpdate['isNeed']) {
    const { accessToken, refreshToken } = needUpdate;
    res.setHeader('set-cookie', [
      `accessToken=${accessToken}; Path=/;`,
      `refreshToken=${refreshToken}; Path=/;`
    ]);
  }

  return {User};
}

export default authMiddleware;
