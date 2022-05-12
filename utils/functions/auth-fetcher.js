import API_ENDPOINT from '@/global/api-endpoint';

const AuthFetcher = {
  login: async (formValues) => {
    let error, route;
    await fetch(API_ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })

    return { error, route }
  }
}

export default AuthFetcher;
