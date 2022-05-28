import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import ReviewHelper from '@/utils/supabase-helper/review-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      return await newReview(req, res);
    } else {
      throw new Error('Invalid Method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}

async function newReview(req, res) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
  }

  if (User.role.roleName !== ROLE_NAME.CUSTOMERS) {
    throw new Error('Tidak memiliki hak akses');
  }

  const { onlineOrderId, productId, rating, review } = req.body;
  if (!onlineOrderId) throw new Error('ID Order tidak ada di request body');
  if (!productId) throw new Error('ID Produk tidak ada di request body');
  if (!rating || !(rating >= 1 && rating <=5)) throw new Error('Pilih rating dari 1 - 5');
  if (!review) throw new Error('Tulis review terlebih dahulu');
  if (review.length < 16) throw new Error('Panjang review minimal 16 karakter');

  const { error } = await ReviewHelper.addReview(User.id, productId, onlineOrderId, rating, review);
  if (error) {
    throw new Error('Gagal menambahkan ulasan');
  }
  
  res.status(200).json({status: 200, message: 'Berhasil menambahkan ulasan'});
}
