import bcrypt from 'bcrypt';

import CONFIG from '@/global/config';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import AuthHelper from '@/utils/supabase-helper/auth-helper';
import authMiddleware from '@/utils/middleware/auth-middleware';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const { headers, method } = req;
    
    const isSomeFormNull = Object.values(body).some((value) => value === '');

    if (isSomeFormNull) {
      throw new Error('Harap lengkapi formulir');
    }

    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res.status(300).json({status: 300, message: 'JWT ERROR', location: '/login'});
    }

    const role = User?.role?.roleName;
    if (role !== ROLE_NAME.OWNER) {
      return res.status(300).json({status: 300, message: 'Anda tidak memiliki hak akses'});
    }

    if (headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }

    if (method === 'POST') {
      return await AddNewEmployee(req, res);
    } else if (method === 'PUT') {
      return await EditEmployee(req, res);
    } else {
      throw new Error('Invalid Method');
    }
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}

async function AddNewEmployee(req, res) {
  const body = req.body;
  if (body.password.length < 8) {
    throw new Error('Panjang password minimal 8 karakter');
  }

  if (body.password !== body.passwordConfirmation) {
    throw new Error('Konfirmasi password tidak sesuai');
  }
  
  const isRegistered = await AuthHelper.isRegistered(body.email)
  if (isRegistered) {
    throw new Error('Email sudah terdaftar');
  }

  const { data: roleId, error: getRoleError } = await UsersHelper.getRoleIdByRoleName(body?.roleName);
  if (getRoleError) {
    throw new Error('[Server] Gagal menemukan roleId');
  }

  delete body.passwordConfirmation;
  delete body.roleName;
  body.password = bcrypt.hashSync(body.password, 10);
  body.roleId = roleId;
  body.isVerified = true;

  const { error } = await UsersHelper.addUser(body);
  if (error) {
    throw new Error('Gagal menambahkan karyawan');
  }
  return res.status(201).json({status: 201, message: 'Berhasil menambahkan karyawan'});
}

async function EditEmployee(req, res) {
  const { body, query } = req;
  const { editType, employeeId } = query;
  if (editType === 'biodata') {
    const { data: roleId, error: getRoleError } = await UsersHelper.getRoleIdByRoleName(body?.roleName);
    if (getRoleError) {
      throw new Error('[Server] Gagal menemukan roleId');
    }

    delete body.roleName;
    body.roleId = roleId;
  }
  else if (editType === 'password') {
    if (body.password.length < 8) {
      throw new Error('Panjang password minimal 8 karakter');
    }

    if (body.password !== body.passwordConfirmation) {
      throw new Error('Konfirmasi password tidak sesuai');
    }

    delete body.passwordConfirmation;
    body.password = bcrypt.hashSync(body.password, 10)
  }
  const { error } = await UsersHelper.updateUserById(body, employeeId);
  if (error) {
   throw new Error('[SERVER] Gagal mengubah data');
  }
  return res.status(200).json({status: 200, message: 'Berhasil mengubah data karyawan'});
}
