import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrderHelper from '@/utils/supabase-helper/order-helper';
import ProductsHelper from '@/utils/supabase-helper/products-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {

    const method = req.method;
    
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    const userRole = User.role.roleName;
    if (userRole !== ROLE_NAME.MARKETING
        && userRole !== ROLE_NAME.PRODUCTION
        && userRole !== ROLE_NAME.OWNER) {
      throw new Error('Tidak memiliki hak akses terhadap data');
    }
    
    if (method === 'GET') {
      const orderType = req.query.orderType;
      if (orderType === 'online') return await getOnlineOrders(req, res);
      else if (orderType === 'offline') return await getOfflineOrders(req, res);
      else if (orderType === 'all') return await getAllOrder(req, res);
      else throw new Error('Status order online/offline tidak terdefinisi');
    } else if (method === 'POST') {
      if (userRole !== ROLE_NAME.MARKETING) {
        return res.status(300).json({status: 300, message: 'Tidak memiliki hak akses menambah data', location: '/org/dashboard'})
      }
      return await createOfflineOrder(req, res);
    } else if (method === 'PATCH') {
      if (userRole !== ROLE_NAME.MARKETING) {
        return res.status(300).json({status: 300, message: 'Tidak memiliki hak akses mengubah data', location: '/org/dashboard'})
      }
      return await updateOfflineOrder(req, res);
    } else {
      throw new Error('Invalid method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}

async function getOnlineOrders(req, res) {
  const page = req.query.page || 1;
  const searchText = req.query.searchText || '';
  const { data, error } = await OrderHelper.getOnlineOrder(page, searchText);
  if (error) {
    throw new Error('Gagal mendapatkan data pemesanan');
  }

  return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data pemesanan', data});
}

async function getOfflineOrders(req, res) {
  const page = req.query.page || 1;
  const { data, error } = await OrderHelper.getOfflineOrder(page);
  if (error) {
    throw new Error('Gagal mendapatkan data pemesanan');
  }

  return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data pemesanan', data});
}

async function getAllOrder(req, res) {
  const page = req.query.page || 1;
  const { data, error } = await OrderHelper.getOrderDetails(page);
  if (error) {
    throw new Error('Gagal mendapatkan data pemesanan');
  }

  return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data pemesanan', data});
}

async function createOfflineOrder(req, res) {
  const body = req.body;

  const someNull = Object.values(body).some((val) => val === '');
  if (someNull) {
    throw new Error('Lengkapi formulir');
  }
  if (!body.productId) {
    throw new Error('Product Id tidak ada di request');
  }
  if (body.qty === 0) {
    throw new Error('Pesanan tidak boleh kosong');
  }

  const { data: Product, error: getProductError } = await ProductsHelper.getProductById(body.productId);
  if (getProductError) {
    throw new Error('Gagal mendapatkan informasi data produk');
  }

  const updatedStock = Product.stock - body.qty
  if (updatedStock < 0) {
    throw new Error('Stok produk tidak mencukupi');
    
  }
  await ProductsHelper.updateProduct(body.productId, {stock: updatedStock});

  const { error } = await OrderHelper.createOfflineOrder(body);
  if (error) {
    await ProductsHelper.updateProduct(body.productId, {stock: Product.stock});
    throw new Error('Gagal menambahkan data');
  }

  return res.status(200).json({ status: 200, message: 'Berhasil menambahkan pesanan'})
}

async function updateOfflineOrder(req, res) {
  const { productId, qty, productPrice, orderDetail } = req.body;
  // update stock
  const { data: previousProduct, error: getPreviousProductErr } = await ProductsHelper.getProductById(orderDetail.productId);
  if (getPreviousProductErr) throw new Error('Gagal mendapatkan data produk sebelumnya');

  const { error: updatePreviousStockErr } = await ProductsHelper.updateProduct(
    orderDetail.productId, {stock: previousProduct.stock + orderDetail.qty}
  );
  if (updatePreviousStockErr) throw new Error('Gagal mengubah stok produk sebelumnya');

  try {
    const { data: Product, error: getProductErr } = await ProductsHelper.getProductById(productId);
    if (getProductErr) throw new Error('Gagal mendapatkan data produk');
    

    const updatedStock = Product.stock - qty;
    if (updatedStock < 0) {
      throw new Error('Stok tidak mencukupi')
    }

    await ProductsHelper.updateProduct(productId, {stock: updatedStock});

    const { error } = await OrderHelper.updateOrderDetail({qty, productPrice, productId}, orderDetail.id);
    if (error) {
      await ProductsHelper.updateProduct(productId, {stock: Product.stock});
      throw new Error('Gagal menambahkan data');
    }
  } catch (e) {
    await ProductsHelper.updateProduct(
      orderDetail.productId, {stock: previousProduct.stock}
    );
    throw new Error(e.message)
  }

  res.status(200).json({status: 200, message: 'Berhasil mengubah data'});
}
