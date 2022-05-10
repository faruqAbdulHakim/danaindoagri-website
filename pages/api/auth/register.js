import AuthHelper from '@/utils/supabase-helper/auth-helper';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    const { method, body: formRegister, headers } = req;

    if (method !== 'POST') {
      throw new Error('Invalid Method');
    }
  
    if (headers['content-type'] !== 'application/json') {
      throw new Error('Invalid Content-Type');
    }
  
    // user input need to register
    const userInputList = [
                            'fullName', 'gender', 'dob', 'address', 'postalCode', 'email', 
                            'password', 'passwordConfirmation', 'tel'
                          ];
    const isSomeFormNull = userInputList.some((userInput) => formRegister[userInput] === '');
  
    if (isSomeFormNull) {
      return res.status(400).json({status: 400, message: 'Harap lengkapi formulir pendaftaran.'});
    }
  
    // check user password length
    if (formRegister.password.length < 8) {
      throw new Error('Panjang password minimal 8 karakter.');
    }
  
    // check user password confirmation
    if (formRegister.password !== formRegister.passwordConfirmation) {
      throw new Error('Konfirmasi password tidak sesuai.');
    }
  
    // check is user email already registered
    const isRegistered = await AuthHelper.isRegistered(formRegister['email'])
    if (isRegistered) {
      throw new Error('Email sudah terdaftar. Silahkan gunakan email lain');
    }
  
    ////////// register
    delete formRegister['passwordConfirmation'];
    formRegister.password = bcrypt.hashSync(formRegister.password, 10);
  
    const { error } = await AuthHelper.userRegister(formRegister);
    if (error) {
      throw new Error('Gagal melakukan registrasi');
    }
  
    // success
    res.status(201).json({status: 201, message: 'User Register Success'})
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
  
}
