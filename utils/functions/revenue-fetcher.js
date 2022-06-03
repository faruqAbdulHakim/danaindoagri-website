import API_ENDPOINT from '@/global/api-endpoint';

const RevenueFetcher = {
  async fetchAll() {
    let data, error, route;
    await fetch(API_ENDPOINT.REVENUE)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) data = resJson.data;
        else if (resJson.status === 300) route = resJson.location;
        else error = resJson.message;
      })
      .catch((e) => (error = e.message));
    return { data, error, route };
  },
};

export default RevenueFetcher;
