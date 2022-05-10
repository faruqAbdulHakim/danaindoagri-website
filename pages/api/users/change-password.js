import bcrypt from 'bcrypt';

import supabase from '@/utils/supabase';
import CONFIG from '@/global/config';
import AuthHelper from '@/utils/supabase-helper/auth-helper';
import authMiddleware from '@/utils/middleware/auth-middleware';

const { TABLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const { headers, method, body } = req;
  
    if (method !== 'POST') {
      throw new Error('Invalid Method');
    }
  
    if (headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }
  
    const { password, newPassword, newPasswordConfirmation } = body;
  
    if (!password || !newPassword || !newPasswordConfirmation) {
      throw new Error('Harap isi formulir dengan lengkap');
    }
    if (newPassword.length < 8) {
      throw new Error('Panjang password minimal 8 karakter');
    }
    if (newPassword !== newPasswordConfirmation) {
      throw new Error('Konfirmasi password salah');
    }
  
    // check jwt and get user  
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }
  
    // password matching
    const { data: Password, error } = await supabase.from(TABLE_NAME.USERS)
      .select('password')
      .eq('id', User.id)
      .single();
  
    if (error) {
      throw new Error('Akun tidak ditemukan');
    }
  
    const isPasswordMatch = bcrypt.compareSync(password, Password?.password);
    if (!isPasswordMatch) {
      throw new Error('Password lama yang anda masukkan tidak sesuai');
    }
  
    // password update
    const updatePassword = bcrypt.hashSync(newPassword, 10);
  
    const { error: updateError } = await supabase.from(TABLE_NAME.USERS) 
      .update({password: updatePassword})
      .match({id: User.id});
    if (updateError) {
      throw new Error('Gagal mengubah password');
    }
  
    return res.status(200).json({status: 200, message: 'Ubah password berhasil'})
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}