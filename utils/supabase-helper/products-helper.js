import supabase from '../supabase';
import CONFIG from '@/global/config';

const { TABLE_NAME, BUCKETS } = CONFIG.SUPABASE;

const ProductsHelper = {
  getAllProducts: async () => {
    const { data, error } = await supabase.from(TABLE_NAME.PRODUCTS)
      .select('*');
      
    return { data, error };
  },


  uploadImage: async (file, filename, filetype) => {
    const { data, error } = await supabase.storage
    .from(BUCKETS.PRODUCTS.BUCKETS_NAME)
    .upload(filename, file, {
      upsert: true,
      contentType: filetype,
    });

    return { data, error };
  },


  addProduct: async (Product) => {
    const { data, error } = await supabase.from(TABLE_NAME.PRODUCTS)
      .insert([Product]);

    return { data, error };
  }
}

export default ProductsHelper;
