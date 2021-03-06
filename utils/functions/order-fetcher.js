import API_ENDPOINT from '@/global/api-endpoint';

const OrderFetcher = {
  createOrder: async (body) => {
    let data, error;
    await fetch(API_ENDPOINT.ORDER, {
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

  createOfflineOrder: async (body) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORG_ORDER, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })
    return { data, error, route }
  },

  updateOfllineOrder: async (body) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORG_ORDER, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })
    return { data, error, route }
  },

  confirmOrder: async (orderDetailId) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORG_CONFIRMATION, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ orderDetailId }),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    });
    return { data, error, route };
  },

  confirmOrderArrived: async (orderDetailId) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORDER_ARRIVED_CONFIRMATION, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ orderDetailId })
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) data = resJson.message;
        else if (resJson.status === 300) route = resJson.location;
        else error = resJson.message;
      })
      .catch((e) => error = e.message);
    return { data, error, route};
  },

  fetchCustomerOrders: async () => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORDER).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },

  fetchOrders: async (page, searchText, orderType) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORG_ORDER + `?page=${page}&searchText=${searchText}&orderType=${orderType}`).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },

  fetchUnconfirmedOrder: async (page, searchText, proofAvailability) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORG_CONFIRMATION + `?page=${page}&searchText=${searchText}&proofAvailability=${proofAvailability}`)
    .then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },

  fetchConfirmedOrder: async (page, searchText) => {
    let data, error, route;
    await fetch(API_ENDPOINT.ORG_CONFIRMED_ORDER + `?page=${page}&searchText=${searchText}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) data = resJson.data;
        else if (resJson.status === 300) route = resJson.location;
        else error = resJson.message;
      })
      .catch((e) => error = e.message)
    return { data, error, route };
  },

  postReceiptNumber: async (orderId, receiptNumber) => {
    let data, error, route;

    await fetch(API_ENDPOINT.ORG_RECEIPT_NUMBER, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ orderId, receiptNumber })
    }).then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) data = resJson.message;
        else if (resJson.status === 300) route = resJson.location;
        else error = resJson.message;
      }).catch((e) => error = e.message);
    return { data, error, route };
  },

  postProofOfPayment: async (orderId, file) => {
    let data, error, route;

    const formData = new FormData;
    formData.append('file', file);
    formData.append('orderId', orderId);

    await fetch(API_ENDPOINT.PROOF_OF_PAYMENT, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },

  changeProofOfPayment: async (orderId, file) => {
    let data, error, route;

    const formData = new FormData;
    formData.append('file', file);
    formData.append('orderId', orderId);

    await fetch(API_ENDPOINT.PROOF_OF_PAYMENT, {
      method: 'PUT',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route };
  },

  deleteProofOfPayment: async (orderId) => {
    let data, error, route;

    const formData = new FormData();
    formData.append('orderId', orderId);

    await fetch(API_ENDPOINT.PROOF_OF_PAYMENT, {
      method: 'DELETE',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route }
  }

}

export default OrderFetcher;
