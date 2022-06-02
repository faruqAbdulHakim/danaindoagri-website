import API_ENDPOINT from '@/global/api-endpoint';

const ExpensesFetcher = {
  async fetchAllExpenses() {
    let data, error, route;
    await fetch(API_ENDPOINT.EXPENSES)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) data = resJson.data;
        else if (resJson.status === 300) route = resJson.location;
        else error = resJson.message;
      })
      .catch((e) => (error = e.message));

    return { data, error, route };
  },

  async postNewExpense(body) {
    let data, error, route;
    await fetch(API_ENDPOINT.EXPENSES, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) data = resJson.message;
        else if (resJson.status === 300) route = resJson.location;
        else error = resJson.message;
      })
      .catch((e) => (error = e.message));
  },
};

export default ExpensesFetcher;
