import CONFIG from '@/global/config';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import AuthHelper from '@/utils/supabase-helper/auth-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  const { headers, body, method, cookies } = req;
  const { accessToken, refreshToken } = cookies;

  if (headers['content-type'] !== 'application/json') {
    return res.status(400).json({status: 400, message: 'Invalid Content-Type'});
  }

  const isSomeFormNull = Object.values(body).some((value) => value === '');

  if (isSomeFormNull) {
    return res.status(400).json({status: 400, message: 'Harap lengkapi formulir pendaftaran'});
  }

  if (body.password.length < 8) {
    return res.status(400).json({status: 400, message: 'Panjang password minimal 8 karakter'});
  }

  if (body.password !== body.passwordConfirmation) {
    return res.status(400).json({status: 400, message: 'Konfirmasi password tidak sesuai'});
  }

  const isRegistered = await AuthHelper.isRegistered(body.email)
  if (isRegistered) {
    return res.status(400).json({status: 400, message: 'Email sudah terdaftar'})
  }

  const { User, error: getUserError } = await AuthHelper.getUser(accessToken, refreshToken);
  if (getUserError) {
    res.setHeader('set-cookie', [
      `accessToken=delete; Path=/; Max-Age=0`,
      `refreshToken=delete; Path=/; Max-Age=0`
    ]);
    return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
  }

  const role = User?.role?.roleName;
  if (role !== ROLE_NAME.OWNER) {
    return res.status(300).json({status: 300, message: 'Anda tidak memiliki hak akses'});
  }

  const { data: roleId, error: getRoleError } = await UsersHelper.getRoleIdByRoleName(body?.roleName);
  if (getRoleError) {
    return res.status(400).json({status: 400, message: '[Server] Gagal menemukan'})
  }

  delete body.passwordConfirmation;
  delete body.roleName;
  body.roleId = roleId;
  body.isVerified = true;

  if (method === 'POST') {
    const { error } = await UsersHelper.addUser(body);
    console.log(body, error)
    if (error) {
      return res.status(400).json({status: 400, message: 'Gagal menambahkan karyawan'});
    }
    return res.status(201).json({status: 201, message: 'Berhasil menambahkan karyawan'});
  }

  // method put: edit employee
  else if (method === 'PUT') {
    console.log('Masuk method PUT')
  }

  res.status(400).json({status: 400, message: 'Invalid Method'});
}