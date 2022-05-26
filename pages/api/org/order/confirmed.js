import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrderHelper from '@/utils/supabase-helper/order-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    if (User.role.roleName !== ROLE_NAME.PRODUCTION) {
      throw new Error('Tidak memiliki hak akses data');
    }

    if (req.method !== 'GET') {
      throw new Error('Invalid Method');
    }

    const { data, error } = await OrderHelper.getConfirmedOrder(
      req.query.page || 1,
      req.query.searchText || '',
    )
    if (error) {
      throw new Error('Gagal mendapatkan data');
    }

    res.status(200).json({status: 200, message: 'Berhasil mendapatkan data', data})
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}