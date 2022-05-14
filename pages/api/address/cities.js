import AddressHelper from '@/utils/supabase-helper/address-helper';

export default async function handler(req, res) {
  try {
    const provinceId = req.query.provinceId;
    let data, error;
    
    if (provinceId) {
      const { data: d, error: e } = await AddressHelper.getCityByProvinceId(provinceId);
      if (d) data = d;
      else if (e) error = e;
    } else {
      const { data: d, error: e } = await AddressHelper.getAllCities();
      if (d) data = d;
      else if (e) error = e;
    }

    if (error) {
      console.log(error)
      throw new Error('Gagal mendapatkan data kabupaten/kota');
    }
    if (data.length === 0) {
      throw new Error('Data kabupaten/kota kosong');
    }
    res.status(200).json({status: 200, message: 'Berhasil mendapatkan data kabupaten/kota', data});
  } catch (e) {
    res.status(400).json({status: 400, message: e.message});
  }
}