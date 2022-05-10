import bcrpyt from 'bcrypt';

import AuthHelper from '@/utils/supabase-helper/auth-helper';
import CookiesHelper from '@/utils/functions/cookies-helper';

export default async function handler(req, res) {
  try {
    const { method, body: formLogin, headers } = req;

    if (method !== 'POST') {
      throw new Error('Invalid Method');
    }
    
    if (headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }

    // user input need to register
    const isSomeFormNull = Object.keys(formLogin).some((key) => formLogin[key] === '')

    if (isSomeFormNull) {
      throw new Error('Harap lengkapi formulir login.');
    }

    ///// login
    const {data: User} = await AuthHelper.login(formLogin);
    if (!User) {
      throw new Error('Email tidak ditemukan.');
    }

    // check is password valid
    const isValid = bcrpyt.compareSync(formLogin.password, User.password);
    if (!isValid) {
      throw new Error('Password yang anda masukkan salah.');
    }

    // generate jwt for session auth
    const { accessToken, refreshToken, newSessionToken } = AuthHelper.generateJwtToken(User);
    const { error: updateTokenError } = await AuthHelper.updateSessionToken(User.id, newSessionToken);
    if (updateTokenError) {
      throw new Error('Terjadi kesalahan di sisi server. ERR:[UPDATE TOKEN ERROR]');
    }
    CookiesHelper.updateToken(res, accessToken, refreshToken);

    res.status(300).json({status: 300, message: 'Login berhasil', location: '/'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}