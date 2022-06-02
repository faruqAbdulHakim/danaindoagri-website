import Router from 'next/router';
import { useState } from 'react';

import CommonModal from '@/components/common/common-modal';
import DateHelper from '@/utils/functions/date-helper';
import ExpensesFetcher from '@/utils/functions/expenses-fetcher';

export default function ExpenseForm({
  action,
  expense,
  setForm,
  setSuccess,
  setError,
}) {
  const [formValues, setFormValues] = useState({
    name: action === 'edit' ? expense.name : '',
    date: action === 'edit' ? expense.date : DateHelper.getTodayDate(),
    qty: action === 'edit' ? expense.qty : null,
    cost: action === 'edit' ? expense.cost : null,
  });
  const [fetching, setFetching] = useState(false);

  const inputHandler = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setFetching(true);
    switch (action) {
      case 'add':
        ExpensesFetcher.postNewExpense(formValues)
          .then(({ data, error, route }) => {
            if (data) setSuccess(data);
            else if (error) setError(error);
            else if (route) Router.push(route);
          })
          .catch((e) => setError(e.message))
          .finally(() => setFetching(false));
        break;
      case 'edit':
        ExpensesFetcher.putExpense({ ...formValues, id: expense.id })
          .then(({ data, error, route }) => {
            if (data) setSuccess(data);
            else if (error) setError(error);
            else if (route) Router.push(route);
          })
          .catch((e) => setError(e.message))
          .finally(() => setFetching(false));
        break;
      default:
        break;
    }
  };

  return (
    <CommonModal>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-center">
          {action === 'add' ? 'Tambah' : 'Ubah'} data pengeluaran
        </h2>
        <form onSubmit={submitHandler} className="mt-8">
          <div className="flex items-center gap-8 mb-3">
            <p className="w-44 text-slate-600">Nama Pengeluaran</p>
            <input
              type="text"
              placeholder="Nama Pengeluaran"
              name="name"
              value={formValues.name}
              onChange={inputHandler}
              className="outline-none border border-slate-400 px-3 py-1 rounded-md 
              hover:shadow-md focus:shadow-md focus:bg-slate-100 min-w-0 flex-1"
              required
            />
          </div>
          <div className="flex items-center gap-8 mb-3">
            <p className="w-44 text-slate-600">Tanggal Pengeluaran</p>
            <input
              type="date"
              name="date"
              value={formValues.date}
              onChange={inputHandler}
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
              name="qty"
              value={formValues.qty}
              onChange={inputHandler}
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
              name="cost"
              value={formValues.cost}
              onChange={inputHandler}
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
              disabled={fetching}
              onClick={() => setForm(null)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-primary px-4 py-2 text-white rounded-md disabled:bg-slate-800
              hover:opacity-70 active:opacity-40 transition-all"
              disabled={fetching}
            >
              {action === 'add' ? 'Tambah' : 'Ubah'}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  );
}
