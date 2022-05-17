import API_ENDPOINT from '@/global/api-endpoint';
import CONFIG from '@/global/config';

const { API_KEY } = CONFIG.RAJAONGKIR;

export default async function handler(req, res) {
  try {
    const { method, body } = req;

    if (method !== 'POST') {
      throw new Error('Invalid Method');
    }

    let data;
    await fetch(API_ENDPOINT.RAJAONGKIR.GET_COST, {
      method: 'POST',
      headers: {
        key: API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      data = resJson;
    }).catch((e) => {
      throw new Error(e.message);
    })

    res.status(200).json({status: 200, message: 'Berhasil mendapatkan data', data})
  } catch (e) {
    res.status(400).json({status: 400, message: e.message})
  }
}
