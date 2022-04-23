import supabase from '@/utils/supabase';

import AuthHelper from '@/utils/supabase-helper/auth-helper';
import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;

// TODO : Permissions check

export default async function handler(req, res) {
  const { headers, method, body } = req;

  if (method !== 'POST') {
    return res.status(400).json({status: 400, message:'Invalid Method'})
  }

  if (headers['content-type'] !== 'application/json') {
    return res.status(400).json({status: 400, message: 'Invalid Content-Type'});
  }

  const { address, postalCode } = body;

  if (!address || !postalCode) {
    return res.status(400).json({status: 400, message: 'Harap isi formulir dengan lengkap'})
  }

  // check jwt and get user
  const { accessToken, refreshToken } = req.cookies

  const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
  if (getUserError) {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
  }

  const { error: updateDataError } = await supabase.from(TABLE_NAME.USERS)
    .update({address, postalCode})
    .match({id: User.id});
  if (updateDataError) {
    return res.status(400).json({status: 400, message: 'Gagal mengubah alamat'});
  }

  // update user jwt
  User.address = address;
  User.postalCode = postalCode;
  const { 
    accessToken: newAccessToken, 
    refreshToken: newRefreshToken, 
    newSessionToken 
  } = AuthHelper.generateJwtToken(User);

  const { error: updateTokenError } = await AuthHelper.updateSessionToken(User.id, newSessionToken);
  if (updateTokenError) {
    return res.status(400).json({status: 400, message: 'Terjadi kesalahan di sisi server. ERR:[UPDATE TOKEN ERROR]'})
  }

  res.setHeader('set-cookie', [
    `accessToken=${newAccessToken}; Path=/;`,
    `refreshToken=${newRefreshToken}; Path=/;`
  ]);

  res.status(200).json({status: 200, message:'Data berhasil diubah'});
}