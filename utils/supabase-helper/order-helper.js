import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME, BUCKETS } = CONFIG.SUPABASE;
const { PROOF_OF_PAYMENT } = BUCKETS;

const OrderHelper = {
  CustomerCreateOrder: async (body) => {
    const orderDetail = {
      productId: body.productId,
      qty: body.qty,
      address: body.address,
      cityId: body.cityId,
      expedition: body.expedition,
      status: body.status,
      shipmentPrice: body.shipmentPrice,
      productPrice: body.productPrice,
      codePrice: body.codePrice,
    }
    const { 
      data: orderDetailData, 
      error: insertOrderDetailError
    } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .insert([orderDetail]);

    if (insertOrderDetailError) {
      return { error: insertOrderDetailError}
    }

    const orderDetailId = orderDetailData[0].id;
    const onlineOrder = {
      userId: body.userId,
      orderDetailId,
    }
    const { 
      data, 
      error 
    } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .insert([onlineOrder]);

    if (error) {
      await supabase
        .from(TABLE_NAME.ORDER_DETAIL)
        .delete()
        .match({ id: orderDetailId })
    }

    return { data, error };
  },

  getCustomerOrders: async (customerId) => {
    const { data, error } = await supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .select(`*, orderdetail (*, ${TABLE_NAME.PRODUCTS} (*))`)
      .eq('userId', customerId);
    return { data, error }
  },

  getCustomerOrderById: async (customerId, orderId) => {
    const { data, error } = await supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .select(`
        *, orderdetail (
          *, 
          ${TABLE_NAME.CITIES} (
            *, 
            ${TABLE_NAME.CITY_TYPE} (*),
            ${TABLE_NAME.PROVINCES} (*)
          ), 
          ${TABLE_NAME.PRODUCTS} (*)
        )`)
      .eq('userId', customerId)
      .eq('id', orderId)
      .single();
    return { data, error };
  }, 


  updateCustomerOrder: async (updatedData, orderId) => {
    const { data, error } = await supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .update(updatedData)
      .match({ id: orderId });
    return { data, error };
  },

  uploadProofOfPayment: async (filename, file, filetype) => {
    const { data, error } = await supabase.storage
      .from(PROOF_OF_PAYMENT.BUCKETS_NAME)
      .upload(filename, file, {
        upsert: true,
        contentType: filetype,
      });
    return { data, error };
  },

  deleteProofOfPayment: async (filename) => {
    let error;
    const { data } = await supabase.storage
      .from(PROOF_OF_PAYMENT.BUCKETS_NAME)
      .remove([filename]);
 
    if (data.length === 0) {
      error = 'Tidak ada file yang dihapus';
    }
    
    return { data, error };
  }
}

export default OrderHelper
