import CONFIG from '@/global/config';
import supabase from '../supabase';

const { TABLE_NAME } = CONFIG.SUPABASE;

const RevenueHelper = {
  async readAll() {
    return await supabase.from(TABLE_NAME.ORDER_DETAIL)
      .select('*')
      .neq('status', 'belum dibayar');
  },
};

export default RevenueHelper;
