import API_ENDPOINT from '@/global/api-endpoint';

const ProductsFetcher = {
  fetchAllProducts: async () => {
    let data, error, route;
    await fetch(API_ENDPOINT.GET_PRODUCTS, {
      method: 'GET',
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 400) error = resJson.message;
      else if (resJson.status === 300) route = resJson.route;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },


  addNewProduct: async (formData) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ADD_PRODUCT, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 201) data = resJson.message;
      else if (resJson.status === 400) error = resJson.message;
      else if (resJson.status === 300) route = resJson.route;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  }
}

export default ProductsFetcher;
