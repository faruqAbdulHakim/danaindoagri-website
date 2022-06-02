import CONFIG from '@/global/config';
import ExpenseItem from './expense-item';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function ExpensesList({
  expenses,
  fetching,
  userRole,
  setForm,
}) {
  return (
    <div
      className={`${
        userRole === ROLE_NAME.MARKETING
          ? 'h-[calc(100vh-240px)]'
          : 'h-[calc(100vh-180px)]'
      } border shadow-md rounded-md overflow-y-auto p-4`}
    >
      {fetching ? (
        <p className="font-semibold animate-bounce text-primary">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-sm text-slate-600">Data Pengeluaran kosong</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseItem
            expense={expense}
            key={expense.id}
            setForm={setForm}
            userRole={userRole}
          />
        ))
      )}
    </div>
  );
}
