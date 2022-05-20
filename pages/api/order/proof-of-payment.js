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
    if (error) {
      throw new Error('Gagal menambahkan bukti gambar ke database');
    }

    res.status(200).json({status: 200, message: 'Berhasil menambahkan bukti pembayaran'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
})

handler.put(async (req, res) => {
  try {
    const { User } = await authMiddleware(req, res);
    if (!User) {
      res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    const userRole = User.role.roleName;
    if (userRole !== ROLE_NAME.CUSTOMERS) {
      throw new Error('Tidak memiliki hak untuk mengubah file');
    }

    const files = req.files;
    if (Object.entries(files).length === 0) {
      throw new Error('Pilih gambar terlebih dahulu');
    }

    const orderId = req.body.orderId;
    if (!orderId) {
      throw new Error('Order Id tidak ditemukan di request body');
    }

    const { data: Order, error: getOrderError } = await OrderHelper.getCustomerOrderById(User.id, orderId);
    if (getOrderError) {
      throw new Error('Gagal mendapatkan detail order');
    }

    if (Order.userId !== User.id) {
      throw new Error('Customer Id tidak match');
    }
    
    // delete image
    const { error: deleteError } = await OrderHelper.deleteProofOfPayment(Order.proofOfPayment);
    if (deleteError) {
      throw new Error('Gagal menghapus file bukti pembayaran');
    }

    // upload new image
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
    if (error) {
      throw new Error('Gagal menambahkan bukti gambar ke database');
    }

    // update db
    const { error: updateDbError } = await OrderHelper.updateCustomerOrder(updatedData, orderId);
    if (updateDbError) {
      throw new Error('Gagal update database');
    }

    res.status(200).json({status: 200, message: 'Berhasil mengubah file bukti pembayaran'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
})

handler.delete(async (req, res) => {
  try {
    const { User } = await authMiddleware(req, res);
    if (!User) {
      res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    const userRole = User.role.roleName;
    if (userRole !== ROLE_NAME.CUSTOMERS) {
      throw new Error('Tidak memiliki hak untuk menghapus file');
    }

    const orderId = req.body.orderId;
    if (!orderId) {
      throw new Error('Order Id tidak ditemukan di request body');
    }

    const { data: Order, error: getOrderError } = await OrderHelper.getCustomerOrderById(User.id, orderId);
    if (getOrderError) {
      throw new Error('Gagal mendapatkan detail order');
    }

    if (Order.userId !== User.id) {
      throw new Error('Customer Id tidak match');
    }

    const updatedData = {
      proofOfPayment: null
    }
    
    const { error: updateDbError } = await OrderHelper.updateCustomerOrder(updatedData, orderId);
    if (updateDbError) {
      throw new Error('Gagal update database');
    }

    const { error } = await OrderHelper.deleteProofOfPayment(Order.proofOfPayment);
    if (error) {
      throw new Error('Gagal menghapus file bukti pembayaran');
    }

    res.status(200).json({status: 200, message: 'Berhasil menghapus file bukti pembayaran'});
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
