import bcrpyt from 'bcrypt';

import AuthHelper from '@/utils/supabase-helper/auth-helper';

export default async function handler(req, res) {
  const { method, body: formLogin, headers } = req;

  if (method !== 'POST') {
    return res.status(400).json({status: 400, message: 'Invalid Method'});
  }
  
  if (headers['content-type'] !== 'application/json') {
    return res.status(400).json({status: 400, message: 'Invalid Content-Type'});
  }

  // user input need to register
  const userInputList = ['email', 'password'];
  const isSomeFormNull = userInputList.some((userInput) => formLogin[userInput] === '');

  if (isSomeFormNull) {
    return res.status(400).json({status: 400, message: 'Harap lengkapi formulir login.'});
  }

  ///// login
  const {data: User} = await AuthHelper.login(formLogin);
  if (!User) {
    return res.status(400).json({status: 400, message: 'Email tidak ditemukan.'});
  }

  // check is password valid
  const isValid = bcrpyt.compareSync(formLogin.password, User.password);
  if (!isValid) {
    return res.status(400).json({status: 400, message: 'Password yang anda masukkan salah.'})
  }

  // generate jwt for session auth
  const { accessToken, refreshToken, newSessionToken } = AuthHelper.generateJwtToken(User);
  const { error: updateTokenError } = await AuthHelper.updateSessionToken(User.id, newSessionToken);
  if (updateTokenError) {
    return res.status(400).json({status: 400, message: 'Terjadi kesalahan di sisi server. ERR:[UPDATE TOKEN ERROR]'})
  }

  res.setHeader('set-cookie', [
    `accessToken=${accessToken}; Path=/;`,
    `refreshToken=${refreshToken}; Path=/;`
  ]);

  res.status(300).json({status: 300, message: 'Login berhasil', location: '/'});
}