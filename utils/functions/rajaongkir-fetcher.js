import API_ENDPOINT from '@/global/api-endpoint';
import CONFIG from '@/global/config';

const { RAJAONGKIR } = CONFIG;

const RajaongkirFetcher = {
  getCost: async (body) => {
    let data, error;

    await fetch(API_ENDPOINT.RAJAONGKIR.MYAPI_GET_COST, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      }, 
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.data.rajaongkir.status.code === 200) data = resJson.data.rajaongkir.results;
      else error = resJson.data.rajaongkir.status.description;
    }).catch((e) => {
      error = e.message;
    });
    return { data, error }
  },
}

export default RajaongkirFetcher;
