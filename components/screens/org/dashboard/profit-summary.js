import Router from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import ExpensesFetcher from '@/utils/functions/expenses-fetcher';
import RevenueFetcher from '@/utils/functions/revenue-fetcher';
import FinancesFormat from '@/utils/functions/finances-format';
import DateHelper from '@/utils/functions/date-helper';

export default function ProfitSummary({ setError }) {
  const [fetching, setFetching] = useState(false);
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    setFetching(true);
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

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

        const l = [];
        console.log(
          FinancesFormat.getFinances(expenses, revenues, {
            format: 'daily',
            month,
            year,
          }),
          DateHelper.getTodayDate()
        );
        l.push(
          FinancesFormat.getFinances(expenses, revenues, {
            format: 'daily',
            month,
            year,
          }).filter((X) => X.date == DateHelper.getTodayDate())[0]
        );
        l.push(
          FinancesFormat.getFinances(expenses, revenues, {
            format: 'monthly',
            year,
          }).filter((X) => X.date == month)[0]
        );
        l.push(
          FinancesFormat.getFinances(expenses, revenues, {
            format: 'yearly',
          }).filter((X) => X.date == year)[0]
        );
        setFinances(l);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [setError]);

  return (
    <div className="p-3">
      {fetching ? (
        <p className="text-primary animate-bounce">Loading...</p>
      ) : (
        <div className="flex gap-8 justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#4791FF]/20 p-3 rounded-md">
              <div className="relative aspect-square w-6">
                <Image
                  src="/assets/images/calendar_365.svg"
                  alt="calendar 365"
                  layout="fill"
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">
                Rp {finances[2]?.revenue || 0 - finances[2]?.expense || 0}
              </p>
              <h2 className="text-slate-400 text-sm">Pendapatan tahun ini</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#FFD950]/20 p-3 rounded-md">
              <div className="relative aspect-square w-6">
                <Image
                  src="/assets/images/calendar_31.svg"
                  alt="calendar 31"
                  layout="fill"
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">
                Rp {finances[1]?.revenue || 0 - finances[1]?.expense || 0}
              </p>
              <h2 className="text-slate-400 text-sm">Pendapatan bulan ini</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#FF2366]/20 p-3 rounded-md">
              <div className="relative aspect-square w-6">
                <Image
                  src="/assets/images/calendar_check.svg"
                  alt="calendar check"
                  layout="fill"
                />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">
                Rp {finances[0]?.revenue || 0 - finances[0]?.expense || 0}
              </p>
              <h2 className="text-slate-400 text-sm">Pendapatan hari ini</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
