import { BsChevronLeft } from 'react-icons/bs';

export default function FinancesGraph({ setShow }) {
  return (
    <div className="h-[calc(100vh-220px)] relative">
      <button
        type="button"
        className="absolute top-1/2 -left-4 -translate-y-[120%] border rounded-full p-2 shadow-md 
        hover:scale-110 hover:bg-slate-50 active:scale-100 transition-all"
        onClick={() => setShow('list')}
      >
        <BsChevronLeft size={20} />
      </button>
    </div>
  );
}
