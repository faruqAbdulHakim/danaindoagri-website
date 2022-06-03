export default function FinancesList({ setShow, finances }) {
  return (
    <div>
      <div className="h-[calc(100vh-280px)] border shadow-md rounded-md overflow-y-auto p-4">
        {JSON.stringify(finances)}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white hover:opacity-70 active:opacity-40 transition-all
              rounded-md"
          onClick={() => setShow('graph')}
        >
          Lihat Grafik
        </button>
      </div>
    </div>
  );
}
