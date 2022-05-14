import AuthHelper from '@/utils/supabase-helper/auth-helper';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CookiesHelper from '@/utils/functions/cookies-helper';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const { headers, method, body } = req;
    
    if (method !== 'POST') {
      throw new Error('Invalid Method');
    }

    if (headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }

    const { provinceId, cityId, postalCode, address } = body;

    if (!provinceId || !cityId || !postalCode || !address) {
      throw new Error('Harap isi formulir dengan lengkap');
    }

    // check jwt and get user
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }

    const userRole = User?.role?.roleName
    if (userRole === ROLE_NAME.MARKETING || userRole === ROLE_NAME.PRODUCTION) {
      throw new Error('Anda tidak memiliki hak akses untuk mengubah data ini');
    }

    const { error: updateDataError} = await UsersHelper.updateUserById({ cityId, postalCode, address }, User.id);
    if (updateDataError) {
      throw new Error('Gagal mengubah alamat');
    }

    // update user jwt
    const { data: newUser } = await UsersHelper.getUserById(User.id);
    if (!newUser) {
      throw new Error('Gagal mendapatkan pembaruan data');
    }
    const { 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken, 
      newSessionToken 
    } = AuthHelper.generateJwtToken(newUser);

    const { error: updateTokenError } = await AuthHelper.updateSessionToken(User.id, newSessionToken);
    if (updateTokenError) {
      throw new Error('Terjadi kesalahan di sisi server. ERR:[UPDATE TOKEN ERROR]');
    }

    CookiesHelper.updateToken(res, newAccessToken, newRefreshToken);

    res.status(200).json({status: 200, message:'Data berhasil diubah'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
}