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
    .limit(limit);
  
    return { data, error}
  },

  getRoleIdByRoleName: async (roleName) => {
    const { data, error } = await supabase.from(TABLE_NAME.ROLE)
      .select('id')
      .eq('roleName', roleName)
      .single();

    return { data: data.id, error };
  },

  addUser: async (form) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .insert([form])
    
    return { data, error };
  }
}

export default UsersHelper;
