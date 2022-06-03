import authMiddleware from '@/utils/middleware/auth-middleware';
import RevenueHelper from '@/utils/supabase-helper/revenue-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return res
      .status(300)
      .json({ status: 300, message: 'JWT ERROR', location: '/login' });
  }

  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.MARKETING && userRole !== ROLE_NAME.OWNER) {
    throw new Error('Tidak memiliki hak akses');
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getRevenueList(res);
      default:
        break;
    }
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
  }
}

async function getRevenueList(res) {
  const { data, error } = await RevenueHelper.readAll();
  if (error) {
    throw new Error('Gagal mendapatkan data pendapatan');
  }

  return res
    .status(200)
    .json({ status: 200, message: 'Berhasil mendapatkan data', data });
}
