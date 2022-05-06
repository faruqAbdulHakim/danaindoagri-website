import fs from 'fs';

import nextConnect from 'next-connect';

import multipartFormParser from '@/utils/middleware/multipart-form-parser';
import ProductsHelper from '@/utils/supabase-helper/products-helper';
import AuthHelper from '@/utils/supabase-helper/auth-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

const handler = nextConnect();

handler.use(multipartFormParser);

handler.get(async (req, res) => {
  try {
    const { cookies } = req;

    const { accessToken, refreshToken } = cookies;
    const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
    if (getUserError) {
      res.setHeader('set-cookie', [
        `accessToken=delete; Path=/; Max-Age=0`,
        `refreshToken=delete; Path=/; Max-Age=0`
      ]);
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }
    const role = User?.role?.roleName;
    if (role !== ROLE_NAME.MARKETING) {
      return res.status(300).json({status: 300, message: 'Tidak Memiliki hak akses', location: '/'})
    }

    const { data, error } = await ProductsHelper.getAllProducts();
    if (error) {
      return res.status(400).json({status: 400, message: 'Gagal mendapatkan data products'})
    }
    res.status(200).json({status: 200, message: 'Berhasil mendapatkan data products', data})  
  } catch (e) {
    res.status(400).json({status: 400, message: e.message})
  }
})

handler.post(async (req, res) => {
  try {
    const { files, body, cookies } = req;

    const { accessToken, refreshToken } = cookies;
    const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
    if (getUserError) {
      res.setHeader('set-cookie', [
        `accessToken=delete; Path=/; Max-Age=0`,
        `refreshToken=delete; Path=/; Max-Age=0`
      ]);
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }
    const role = User?.role?.roleName;
    if (role !== ROLE_NAME.MARKETING) {
      return res.status(300).json({status: 300, message: 'Tidak Memiliki hak akses', location: '/'})
    }

    if (Object.entries(files).length === 0) {
      return res.status(400).json({status: 400, message: 'Pilih foto terlebih dahulu'})
    }

    const someBodyIsNull = Object.values(body).some((val) => val === '');
    if (someBodyIsNull) {
      return res.status(400).json({status: 400, message: 'Lengkapi formulir'});
    }

    const {filepath, mimetype, size} = files.file;
    if (size > 1024 * 1024) {
      return res.status(400).json({status: 400, message: 'Maksimal file gambar berukuran 1MB'});
    }
    const fileName = `products${new Date().getTime()}`;
    const rawData = fs.readFileSync(filepath);
    const { data, error } = await ProductsHelper.uploadImage(rawData, fileName, mimetype);
    if (error) {
      return res.status(400).json({status: 400, message: 'Gagal mengupload gambar produk'});
    }
    const Product = {
      ...body,
      imgUrl: data.Key.split('/').pop(),
    };

    const { error: insertTableError } = await ProductsHelper.addProduct(Product);
    if (insertTableError) {
      return res.status(400).json({status: 400, message: 'Gagal menambahkan produk ke tabel database'});
    }

    res.status(201).json({status: 201, message: 'Berhasil menambahkan data produk'});
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
