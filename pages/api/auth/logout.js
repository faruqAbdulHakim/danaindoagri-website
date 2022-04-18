export default function handler(req, res) {
  res.setHeader('set-cookie', [
    `accessToken=delete; Path=/; Max-Age=0`,
    `refreshToken=delete; Path=/; Max-Age=0`
  ]);
  res.status(300).json({status: 300, message: 'logout sukses', location: '/'})
}
