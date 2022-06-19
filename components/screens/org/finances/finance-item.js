import DateHelper from '@/utils/functions/date-helper';

export default function FinanceItem({ date, expense, revenue, format }) {
  const profit = (revenue || 0) - (expense || 0);
  return (
    <div className="border p-4 shadow-md rounded-md mb-3 bg-white/50 flex items-center justify-between">
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">
          {format.format === 'daily'
            ? 'Tanggal'
            : format.format === 'monthly'
            ? 'Bulan'
            : 'Tahun'}
        </p>
        <p>
          {format.format === 'monthly' ? DateHelper.monthString(date) : date}
        </p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Pengeluaran</p>
        <p className="text-red-600">Rp {expense || 0}</p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">Pendapatan</p>
        <p className="text-primary">Rp {revenue || 0}</p>
      </div>
      <div className="w-40 overflow-clip">
        <p className="text-xs text-slate-600">
          {profit >= 0 ? 'Keuntungan' : 'Kerugian'}
        </p>
        <p className={`${profit >= 0 ? 'text-primary' : 'text-red-600'}`}>
          Rp {profit}
        </p>
      </div>
    </div>
  );
}
