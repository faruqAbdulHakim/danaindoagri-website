import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import supabase from '@/utils/supabase';

const { ROLE_NAME, TABLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res
        .status(300)
        .json({ status: 300, message: 'JWT ERROR', location: '/login' });
    }

    if (User.role.roleName === ROLE_NAME.CUSTOMERS) {
      throw new Error('Tidak memiliki hak akses');
    }

    const { data, error } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .select('*');
    if (error) {
      throw new Error('Gagal mendapatkan data');
    }

    const result = {
      'belum dibayar': 0,
      dikonfirmasi: 0,
      dikirim: 0,
      diterima: 0,
    };

    data.forEach((order) => {
      result[order.status] += 1;
    });

    res.status(200).json({
      status: 200,
      message: 'Berhasil mendapatkan data',
      data: result,
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
}
