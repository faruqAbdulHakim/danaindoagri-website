import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME, BUCKETS } = CONFIG.SUPABASE;
const { PROOF_OF_PAYMENT } = BUCKETS;
const { DEFAULT_ORIGIN } = CONFIG.RAJAONGKIR;

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
      etd: body.etd,
    }
    const { 
      data: orderDetailData, 
      error: insertOrderDetailError
    } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .insert([orderDetail]);

    if (insertOrderDetailError || orderDetailData.length === 0) {
      return { error: 'Gagal menambahkan data detail order'}
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

  createOfflineOrder: async (body) => {
    const { productId, productPrice, qty } = body;
    const orderDetail = {
      productId,
      qty,
      address: 'Bayar ditempat',
      cityId: DEFAULT_ORIGIN,
      expedition: 'Pemesanan secara offline',
      status: 'diterima',
      shipmentPrice: 0,
      productPrice,
      codePrice: 0,
      etd: '0',
    };
    const { data: orderDetailData, error: orderDetailErr } = await supabase.from(TABLE_NAME.ORDER_DETAIL)
      .insert([orderDetail])
    if (orderDetailErr || orderDetailData.length === 0) {
      return { error: 'Gagal menambahkan data'}
    }
    
    const orderDetailId = orderDetailData[0].id;
    const { data, error } = await supabase.from(TABLE_NAME.OFFLINE_ORDERS)
      .insert([{orderDetailId}])
    if (data.length === 0) {
      await supabase.from(TABLE_NAME.ORDER_DETAIL)
        .delete()
        .match({id: orderDetailId})
      return { error: 'Gagal menambahkan data'}
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

  getOnlineOrder: async (page, searchText) => {
    const { data: userList } = await supabase.from(TABLE_NAME.USERS)
      .select('id, fullName')
      .ilike('fullName', `%${searchText}%`)
    
    const idList = userList.map((User) => User.id);

    const totalDataEachPage = 5;
    const begin = (page-1)*totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const { data, error } = await supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .select(`
      *, 
      ${TABLE_NAME.ORDER_DETAIL} (
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      ),
      ${TABLE_NAME.USERS} (*)
      `)
      .in('userId', idList)
      .order(
        `id`, { ascending: false }
      )
      .range(begin, end)
    return { data, error }
  },

  getOfflineOrder: async (page) => {    
    const totalDataEachPage = 5;
    const begin = (page-1)*totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const { data, error } = await supabase.from(TABLE_NAME.OFFLINE_ORDERS)
      .select(`
      *, 
      ${TABLE_NAME.ORDER_DETAIL} (
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      )
      `)
      .order(
        `id`, { ascending: false }
      )
      .range(begin, end)

    return { data, error }
  },

  getUnconfirmedOrder: async (page, searchText, proofAvailability) => {
    const { data: userList } = await supabase.from(TABLE_NAME.USERS)
      .select('id, fullName')
      .ilike('fullName', `%${searchText}%`)

    const idList = userList.map((User) => User.id);

    const totalDataEachPage = 5;
    const begin = (page-1)*totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const query = supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .select(`
      *, 
      ${TABLE_NAME.ORDER_DETAIL}!inner(
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      ),
      ${TABLE_NAME.USERS} (*)
      `)
      .eq(`${TABLE_NAME.ORDER_DETAIL}.status`, 'belum dibayar')
      .in('userId', idList)
      .order('id', { ascending: false })
      .range(begin, end)
    
    let data, error;
    if (proofAvailability) {
      const {data: a, error: b} = await query.neq('proofOfPayment', null)
      data = a; error = b;
    } else {
      const {data: a, error: b} = await query.is('proofOfPayment', null)
      data = a; error = b;
    }

    return { data, error }
  },

  updateCustomerOrder: async (updatedData, orderId) => {
    const { data, error } = await supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .update(updatedData)
      .match({ id: orderId });
    return { data, error };
  },

  confirmCustomerOrder: async (orderDetailId) => {
    const { error: unavailableProof } = await supabase.from(TABLE_NAME.ONLINE_ORDERS)
      .select('*')
      .eq('orderDetailId', orderDetailId)
      .neq('proofOfPayment', null)
      .single();
    if (unavailableProof) {
      return { error: 'Bukti belum diunggah'}
    }
    
    const { data, error } = await supabase.from(TABLE_NAME.ORDER_DETAIL)
      .update({ status: 'dikonfirmasi' })
      .match({ id: orderDetailId, status: 'belum dibayar' })
    if (data.length === 0) {
      return { error: 'Gagal menemukan detail order yang akan diubah'}
    }
    return { data, error }
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
