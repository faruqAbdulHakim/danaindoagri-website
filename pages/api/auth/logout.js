import CookiesHelper from '@/utils/functions/cookies-helper'

export default function handler(_, res) {
  CookiesHelper.clearToken(res);
  res.status(300).json({status: 300, message: 'logout sukses', location: '/'})
}
