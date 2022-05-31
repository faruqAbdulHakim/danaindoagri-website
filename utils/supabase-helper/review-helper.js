import supabase from '../supabase';
import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;

const ReviewHelper = {
  async addReview(
    userId,
    productId,
    onlineOrderId,
    rating,
    review
  ) {
    const { data, error } = await supabase.from(TABLE_NAME.REVIEW)
      .insert([
        {
          userId,
          productId,
          onlineOrderId,
          rating,
          review
        }
      ])
      .single();
    return { data, error };
  },

  async getReviewByOrderId(onlineOrderId) {
    const { data, error } = await supabase.from(TABLE_NAME.REVIEW)
      .select('*')
      .eq('onlineOrderId', onlineOrderId)
      .single();
    return { data, error };
  },

  async getReviewsByProductId(productId) {
    const { data, error } = await supabase.from(TABLE_NAME.REVIEW)
      .select(`
        *,
        ${TABLE_NAME.USERS}:userId (*)
      `)
      .eq('productId', productId)
    return { data, error }
  }
}

export default ReviewHelper
