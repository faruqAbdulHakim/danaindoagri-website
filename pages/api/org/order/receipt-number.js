import authMiddleware from '@/utils/middleware/auth-middleware';
import OrderHelper from '@/utils/supabase-helper/order-helper';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      throw new Error('Invalid method');
    }
    if (req.headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content Type');
    }

    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.json(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    } 

    const { orderId, receiptNumber } = req.body;
    if (!orderId || !receiptNumber) {
      throw new Error('[Order Id / Nomor Resi] kosong');
    }

    const { data, error: insertReceiptNumberErr } = await OrderHelper.updateCustomerOrder({receiptNumber}, orderId);
    if (insertReceiptNumberErr) {
      throw new Error('Gagal Memasukkan nomor resi');
    }

    const { error } = await OrderHelper.updateOrderDetail({status: 'dikirim'}, data[0].orderDetailId)
    if (error) {
      await OrderHelper.updateCustomerOrder({receiptNumber: null}, orderId);
      throw new Error('Gagal mengubah status pemesanan');
    }
    
    res.status(200).json({status: 200, message: 'Berhasil memasukkan nomor resi'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}