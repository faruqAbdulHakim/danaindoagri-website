import API_ENDPOINT from '@/global/api-endpoint';

const OrderFetcher = {
  createOrder: async (body) => {
    let data, error;
    await fetch(API_ENDPOINT.CREATE_ORDER, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error };
  },

}

export default OrderFetcher;
