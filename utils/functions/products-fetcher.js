import API_ENDPOINT from '@/global/api-endpoint';

const ProductsFetcher = {
  fetchAllProducts: async () => {
    let data, error, route;
    await fetch(API_ENDPOINT.PRODUCTS, {
      method: 'GET',
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 400) error = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },


  fetchProductById: async (productId) => {
    let data, error;
    await fetch(API_ENDPOINT.PRODUCTS + `?productId=${productId}`, {
      method: 'GET',
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error };
  },


  addNewProduct: async (formData) => {
    let data, error, route;
    await fetch(API_ENDPOINT.PRODUCTS, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 201) data = resJson.message;
      else if (resJson.status === 400) error = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },

  updateProduct: async (productId, productImgUrl, formData) => {
    let data, error, route;
    await fetch(API_ENDPOINT.PRODUCTS 
    + `?productId=${productId || ''}`
    + `&productImgUrl=${productImgUrl || ''}`, {
      method: 'PUT',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 400) error = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },


  patchProduct: async (formData) => {
    let data, error, route;
    await fetch(API_ENDPOINT.PRODUCTS, {
      method: 'PATCH',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else error = resJson.message;
    }).catch((e) => {
      error = e.message;
    });
    return { data, error, route }
  },
}

export default ProductsFetcher;
