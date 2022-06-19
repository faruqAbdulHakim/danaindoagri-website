import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import ExpensesHelper from '@/utils/supabase-helper/expenses-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default async function handler(req, res) {
  try {
    const { User } = await authMiddleware(req, res);
    if (!User) {
      return res
        .status(300)
        .json({ status: 300, message: 'JWT ERROR', location: '/login' });
    }

    const userRole = User.role.roleName;
    switch (req.method) {
      case 'GET':
        if (userRole === ROLE_NAME.CUSTOMERS) {
          throw new Error('Tidak memiliki hak akses');
        }
        return await getAllExpenses(res);
      case 'POST':
        if (userRole !== ROLE_NAME.MARKETING) {
          throw new Error('Tidak memiliki hak akses');
        }
        if (req.headers['content-type'] !== 'application/json') {
          throw new Error('Invalid Content-Type');
        }
        return await addExpense(req, res);
      case 'PUT':
        if (userRole !== ROLE_NAME.MARKETING) {
          throw new Error('Tidak memiliki hak akses');
        }
        if (req.headers['content-type'] !== 'application/json') {
          throw new Error('Invalid Content-Type');
        }
        return await editExpense(req, res);
      default:
        throw new Error('Invalid Method');
    }
  } catch (e) {
    res.status(400).json({ status: 400, message: e.message });
  }
}

async function getAllExpenses(res) {
  const { data, error } = await ExpensesHelper.readAll();
  if (error) {
    throw new Error('Gagal mendapatkan data pengeluaran');
  }
  return res.status(200).json({
    status: 200,
    message: 'Berhasil mendapatkan data pengeluaran',
    data,
  });
}

async function addExpense(req, res) {
  const { name, date, qty, cost } = req.body;
  if ([name, date, qty, cost].some((val) => val === '' || val === undefined)) {
    throw new Error('Lengkapi Formulir');
  }
  const { error } = await ExpensesHelper.add({ name, date, qty, cost });
  if (error) {
    throw new Error('Gagal menambahkan data pengeluaran');
  }
  return res
    .status(200)
    .json({ status: 200, message: 'Berhasil menambahkan data pengeluaran' });
}

async function editExpense(req, res) {
  const { id, name, date, qty, cost } = req.body;

  const someNull = [id, name, date, qty, cost].some((val) => {
    return val === '' || val === undefined;
  });

  if (someNull) {
    throw new Error('Lengkapi Formulir');
  }
  const { error } = await ExpensesHelper.edit({ id, name, date, qty, cost });
  if (error) {
    throw new Error('Gagal mengubah data pengeluaran');
  }
  return res
    .status(200)
    .json({ status: 200, message: 'Berhasil mengubah data pengeluaran' });
}
