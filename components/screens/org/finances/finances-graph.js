import { BsChevronLeft } from 'react-icons/bs';
import ProfitChart from './profit-chart';
import FinancesChart from './finances-chart';
import DateHelper from '@/utils/functions/date-helper';

export default function FinancesGraph({ setShow, finances, format }) {
  return (
    <div className="relative mt-10">
      <button
        type="button"
        className="absolute top-1/2 -left-8 bg-white -translate-y-[120%] border rounded-full p-2 shadow-md 
        hover:scale-110 hover:bg-slate-50 active:scale-100 transition-all"
        onClick={() => setShow('list')}
      >
        <BsChevronLeft size={20} />
      </button>
      <div className="h-[calc(100vh-260px)] ml-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-8">
          <div className="h-72">
            <h2 className="font-semibold text-lg mb-2">
              {format.format === 'daily'
                ? `Pendapatan ${DateHelper.monthString(format.month)} ${
                    format.year
                  }`
                : format.format === 'monthly'
                ? `Pendapatan Tahun ${format.year}`
                : 'Pendapatan Tahunan'}
            </h2>
            <ProfitChart finances={finances} format={format} />
          </div>
          <div className="h-72">
            <FinancesChart finances={finances} format={format} />
          </div>
        </div>
      </div>
    </div>
  );
}
