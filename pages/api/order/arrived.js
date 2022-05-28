import authMiddleware from '@/utils/middleware/auth-middleware';
import OrderHelper from '@/utils/supabase-helper/order-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      return await newArrivedOrderConfirmation(req, res);
    } else {
      throw new Error('Invalid Method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message})
  }
}

async function newArrivedOrderConfirmation(req, res) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
  }

  if (User.role.roleName !== ROLE_NAME.CUSTOMERS) {
    throw new Error('Hanya Customer yang dapat mengkonfirmasi pesanan sampai tujuan');
  }

  const orderDetailId = req.body.orderDetailId;
  if(!orderDetailId) {
    throw new Error('ID Order Detail tidak ditemukan di request body');
  }

  const { error } = await OrderHelper.updateOrderDetail({
    status: 'diterima'
  }, orderDetailId);
  if (error) {
    throw new Error('Gagal mengkonfirmasi pesanan sampai tujuan');
  }

  return res.status(200).json({status: 200, message: 'Berhasil mengkonfirmasi pesanan sampai tujuan'});
}
