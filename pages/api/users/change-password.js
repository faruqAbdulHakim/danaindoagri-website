import bcrypt from 'bcrypt';

import supabase from '@/utils/supabase';
import CONFIG from '@/global/config';
import AuthHelper from '@/utils/supabase-helper/auth-helper';

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

  const { password, newPassword, newPasswordConfirmation } = body;

  if (!password || !newPassword || !newPasswordConfirmation) {
    return res.status(400).json({status: 400, message: 'Harap isi formulir dengan lengkap'})
  }
  if (newPassword.length < 8) {
    return res.status(400).json({status: 400, message: 'Panjang password minimal 8 karakter'})
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).json({status: 400, message: 'Konfirmasi password salah'})
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

  // password matching
  const { data: Password, error } = await supabase.from(TABLE_NAME.USERS)
    .select('password')
    .eq('id', User.id)
    .single();

  if (error) {
    return res.status(400).json({status: 400, message: 'Akun tidak ditemukan'})
  }

  const isPasswordMatch = bcrypt.compareSync(password, Password?.password);
  if (!isPasswordMatch) {
    return res.status(400).json({status: 400, message: 'Password lama yang anda masukkan tidak sesuai'})
  }

  // password update
  const updatePassword = bcrypt.hashSync(newPassword, 10);

  const { error: updateError } = await supabase.from(TABLE_NAME.USERS) 
    .update({password: updatePassword})
    .match({id: User.id});
  if (updateError) {
    return res.status(400).json({status: 400, message: 'Gagal mengubah password'})
  }

  return res.status(200).json({status: 200, message: 'Ubah password berhasil'})
}