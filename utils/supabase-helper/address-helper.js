import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;

const AddressHelper = {
  getAllProvinces: async () => {
    const { data, error } = await supabase.from(TABLE_NAME.PROVINCES)
      .select('*');
    return { data, error };
  },


  getAllCities: async () => {
    const { data, error } = await supabase.from(TABLE_NAME.CITIES)
      .select(`*, ${TABLE_NAME.CITY_TYPE}(*), ${TABLE_NAME.PROVINCES}(*)`);
    return { data, error };
  },

  getCityByProvinceId: async (provinceId) => {
    const { data, error } = await supabase.from(TABLE_NAME.CITIES)
      .select(`*, ${TABLE_NAME.CITY_TYPE}(*), ${TABLE_NAME.PROVINCES}(*)`)
      .eq('provinceId', provinceId)
    return { data, error };
  },
}

export default AddressHelper;
