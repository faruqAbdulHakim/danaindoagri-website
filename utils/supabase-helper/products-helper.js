import supabase from '../supabase';
import CONFIG from '@/global/config';

const { TABLE_NAME, BUCKETS } = CONFIG.SUPABASE;

const ProductsHelper = {
  getAllProducts: async () => {
    const { data, error } = await supabase.from(TABLE_NAME.PRODUCTS)
      .select('*');
      
    return { data, error };
  },

  
  getProductById: async(productId) => {
    const { data, error } = await supabase.from(TABLE_NAME.PRODUCTS)
      .select('*')
      .eq('id', productId)
      .single();
    
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


  deleteImage: async (productImgUrl) => {
    const { data, error } = await supabase.storage
      .from(BUCKETS.PRODUCTS.BUCKETS_NAME)
      .remove([productImgUrl]);
    
    return { data, error };
  },


  addProduct: async (Product) => {
    const { data, error } = await supabase.from(TABLE_NAME.PRODUCTS)
      .insert([Product]);

    return { data, error };
  },


  addProductWsPrice: async (wsPrice) => {
    const { data, error }= await supabase.from(TABLE_NAME.PRODUCTS_PRICE)
      .insert(wsPrice);

    return { data, error };
  },

  
  updateProduct: async(productId, Product) => {
    const { data, error } = await supabase.from(TABLE_NAME.PRODUCTS)
      .update(Product)
      .match({ id: productId });
    
    return { data, error };
  }
}

export default ProductsHelper;
