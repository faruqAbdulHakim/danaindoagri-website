import API_ENDPOINT from '@/global/api-endpoint';

export default async function userFetcher(roleQuery, searchQuery) {
  let data, error, route;
  await fetch(API_ENDPOINT.GET_USERS(roleQuery, searchQuery)).then((res) => {
    return res.json();
  }).then((resJson) => {
    if (resJson.status === 200) {
      data = resJson.data;
    } else if (resJson === 300) {
      route = resJson.location;
    } else {
      error = resJson.message;
    }
  }).catch((e) => {
    error = e.message;
  })

  return {data, error, route};
}