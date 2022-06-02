import Router from 'next/router';
import { useState, useEffect } from 'react';

import ExpensesList from './expenses-list';
import ExpenseForm from './expense-form.js';
import ExpensesFetcher from '@/utils/functions/expenses-fetcher';
import CommonErrorModal from '@/components/common/common-error-modal';
import CommonSuccessModal from '@/components/common/common-success-modal';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function ExpensesScreen({ userRole }) {
  const [expenses, setExpenses] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFetching(true);
    ExpensesFetcher.fetchAllExpenses()
      .then(({ data, error, route }) => {
        if (data) setExpenses(data);
        else if (error) setError(error);
        else if (route) Router.push(route);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, []);

  return (
    <>
      <div className="p-6 bg-white/80 backdrop-blur-md">
        <h1 className="text-lg font-semibold">Data Pengeluaran</h1>
        <div className="mt-4">
          <ExpensesList
            expenses={expenses}
            fetching={fetching}
            userRole={userRole}
            setForm={setForm}
          />
        </div>
        {userRole === ROLE_NAME.MARKETING && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white hover:opacity-70 active:opacity-40 transition-all
              rounded-md"
              onClick={() => setForm({ action: 'add' })}
            >
              Tambah
            </button>
          </div>
        )}
      </div>
      {form && (
        <ExpenseForm
          {...form}
          setForm={setForm}
          setSuccess={setSuccess}
          setError={setError}
        ></ExpenseForm>
      )}
      {success && (
        <CommonSuccessModal text={success} onClick={() => Router.reload()} />
      )}
      {error && (
        <CommonErrorModal text={error} onClick={() => Router.reload()} />
      )}
    </>
  );
}
