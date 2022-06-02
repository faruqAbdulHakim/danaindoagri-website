import Link from 'next/link';

export default function ExpenseItem({ expense, setForm }) {
  return (
    <div className="border p-4 shadow-md rounded-md mb-3 bg-white/50 flex items-center justify-between">
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Nama Pengeluaran</p>
        <p>{expense.name}</p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Tanggal</p>
        <p>{expense.date}</p>
      </div>
      <div className="w-28 overflow-clip">
        <p className="text-xs text-slate-600">Jumlah</p>
        <p>{expense.qty}</p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Total</p>
        <p className="text-red-600">Rp {expense.cost}</p>
      </div>
      <div className="w-40 overflow-clip flex items-center justify-between">
        <Link href={`/org/expenses/${expense.id}`}>
          <a
            className="rounded-full hover:text-primary
            hover:opacity-70 active:opacity-40 transition-all"
          >
            Detail
          </a>
        </Link>
        <button
          className="px-4 py-2 rounded-full bg-primary text-white 
          hover:opacity-70 active:opacity-40 transition-all"
          onClick={() => setForm({ action: 'edit', id: expense.id })}
        >
          Ubah
        </button>
      </div>
    </div>
  );
}
