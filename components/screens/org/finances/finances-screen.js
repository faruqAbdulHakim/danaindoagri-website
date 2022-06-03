import Router from 'next/router';
import { useState, useEffect } from 'react';

import FinancesGraph from './finances-graph';
import FinancesList from './finances-list';
import ExpensesFetcher from '@/utils/functions/expenses-fetcher';
import RevenueFetcher from '@/utils/functions/revenue-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import FinancesFormatInput from './finances-format-input';
import DateHelper from '@/utils/functions/date-helper';

export default function FinancesScreen() {
  const [show, setShow] = useState('list');
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [format, setFormat] = useState({
    format: 'daily',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [finances, setFinances] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

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
  }, []);

  useEffect(() => {
    setFinances(getFinances(expenses, revenues, format));
  }, [expenses, revenues, format]);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 h-full">
      <h1 className="text-lg font-semibold">Data Keuangan</h1>
      <div className="mt-4">
        <FinancesFormatInput format={format} setFormat={setFormat} />
      </div>
      <div className="mt-2">
        {fetching ? (
          <p className="text-primary font-semibold animate-bounce">
            Loading...
          </p>
        ) : show === 'list' ? (
          <FinancesList setShow={setShow} finances={finances} format={format} />
        ) : (
          show === 'graph' && <FinancesGraph setShow={setShow} />
        )}
      </div>
      {error && <CommonErrorModal text={error} onClick={() => Router.back()} />}
    </div>
  );
}

function getFinances(expenses, revenues, format) {
  let obj = {};
  switch (format.format) {
    case 'daily':
      expenses.forEach((expense) => {
        const { month, year } = DateHelper.dateSplitter(expense.date);
        if (format.month !== month || format.year !== year) return;
        if (!obj.hasOwnProperty(expense.date)) obj[expense.date] = {};
        obj[expense.date].expense =
          (obj[expense.date].expense || 0) + expense.cost;
      });
      revenues.forEach((revenue) => {
        const { month, year } = DateHelper.dateSplitter(revenue.date);
        if (format.month !== month || format.year !== year) return;
        if (!obj.hasOwnProperty(revenue.date)) obj[revenue.date] = {};
        obj[revenue.date].revenue =
          (obj[revenue.date].revenue || 0) + revenue.revenue;
      });
      break;
    case 'monthly':
      expenses.forEach((expense) => {
        const { month, year } = DateHelper.dateSplitter(expense.date);
        if (format.year !== year) return;
        if (!obj.hasOwnProperty(month)) obj[month] = {};
        obj[month].expense = (obj[month].expense || 0) + expense.cost;
      });
      revenues.forEach((revenue) => {
        const { month, year } = DateHelper.dateSplitter(revenue.date);
        if (format.year !== year) return;
        if (!obj.hasOwnProperty(month)) obj[month] = {};
        obj[month].revenue = (obj[month].revenue || 0) + revenue.revenue;
      });
      break;
    case 'yearly':
      expenses.forEach((expense) => {
        const { year } = DateHelper.dateSplitter(expense.date);
        if (!obj.hasOwnProperty(year)) obj[year] = {};
        obj[year].expense = (obj[year].expense || 0) + expense.cost;
      });
      revenues.forEach((revenue) => {
        const { year } = DateHelper.dateSplitter(revenue.date);
        if (!obj.hasOwnProperty(year)) obj[year] = {};
        obj[year].revenue = (obj[year].revenue || 0) + revenue.revenue;
      });
      break;
  }

  return Object.entries(obj).map(([key, val]) => {
    return { date: key, ...val };
  });
}
