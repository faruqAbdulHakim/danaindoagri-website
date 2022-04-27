import AuthHelper from '@/utils/supabase-helper/auth-helper';
import CONFIG from '@/global/config';
import supabase from '@/utils/supabase';

const { ROLE_NAME, TABLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  const { query, method, cookies } = req;
  const { accessToken, refreshToken } = req.cookies;
  const searchQuery = query.searchQuery || '';

  if (method !== 'GET') {
    return res.status(400).json({status: 400, message: 'Invalid Method'})
  }

  // check jwt and permission
  const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
  if (getUserError) {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
  }

  const role = User?.role?.roleName;
  if (role !== ROLE_NAME.MARKETING && role !== ROLE_NAME.OWNER) {
    return res.status(300).json({status: 300, 
      message: 'Anda tidak memiliki akses untuk melihat data customer',
      location: '/'
    })
  }

  const { data, error: getDataError } = await supabase.from(TABLE_NAME.USERS)
  .select(`*, ${TABLE_NAME.ROLE}!inner(roleName)`)
  .eq(`${TABLE_NAME.ROLE}.roleName`, ROLE_NAME.CUSTOMERS)
  .ilike('fullName', `%${searchQuery}%`)
  .limit(5)
  if (getDataError) {
    return res.status(400).json({status: 400, message: 'Gagal mengambil data dari database'})
  }

  res.status(200).json({status: 200, message: 'Berhasil mendapatkan data', data})
}