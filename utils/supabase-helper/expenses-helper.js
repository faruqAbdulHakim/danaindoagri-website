import supabase from '../supabase';
import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;

const ExpensesHelper = {
  async readAll() {
    return await supabase.from(TABLE_NAME.EXPENSES).select('*');
  },

  async add({ name, date, qty, cost }) {
    return await supabase
      .from(TABLE_NAME.EXPENSES)
      .insert([{ name, date, qty, cost }])
      .single();
  },
};

export default ExpensesHelper;
