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
      .select('id, createdAt');
    if (error) {
      throw new Error('Gagal mendapatkan data');
    }

    const result = data.map((order) => {
      let date = new Date(order.createdAt)
        .toLocaleString('en-US', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .split('/');
      date = `${date[2]}-${date[0]}-${date[1]}`;

      return { id: order.id, date: date };
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
