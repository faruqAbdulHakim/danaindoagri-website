import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrderHelper from '@/utils/supabase-helper/order-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

// this endpoint only for marketing role
export default async function handler(req, res) {
  try {

    const method = req.method;
    
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    const userRole = User.role.roleName;
    if (userRole !== ROLE_NAME.MARKETING) {
      throw new Error('Tidak memiliki hak akses terhadap data');
    }
    
    if (method === 'GET') {
      return await getOrders(req, res);
    } else {
      throw new Error('Invalid method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}

async function getOrders(req, res) {
  const page = req.query.page || 1;
  const searchText = req.query.searchText || '';
  const { data, error } = await OrderHelper.getOnlineOrder(page, searchText);
  if (error) {
    throw new Error('Gagal mendapatkan data pemesanan');
  }

  return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data pemesanan', data});
}