import AuthHelper from '@/utils/supabase-helper/auth-helper';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CookiesHelper from '@/utils/functions/cookies-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  const method = req.method;

  try {
    if (method === 'GET') {
      return await GetUser(req, res);
    } else if (method === 'PUT') {
      // IMPORTANT: UPDATE USER IS UPDATING ONE FIELD ONLY
      return await UpdateUser(req, res);
    } else {
      throw new Error('Invalid Method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message})
  }

}

async function GetUser(req, res) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
  }
  const userRole = User?.role?.roleName;

  const query = req.query;
  const roleQuery = query.roleQuery || '';
  const searchQuery = query.searchQuery || '';

  if (roleQuery === ROLE_NAME.CUSTOMERS) {
    if (userRole !== ROLE_NAME.MARKETING && userRole !== ROLE_NAME.OWNER) {
      return res.status(300).json({status: 300, 
        message: 'Anda tidak memiliki akses untuk melihat data customer',
        location: '/'
      })
    }  
  }

  if (roleQuery === ROLE_NAME.MARKETING || roleQuery === ROLE_NAME.PRODUCTION) {
    if (userRole !== ROLE_NAME.MARKETING && userRole !== ROLE_NAME.OWNER) {
      return res.status(300).json({status: 300, 
        message: 'Anda tidak memiliki akses untuk melihat data customer',
        location: '/'
      })
    } 
  }

  const { data, error } = await UsersHelper.getUserByRole(roleQuery, searchQuery, 20);
  if (error) {
    throw new Error('Gagal mengambil data dari database')
  }
  
  return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data', data})  
}


async function UpdateUser(req, res) {
  const { headers, body } = req;

  if (headers['content-type'] !== 'application/json') {
    throw new Error('Invalid Content-Type');
  }

  const { name, value } = body;
  if (!name || !value) {
    throw new Error('Invalid schema');
  }

  const { User } = await authMiddleware(req, res);
  if (!User) {
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
  }

  if (name === 'fullName' && /\d/g.test(value)) {
    throw new Error('Nama tidak dapat berupa angka');
  }
  if (name === 'tel' && /[A-Za-z]/gi.test(value)) {
    throw new Error('Nomor Telepon harus berupa angka');
  }

  const { error: updateDataError } = await UsersHelper.updateUserOneField(name, value, User.id);
  
  if (updateDataError) {
    throw new Error('Update error');
  }

  // update user jwt
  User[name] = value;
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
}
