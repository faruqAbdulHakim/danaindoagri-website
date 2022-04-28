import AuthHelper from '@/utils/supabase-helper/auth-helper';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  const { query, method, cookies } = req;
  const { accessToken, refreshToken } = cookies;
  const roleQuery = query.roleQuery || '';
  const searchQuery = query.searchQuery || '';

  const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
  if (getUserError) {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
  }
  const role = User?.role?.roleName;
  if (method == 'GET') {

    if (roleQuery === ROLE_NAME.CUSTOMERS) {
      if (role !== ROLE_NAME.MARKETING && role !== ROLE_NAME.OWNER) {
        return res.status(300).json({status: 300, 
          message: 'Anda tidak memiliki akses untuk melihat data customer',
          location: '/'
        })
      }  
    }

    if (roleQuery === ROLE_NAME.MARKETING || roleQuery === ROLE_NAME.PRODUCTION) {
      if (role !== ROLE_NAME.MARKETING && role !== ROLE_NAME.OWNER) {
        return res.status(300).json({status: 300, 
          message: 'Anda tidak memiliki akses untuk melihat data customer',
          location: '/'
        })
      } 
    }

    const { data, error } = await UsersHelper.getUserByRole(roleQuery, searchQuery, 20);
    if (error) {
      return res.status(400).json({status: 400, message: 'Gagal mengambil data dari database'})
    }
    
    return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data', data})
  }
  
  res.status(400).json({status: 400, message: 'Invalid Method'})
}

