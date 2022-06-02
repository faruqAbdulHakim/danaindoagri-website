import CommonModal from '@/components/common/common-modal';

export default function ExpenseForm({ action, setForm }) {
  return (
    <CommonModal>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-center">
          {action === 'add' ? 'Tambah' : 'Ubah'} data pengeluaran
        </h2>
        <form className="mt-8">
          <div className="flex items-center gap-8 mb-3">
            <p className="w-44 text-slate-600">Nama Pengeluaran</p>
            <input
              type="text"
              placeholder="Nama Pengeluaran"
              className="outline-none border border-slate-400 px-3 py-1 rounded-md 
              hover:shadow-md focus:shadow-md focus:bg-slate-100 min-w-0 flex-1"
              required
            />
          </div>
          <div className="flex items-center gap-8 mb-3">
            <p className="w-44 text-slate-600">Tanggal Pengeluaran</p>
            <input
              type="date"
              className="outline-none border border-slate-400 px-3 py-1 rounded-md 
              hover:shadow-md focus:shadow-md focus:bg-slate-100 min-w-0 flex-1"
              required
            />
          </div>
          <div className="flex items-center gap-8 mb-3">
            <p className="w-44 text-slate-600">Jumlah Pengeluaran</p>
            <input
              type="number"
              placeholder="Jumlah Pengeluaran"
              min={1}
              className="outline-none border border-slate-400 px-3 py-1 rounded-md 
              hover:shadow-md focus:shadow-md focus:bg-slate-100 min-w-0 flex-1"
              required
            />
          </div>
          <div className="flex items-center gap-8 mb-3">
            <p className="w-44 text-slate-600">Total Harga</p>
            <input
              type="number"
              placeholder="Total Harga"
              min={1}
              className="outline-none border border-slate-400 px-3 py-1 rounded-md 
              hover:shadow-md focus:shadow-md focus:bg-slate-100 min-w-0 flex-1"
              required
            />
          </div>
          <div className="flex justify-evenly mt-8">
            <button
              type="button"
              className="hover:underline px-4 py-2 rounded-md 
              hover:opacity-70 active:opacity-40 transition-all"
              onClick={() => setForm(null)}
            >
              Batal
            </button>
            <button
              type="button"
              className="bg-primary px-4 py-2 text-white rounded-md
              hover:opacity-70 active:opacity-40 transition-all"
            >
              {action === 'add' ? 'Tambah' : 'Ubah'}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  );
}
