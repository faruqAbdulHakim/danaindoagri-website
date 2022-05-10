const CookiesHelper = {
  updateToken: (res, accessToken, refreshToken) => {
    res.setHeader('set-cookie', [
      `accessToken=${accessToken}; Path=/;`,
      `refreshToken=${refreshToken}; Path=/;`
    ]);
  },

  clearToken: (res) => {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
  }
}

export default CookiesHelper;
