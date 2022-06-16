import Router from 'next/router';
import { useEffect, useState } from 'react';

import ExpensesFetcher from '@/utils/functions/expenses-fetcher';
import RevenueFetcher from '@/utils/functions/revenue-fetcher';
import FinancesFormat from '@/utils/functions/finances-format';
import ProfitChart from '../finances/profit-chart';

export default function FinanceStats({ setError, format }) {
  const [fetching, setFetching] = useState(false);
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    setFetching(true);
    const promises = Promise.all([
      ExpensesFetcher.fetchAllExpenses(),
      RevenueFetcher.fetchAll(),
    ]);
    promises
      .then(([a, b]) => {
        if (a.error) throw new Error(a.error);
        if (b.error) throw new Error(b.error);
        if (a.route) Router.push(a.route);
        if (b.route) Router.push(b.route);

        const expenses = a.data.map((expense) => {
          return { id: expense.id, date: expense.date, cost: expense.cost };
        });
        const revenues = b.data.map((revenue) => {
          const sum =
            revenue.productPrice + revenue.shipmentPrice + revenue.codePrice;
          let date = new Date(revenue.createdAt)
            .toLocaleString('en-US', {
              timeZone: 'Asia/Jakarta',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .split('/');
          date = `${date[2]}-${date[0]}-${date[1]}`;
          return { id: revenue.id, date, revenue: sum };
        });

        setExpenses(expenses);
        setRevenues(revenues);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [setError]);

  useEffect(() => {
    setFinances(FinancesFormat.getFinances(expenses, revenues, format));
  }, [expenses, revenues, format]);
  return (
    <div className="p-6 h-full flex flex-col">
      <div>
        <h2 className="font-semibold text-lg mb-2">Statistik Keuangan</h2>
        <hr />
      </div>
      <div className="flex-1 mt-4">
        {fetching ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-primary animate-bounce">Loading</p>
          </div>
        ) : (
          <ProfitChart finances={finances} format={format} />
        )}
      </div>
    </div>
  );
}
