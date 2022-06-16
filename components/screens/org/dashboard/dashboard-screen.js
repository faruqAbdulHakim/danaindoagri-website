import CommonErrorModal from '@/components/common/common-error-modal';
import { useState } from 'react';

import FinanceStats from './finance-stats';
import FormatSelect from './format-select';
import LastRegisteredUser from './last-registered-user';
import OrderStats from './order-stats';
import OrderSummary from './order-summary';
import ProfitSummary from './profit-summary';

export default function DashbaordScreen() {
  const [error, setError] = useState('');
  const [format, setFormat] = useState({
    format: 'monthly',
    year: new Date().getFullYear(),
  });

  return (
    <div className="h-full bg-white/80 backdrop-blur-md p-6">
      <div className="flex items-center gap-8 justify-between">
        <h1 className="text-lg font-semibold mb-4">Dashboard</h1>
        <FormatSelect format={format} setFormat={setFormat} />
      </div>
      <div className="h-[calc(100vh-200px)] overflow-scroll p-4">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-3">
            <OrderSummary setError={setError} />
          </div>
          <div className="col-span-3 rounded-lg shadow-md bg-white/70">
            <ProfitSummary setError={setError} />
          </div>
          <div className="min-h-[300px] rounded-lg shadow-md bg-white/70 col-span-2">
            <OrderStats format={format} setError={setError} />
          </div>
          <div className="min-h-[300px] rounded-lg shadow-md bg-white/70">
            <LastRegisteredUser setError={setError} />
          </div>
          <div className="min-h-[400px] rounded-lg shadow-md bg-white/70 col-span-3">
            <FinanceStats setError={setError} format={format} />
          </div>
        </div>
      </div>
      {error && <CommonErrorModal onClick={() => setError('')} text={error} />}
    </div>
  );
}
