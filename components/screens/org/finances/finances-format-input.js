export default function FinancesFormatInput({ format, setFormat }) {
  return (
    <div>
      <div className="flex gap-4">
        <select
          className="border border-slate-300 p-1 rounded-md"
          value={format.format}
          onChange={(event) => {
            const value = event.target.value;
            switch (value) {
              case 'daily':
                setFormat({
                  format: value,
                  month: new Date().getMonth() + 1,
                  year: new Date().getFullYear(),
                });
                break;
              case 'monthly':
                setFormat({
                  format: value,
                  year: new Date().getFullYear(),
                });
                break;
              case 'yearly':
                setFormat({ format: value });
                break;
            }
          }}
        >
          <option value="daily">Harian</option>
          <option value="monthly">Bulanan</option>
          <option value="yearly">Tahunan</option>
        </select>
        {format.format === 'daily' && (
          <select
            className="border border-slate-300 p-1 rounded-md"
            value={format.month}
            onChange={(event) => {
              setFormat({ ...format, month: parseInt(event.target.value) });
            }}
          >
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        )}
        {['monthly', 'daily'].includes(format.format) && (
          <input
            className="border border-slate-300 px-2 rounded-md"
            type="number"
            name="year"
            min="2000"
            max={new Date().getFullYear()}
            step="1"
            value={format.year}
            onChange={(event) => {
              setFormat({ ...format, year: parseInt(event.target.value) });
            }}
          />
        )}
      </div>
    </div>
  );
}
