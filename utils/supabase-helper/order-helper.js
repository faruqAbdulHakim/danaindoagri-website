import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME } = CONFIG.SUPABASE;

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
}

export default OrderHelper
