export default function FormatSelect({ format, setFormat }) {
  return (
    <div className="flex gap-4 mt-2 mb-3">
      <button
        type="button"
        className={`px-4 py-2 rounded-md transition-all
      ${
        format.format === 'daily'
          ? 'bg-slate-600 text-white'
          : 'text-slate-400 hover:text-slate-600'
      }`}
        onClick={() =>
          setFormat({
            format: 'daily',
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          })
        }
      >
        Harian
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded-md transition-all
      ${
        format.format === 'monthly'
          ? 'bg-slate-600 text-white'
          : 'text-slate-400 hover:text-slate-600'
      }`}
        onClick={() =>
          setFormat({
            format: 'monthly',
            year: new Date().getFullYear(),
          })
        }
      >
        Bulanan
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded-md transition-all
      ${
        format.format === 'yearly'
          ? 'bg-slate-600 text-white'
          : 'text-slate-400 hover:text-slate-600'
      }`}
        onClick={() =>
          setFormat({
            format: 'yearly',
          })
        }
      >
        Tahunan
      </button>
    </div>
  );
}
