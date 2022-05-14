import AddressHelper from '@/utils/supabase-helper/address-helper';

export default async function handler(_, res) {
  try {
    const { data, error } = await AddressHelper.getAllProvinces();
    if (error) {
      throw new Error('Gagal mendapatkan data provinsi');
    }
    if (data.length === 0) {
      throw new Error('Data provinsi kosong');
    }
    res.status(200).json({status: 200, message: 'Berhasil mendapatkan data provinsi', data});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}