import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;

const UsersHelper = {
  getUserByRole: async (roleName, searchQuery, limit) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
    .select(`*, ${TABLE_NAME.ROLE}!inner(roleName)`)
    .eq(`${TABLE_NAME.ROLE}.roleName`, roleName)
    .eq('deleted', false)
    .ilike('fullName', `%${searchQuery}%`)
    .limit(limit)
  
    return { data, error}
  },
}

export default UsersHelper;
