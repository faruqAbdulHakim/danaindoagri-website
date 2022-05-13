import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME, BUCKETS } = CONFIG.SUPABASE;

const UsersHelper = {
  getUserById: async (userId, includeDeleted) => {
    if (includeDeleted) {
      const { data, error } = await supabase.from(TABLE_NAME.USERS)
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error }
    }
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .select(`
        *, 
        ${TABLE_NAME.ROLE}
          (*), 
        ${TABLE_NAME.CITIES}
          (
            *, 
            ${TABLE_NAME.CITIY_TYPE} 
              (*),
            ${TABLE_NAME.PROVINCES}
              (*)
          )
      `)
      .eq('id', userId)
      .eq('deleted', false)
      .single();
    return { data, error }
  },

  getUserByRole: async (roleName, searchQuery, limit) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
    .select(`*, ${TABLE_NAME.ROLE}!inner(roleName)`)
    .eq(`${TABLE_NAME.ROLE}.roleName`, roleName)
    .eq('deleted', false)
    .ilike('fullName', `%${searchQuery}%`)
    .limit(limit);
  
    return { data, error };
  },

  
  getUserByEmail: async (email) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
    .select(`
      *, 
      ${TABLE_NAME.ROLE}
        (*), 
      ${TABLE_NAME.CITIES}
        (
          *, 
          ${TABLE_NAME.CITIY_TYPE} 
            (*),
          ${TABLE_NAME.PROVINCES}
            (*)
        )
    `)
    .eq('email', email)
    .single();
    return { data, error };
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
  },


  updateUserOneField: async (name, value, userId) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .update({[name]: value})
      .match({id: userId});
      
    return { data, error };
  },


  updateUserById: async (form, userId) => {
    const { data, error } = await supabase.from(TABLE_NAME.USERS)
      .update(form)
      .match({ id: userId });

    return { data, error };
  },

  updateUserAvatar: async (filename, filetype, file) => {
    const { data, error } = await supabase.storage
      .from(BUCKETS.AVATARS.BUCKETS_NAME)
      .upload(filename, file, {
        upsert: true,
        contentType: filetype,
      });

    return { data, error };
  },
}

export default UsersHelper;
