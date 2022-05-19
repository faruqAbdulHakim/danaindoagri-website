import fs from 'fs';

import nextConnect from 'next-connect';

import multipartFormParser from '@/utils/middleware/multipart-form-parser';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrderHelper from '@/utils/supabase-helper/order-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

const handler = nextConnect();

handler.use(multipartFormParser);

handler.post(async (req, res) => {
  try {
    const { files, body } = req;

    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    const userRole = User.role.roleName;
    if (userRole !== ROLE_NAME.CUSTOMERS) {
      throw new Error('Hanya customer yang memiliki hak untuk mengupload bukti');
    }

    if (Object.entries(files).length === 0) {
      throw new Error('Pilih gambar terlebih dahulu');
    }

    const orderId = body.orderId;
    if (!orderId) {
      throw new Error('Tidak menemukan order Id di body request');
    }

    // upload image
    const {filepath, mimetype, size} = files.file;

    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      throw new Error('Invalid file type');
    }

    if (size > 1024 * 1024) {
      throw new Error('Maksimal file gambar berukuran 1MB');
    }

    const fileName = `proofofpayment${new Date().getTime()}`;
    const rawData = fs.readFileSync(filepath);
    const { data, error: uploadImageError } = await OrderHelper.uploadProofOfPayment(fileName, rawData, mimetype);
    if (uploadImageError) {
      throw new Error('Gagal mengupload gambar produk');
    }

    const updatedData = {
      proofOfPayment: data.Key.split('/').pop(),
    };

    const { error } = await OrderHelper.updateCustomerOrder(updatedData, orderId);
    console.log(error);
    if (error) {
      throw new Error('Gagal menambahkan bukti gambar ke database');
    }

    res.status(200).json({status: 200, message: 'Berhasil menambahkan bukti pembayaran'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler;
