import fs from 'fs';

import nextConnect from 'next-connect';

import multipartFormParser from '@/utils/middleware/multipart-form-parser';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import AuthHelper from '@/utils/supabase-helper/auth-helper';
import authMiddleware from '@/utils/middleware/auth-middleware';

const handler = nextConnect();

handler.use(multipartFormParser);

handler.put(async (req, res) => {
  try {
    const { files, query } = req;

    const {filepath, mimetype, size} = files.file;
    if (size > 1024 * 1024) {
      throw new Error('Maksimal file gambar berukuran 1MB');
    }

    const { userId } = query;
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    if (User.id !== parseInt(userId)) {
      throw new Error('user id tidak cocok');
    }

    const fileName = `avatar${userId}`;
    const rawData = fs.readFileSync(filepath);
    const { error } = await UsersHelper.updateUserAvatar(fileName, mimetype, rawData)

    if (error) {
      throw new Error('Gagal mengupload gambar ke database');
    }

    res.status(200).json({status: 200, message: 'Berhasil mengubah avatar'});
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
