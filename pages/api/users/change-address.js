import AuthHelper from '@/utils/supabase-helper/auth-helper';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CookiesHelper from '@/utils/functions/cookies-helper';
import UsersHelper from '@/utils/supabase-helper/users-helper';

export default async function handler(req, res) {
  try {
    const { headers, method, body } = req;
    
    if (method !== 'POST') {
      throw new Error('Invalid Method');
    }

    if (headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }

    const { address, postalCode } = body;

    if (!address || !postalCode) {
      throw new Error('Harap isi formulir dengan lengkap');
    }

    // check jwt and get user
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }

    const { error: updateDataError} = await UsersHelper.updateUserById({ address, postalCode }, User.id);

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
      throw new Error('Terjadi kesalahan di sisi server. ERR:[UPDATE TOKEN ERROR]');
    }

    CookiesHelper.updateToken(res, newAccessToken, newRefreshToken);

    res.status(200).json({status: 200, message:'Data berhasil diubah'});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
}