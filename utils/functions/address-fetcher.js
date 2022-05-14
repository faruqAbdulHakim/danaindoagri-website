import API_ENDPOINT from '@/global/api-endpoint';

const AddressFetcher = {
  fetchAllProvinces: async () => {
    let data, error;
    await fetch(API_ENDPOINT.ADDRESS.GET_PROVINCES).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    });
    return { data, error };
  },


  fetchAllCities: async () => {
    let data, error;
    await fetch(API_ENDPOINT.ADDRESS.GET_CITIES).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    });
    return { data, error };
  },


  fetchAllCitiesByProvinceId: async (provinceId) => {
    let data, error;
    await fetch(API_ENDPOINT.ADDRESS.GET_CITIES + `?provinceId=${provinceId}`).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    });
    return { data, error };
  },
}

export default AddressFetcher;
