import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrderHelper from '@/utils/supabase-helper/order-helper';
import ProductsHelper from '@/utils/supabase-helper/products-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const method = req.method;
    if (method === 'POST') {
      return await createNewOrder(req, res);
    } else {
      throw new Error('Invalid Method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message})
  }
}

async function createNewOrder(req, res) {
  const { body, headers } = req;

  if (headers['content-type'] !== 'application/json') {
    throw new Error('Invalid content type');
  }

  const { User } = await authMiddleware(req, res);
  if (!User) {
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
  }

  const someFormNull = Object.values(body).some((val) => val === '');
  if (someFormNull) {
    throw new Error('Lengkapi formulir');
  }

  const userRole = User.role.roleName;
  if (userRole === ROLE_NAME.CUSTOMERS) {
    // create online order by customer
    body.userId = User.id;
    body.status = 'belum dibayar';
    
    const { data: Product } = await ProductsHelper.getProductById(body.productId)
    const updatedStock = Product.stock - parseInt(body.qty)
    if (updatedStock < 0) {
      throw new Error('Pesanan melebihi stock yang tersedia');
    }

    await ProductsHelper.updateProduct(body.productId, {stock: updatedStock})
    const { error } = await OrderHelper.CustomerCreateOrder(body);
    if (error) {
      await ProductsHelper.updateProduct(body.productId, {stock: Product.stock});
      throw new Error('Gagal membuat pesanan');
    }

    return res.status(200).json({status: 200, message: 'Berhasil membuat pesanan'});
  } else {
    return res.status(300).json({status: 300, message: 'Tidak memiliki hak akses', location: '/'})
  }
}
