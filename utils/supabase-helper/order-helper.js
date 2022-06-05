import supabase from '../supabase';

import CONFIG from '@/global/config';

const { TABLE_NAME, BUCKETS } = CONFIG.SUPABASE;
const { PROOF_OF_PAYMENT } = BUCKETS;
const { DEFAULT_ORIGIN } = CONFIG.RAJAONGKIR;

const OrderHelper = {
  async CustomerCreateOrder(body) {
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
    };
    const { data: orderDetailData, error: insertOrderDetailError } =
      await supabase.from(TABLE_NAME.ORDER_DETAIL).insert([orderDetail]);

    if (insertOrderDetailError || orderDetailData.length === 0) {
      return { error: 'Gagal menambahkan data detail order' };
    }

    const orderDetailId = orderDetailData[0].id;
    const onlineOrder = {
      userId: body.userId,
      orderDetailId,
    };
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .insert([onlineOrder]);

    if (error) {
      await supabase
        .from(TABLE_NAME.ORDER_DETAIL)
        .delete()
        .match({ id: orderDetailId });
    }

    return { data, error };
  },

  async createOfflineOrder(body) {
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
    const { data: orderDetailData, error: orderDetailErr } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .insert([orderDetail])
      .single();
    if (orderDetailErr || orderDetailData.length === 0) {
      return { error: 'Gagal menambahkan data' };
    }

    const orderDetailId = orderDetailData[0].id;
    const { data, error } = await supabase
      .from(TABLE_NAME.OFFLINE_ORDERS)
      .insert([{ orderDetailId }])
      .single();
    if (data.length === 0) {
      await supabase
        .from(TABLE_NAME.ORDER_DETAIL)
        .delete()
        .match({ id: orderDetailId });
      return { error: 'Gagal menambahkan data' };
    }

    return { data, error };
  },

  async getCustomerOrders(customerId) {
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select(`*, orderdetail (*, ${TABLE_NAME.PRODUCTS} (*))`)
      .eq('userId', customerId)
      .order('id', { ascending: false });
    return { data, error };
  },

  async getCustomerOrderById(customerId, orderId) {
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select(
        `
        *, orderdetail (
          *, 
          ${TABLE_NAME.CITIES} (
            *, 
            ${TABLE_NAME.CITY_TYPE} (*),
            ${TABLE_NAME.PROVINCES} (*)
          ), 
          ${TABLE_NAME.PRODUCTS} (*)
        )`
      )
      .eq('userId', customerId)
      .eq('id', orderId)
      .single();
    return { data, error };
  },

  async getOnlineOrder(page, searchText) {
    const { data: userList } = await supabase
      .from(TABLE_NAME.USERS)
      .select('id, fullName')
      .ilike('fullName', `%${searchText}%`);

    const idList = userList.map((User) => User.id);

    const totalDataEachPage = 5;
    const begin = (page - 1) * totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select(
        `
      *, 
      ${TABLE_NAME.ORDER_DETAIL} (
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      ),
      ${TABLE_NAME.USERS}:userId (*)
      `
      )
      .in('userId', idList)
      .order(`id`, { ascending: false })
      .range(begin, end);
    return { data, error };
  },

  async getOnlineOrderById(onlineOrderId) {
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select(
        `
      *, 
      ${TABLE_NAME.ORDER_DETAIL} (
        *,
        ${TABLE_NAME.CITIES} (
          *,
          ${TABLE_NAME.CITY_TYPE} (*),
          ${TABLE_NAME.PROVINCES} (*)
        ),
        ${TABLE_NAME.PRODUCTS} (*)
      ),
      ${TABLE_NAME.USERS}:userId (*)
      `
      )
      .eq('id', onlineOrderId)
      .single();
    return { data, error };
  },

  async getOfflineOrder(page) {
    const totalDataEachPage = 5;
    const begin = (page - 1) * totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const { data, error } = await supabase
      .from(TABLE_NAME.OFFLINE_ORDERS)
      .select(
        `
      *, 
      ${TABLE_NAME.ORDER_DETAIL} (
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      )
      `
      )
      .order(`id`, { ascending: false })
      .range(begin, end);

    return { data, error };
  },

  async getOfflineOrderById(offlineOrderId) {
    const { data, error } = await supabase
      .from(TABLE_NAME.OFFLINE_ORDERS)
      .select(
        `
        *, 
        ${TABLE_NAME.ORDER_DETAIL} (
          *,
          ${TABLE_NAME.CITIES} (
            *,
            ${TABLE_NAME.CITY_TYPE} (*),
            ${TABLE_NAME.PROVINCES} (*)
          ),
          ${TABLE_NAME.PRODUCTS} (*)
        )
        `
      )
      .eq('id', offlineOrderId)
      .single();
    return { data, error };
  },

  async getOrderDetails(page) {
    const totalDataEachPage = 5;
    const begin = (page - 1) * totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const { data, error } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .select(
        `
      *, 
      ${TABLE_NAME.PRODUCTS} (*)
      `
      )
      .order(`id`, { ascending: false })
      .range(begin, end);

    return { data, error };
  },

  async getOrderDetailById(id) {
    const { data, error } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .select(
        `
      *, 
      ${TABLE_NAME.PRODUCTS} (*),
      ${TABLE_NAME.CITIES} (
        *,
        ${TABLE_NAME.CITY_TYPE} (*),
        ${TABLE_NAME.PROVINCES} (*)
      )
      `
      )
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getUnconfirmedOrder(page, searchText, proofAvailability) {
    const { data: userList } = await supabase
      .from(TABLE_NAME.USERS)
      .select('id, fullName')
      .ilike('fullName', `%${searchText}%`);

    const idList = userList.map((User) => User.id);

    const totalDataEachPage = 5;
    const begin = (page - 1) * totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const query = supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select(
        `
      *, 
      ${TABLE_NAME.ORDER_DETAIL}!inner(
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      ),
      ${TABLE_NAME.USERS}:userId (*)
      `
      )
      .eq(`${TABLE_NAME.ORDER_DETAIL}.status`, 'belum dibayar')
      .in('userId', idList)
      .order('id', { ascending: false })
      .range(begin, end);

    let data, error;
    if (proofAvailability) {
      const { data: a, error: b } = await query.neq('proofOfPayment', null);
      data = a;
      error = b;
    } else {
      const { data: a, error: b } = await query.is('proofOfPayment', null);
      data = a;
      error = b;
    }

    return { data, error };
  },

  async getConfirmedOrder(page, searchText) {
    const { data: userList } = await supabase
      .from(TABLE_NAME.USERS)
      .select('id, fullName')
      .ilike('fullName', `%${searchText}%`);

    const idList = userList.map((User) => User.id);

    const totalDataEachPage = 5;
    const begin = (page - 1) * totalDataEachPage;
    const end = begin + (totalDataEachPage - 1);
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select(
        `
      *, 
      ${TABLE_NAME.ORDER_DETAIL}!inner(
        *,
        ${TABLE_NAME.PRODUCTS} (*)
      ),
      ${TABLE_NAME.USERS}:userId (*)
      `
      )
      .eq(`${TABLE_NAME.ORDER_DETAIL}.status`, 'dikonfirmasi')
      .in('userId', idList)
      .order('id', { ascending: false })
      .range(begin, end);

    return { data, error };
  },

  async updateCustomerOrder(updatedData, orderId) {
    const { data, error } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .update(updatedData)
      .match({ id: orderId });
    if (data.length === 0) return { error: 'Gagal update' };
    return { data, error };
  },

  async updateOrderDetail(updatedData, orderDetailId) {
    const { data, error } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .update(updatedData)
      .match({ id: orderDetailId })
      .single();
    return { data, error };
  },

  async confirmCustomerOrder(orderDetailId) {
    const { error: unavailableProof } = await supabase
      .from(TABLE_NAME.ONLINE_ORDERS)
      .select('*')
      .eq('orderDetailId', orderDetailId)
      .neq('proofOfPayment', null)
      .single();
    if (unavailableProof) {
      return { error: 'Bukti belum diunggah' };
    }

    const { data, error } = await supabase
      .from(TABLE_NAME.ORDER_DETAIL)
      .update({ status: 'dikonfirmasi' })
      .match({ id: orderDetailId, status: 'belum dibayar' });
    if (data.length === 0) {
      return { error: 'Gagal menemukan detail order yang akan diubah' };
    }
    return { data, error };
  },

  async uploadProofOfPayment(filename, file, filetype) {
    const { data, error } = await supabase.storage
      .from(PROOF_OF_PAYMENT.BUCKETS_NAME)
      .upload(filename, file, {
        upsert: true,
        contentType: filetype,
      });
    return { data, error };
  },

  async deleteProofOfPayment(filename) {
    let error;
    const { data } = await supabase.storage
      .from(PROOF_OF_PAYMENT.BUCKETS_NAME)
      .remove([filename]);

    if (data.length === 0) {
      error = 'Tidak ada file yang dihapus';
    }

    return { data, error };
  },
};

export default OrderHelper;
