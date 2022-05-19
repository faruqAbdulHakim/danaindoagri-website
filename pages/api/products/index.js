import fs from 'fs';

import nextConnect from 'next-connect';

import multipartFormParser from '@/utils/middleware/multipart-form-parser';
import ProductsHelper from '@/utils/supabase-helper/products-helper';
import CONFIG from '@/global/config';
import authMiddleware from '@/utils/middleware/auth-middleware';

const { ROLE_NAME } = CONFIG.SUPABASE;

const handler = nextConnect();

handler.use(multipartFormParser);

handler.get(async (req, res) => {
  try {
    const productId = req.query.productId;
    if (productId) {
      const { data, error } = await ProductsHelper.getProductById(productId);
      if (error) {
        throw new Error('Gagal mendapatkan data product');
      }
      return res.status(200).json({status: 200, message: 'Berhasil mendapatkan data product', data});
    }

    const { data, error } = await ProductsHelper.getAllProducts();
    if (error) {
      throw new Error ('Gagal mendapatkan data products');
    }
    res.status(200).json({status: 200, message: 'Berhasil mendapatkan data products', data})  
  } catch (e) {
    res.status(400).json({status: 400, message: e.message})
  }
})

handler.post(async (req, res) => {
  try {
    const { files, body } = req;

    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }

    const role = User?.role?.roleName;
    if (role !== ROLE_NAME.MARKETING) {
      return res.status(300).json({status: 300, message: 'Tidak Memiliki hak akses', location: '/'})
    }

    if (Object.entries(files).length === 0) {
      throw new Error('Pilih foto terlebih dahulu');
    }

    const someBodyIsNull = Object.values(body).some((val) => val === '');
    if (someBodyIsNull) {
      throw new Error('Lengkapi formulir');
    }

    // manage price data
    const { wsPrice: stringWsPrice, ...productForm} = body;
    const wsPrice = JSON.parse(stringWsPrice);
    
    let latestMaxQty = 1;
    wsPrice.forEach((X, idx) => {
      
      Object.entries(X).forEach(([key,val], idx) => {
        if (val === '') {
          throw new Error(`Terdapat inputan kosong pada harga grosir ke ${idx + 1}`);
        }
        X[key] = parseInt(X[key]);
      })

      if (X.minQty >= X.maxQty) {
        throw new Error(`Error harga grosir ke ${idx +1}, maximum quantity harus lebih besar`);
      }
      if (X.minQty <= latestMaxQty) {
        throw new Error(`Periksa kembali minimum quantity harga grosir ke ${idx + 1}`);
      }
      latestMaxQty = X.maxQty;
    });


    // insert image file
    const {filepath, mimetype, size} = files.file;
    if (size > 1024 * 1024) {
      throw new Error('Maksimal file gambar berukuran 1MB');
    }
    const fileName = `products${new Date().getTime()}`;
    const rawData = fs.readFileSync(filepath);
    const { data: { Key }, error: uploadFileError } = await ProductsHelper.uploadImage(rawData, fileName, mimetype);
    if (uploadFileError) {
      throw new Error('Gagal mengupload gambar produk');
    }
    const Product = {
      ...productForm,
      imgUrl: Key.split('/').pop(),
    };

    // insert product
    const { data, error: insertProductError } = await ProductsHelper.addProduct(Product);
    if (insertProductError) {
      throw new Error('Gagal menambahkan produk ke tabel database');
    }

    // insert wspirce
    if (wsPrice.length > 0) {
      const productId = data[0]?.id;
      wsPrice.forEach((X) => {
        X.productId = productId;
      });
      const { error: insertWsPriceError } = await ProductsHelper.addProductWsPrice(wsPrice);
      if (insertWsPriceError) {
        throw new Error('Gagal menambahkan harga grosir ke tabel database');
      }
    }

    res.status(201).json({status: 201, message: 'Berhasil menambahkan data produk'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
})

handler.put(async (req, res) => {
  try {
    const { files, body, query } = req;

    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }
    
    const role = User?.role?.roleName;
    if (role !== ROLE_NAME.MARKETING) {
      return res.status(300).json({status: 300, message: 'Tidak Memiliki hak akses', location: '/'})
    }

    const isImageEdited = Object.entries(files).length !== 0;
    if (!isImageEdited) {
      delete body['file'];
    }

    const someBodyIsNull = Object.values(body).some((val) => val === '');
    if (someBodyIsNull) {
      throw new Error('Lengkapi formulir');
    }

    // manage price data
    const { wsPrice: stringWsPrice, ...productForm} = body;
    const wsPrice = JSON.parse(stringWsPrice);
    
    let latestMaxQty = 1;
    wsPrice.forEach((X, idx) => {
      
      Object.entries(X).forEach(([key,val], idx) => {
        if (val === '') {
          throw new Error(`Terdapat inputan kosong pada harga grosir ke ${idx + 1}`);
        }
        X[key] = parseInt(X[key]);
      })

      if (X.minQty >= X.maxQty) {
        throw new Error(`Error harga grosir ke ${idx +1}, maximum quantity harus lebih besar`);
      }
      if (X.minQty <= latestMaxQty) {
        throw new Error(`Periksa kembali minimum quantity harga grosir ke ${idx + 1}`);
      }
      latestMaxQty = X.maxQty;
    });

    // manage product
    const Product = {
      ...productForm,
    };

    const { productId, productImgUrl } = query;
    if (isImageEdited) {
      const {filepath, mimetype, size} = files.file;
      if (size > 1024 * 1024) {
        throw new Error('Maksimal file gambar berukuran 1MB');
      }
      // update image = 1) delete image, 2) upload image
      if (productImgUrl === '') {
        throw new Error('[SERVER] productImgUrl undefined');
      }
  
      const { error: deleteImageError } = await ProductsHelper.deleteImage(productImgUrl);
      if (deleteImageError) {
        throw new Error('Gagal mengubah data [DELETE IMAGE ERROR]');
      }

      const fileName = `products${new Date().getTime()}`;
      const rawData = fs.readFileSync(filepath);
      const { data: {Key}, error: uploadImageError } = await ProductsHelper.uploadImage(rawData, fileName, mimetype);
      if (uploadImageError) {
        throw new Error('Gagal mengupload gambar produk');
      }

      Product.imgUrl = Key.split('/').pop();
    }

    const { error: updateProductError } = await ProductsHelper.updateProduct(productId, Product);
    if (updateProductError) {
      throw new Error('Gagal mengubah data produk ke tabel database');
    }

    // update wspirce
    if (wsPrice.length > 0) {
      wsPrice.forEach((X) => {
        X.productId = productId;
      });
      const { error: deleteProductWsPrice } = await ProductsHelper.deleteProductWsPrice(productId);
      if (deleteProductWsPrice) {
        throw new Error('Gagal mengubah harga grosir ke tabel database');
      }
      const { error: insertWsPriceError } = await ProductsHelper.addProductWsPrice(wsPrice);
      if (insertWsPriceError) {
        throw new Error('Gagal mengubah harga grosir ke tabel database');
      }
    }

    res.status(200).json({status: 200, message: 'Berhasil mengubah data produk'});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
})


handler.patch(async (req, res) => {
  try {
    const { User } = await authMiddleware(req, res);

    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }

    const userRole = User.role.roleName;

    const body = req.body;
    if (body.stock) {
      // edit stock
      if (userRole !== ROLE_NAME.PRODUCTION) {
        throw new Error('Tidak memiliki hak akses');
      }

      if (!body.productId) {
         throw new Error('undefined productId');
      }

      const { error } = await ProductsHelper.updateProduct(body.productId, { stock: body.stock });
      if (error) {
        throw new Error('Gagal mengubah data stok')
      }

      return res.status(200).json({status: 200, message: 'Berhasil mengubah data stok produk'})
    }

    throw new Error('Tidak ada data yang diperbarui');
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
