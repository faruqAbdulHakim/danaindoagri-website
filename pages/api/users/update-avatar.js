import fs from 'fs';

import nextConnect from 'next-connect';

import multipartFormParser from '@/utils/middleware/multipart-form-parser';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import AuthHelper from '@/utils/supabase-helper/auth-helper';

const handler = nextConnect();

handler.use(multipartFormParser);

handler.put(async (req, res) => {
  try {
    const { files, query, cookies } = req;

    const {filepath, mimetype, size} = files.file;
    if (size > 1024 * 1024) {
      return res.status(400).json({status: 400, message: 'Maksimal file gambar berukuran 1MB'});
    }

    const { userId } = query;
    const { accessToken, refreshToken } = cookies;
    const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
    if (getUserError) {
      res.setHeader('set-cookie', [
        `accessToken=delete; Path=/; Max-Age=0`,
        `refreshToken=delete; Path=/; Max-Age=0`
      ]);
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'})
    }

    if (User.id !== parseInt(userId)) {
      return res.status(400).json({status: 400, message: 'user id tidak cocok'})
    }

    const fileName = `avatar${userId}`;
    const rawData = fs.readFileSync(filepath);
    const { error } = await UsersHelper.updateUserAvatar(fileName, mimetype, rawData)

    if (error) {
      return res.status(400).json({status: 400, message: 'Gagal mengupload gambar ke database'});
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
