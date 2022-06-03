export default function FinanceItem({ finance }) {
  return (
    <div className="border p-4 shadow-md rounded-md mb-3 bg-white/50 flex items-center justify-between">
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Nama Pengeluaran</p>
        <p>{finance.date}</p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Tanggal</p>
        <p>{finance.date}</p>
      </div>
      <div className="w-28 overflow-clip">
        <p className="text-xs text-slate-600">Jumlah</p>
        <p>{expense.qty}</p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Total</p>
        <p className="text-red-600">Rp {expense.cost}</p>
      </div>
    </div>
  );
}
