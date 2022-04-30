import API_ENDPOINT from '@/global/api-endpoint';

const UserFetcher = {
  getUserByRole: async (roleQuery, searchQuery) => {
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
  },

  addEmployee: async (formValues) => {
    let data, error, route;
    await fetch(API_ENDPOINT.MANAGE_EMPLOYEE(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      if (resJson.status === 201) {
        data = resJson.message;
      } else if (resJson.status === 300) {
        route = resJson.location;
      } else {
        error = resJson.message;
      }
    }).catch((e) => {
      error = e.message;
    })
    return {data, error, route};
  },

  // edit type must be 'biodata' or 'password'
  editEmployee: async (editType, employeeId, formValues) => {
    let data, error, route;
    if (editType !== 'biodata' && editType !== 'password') {
      return {data, error: 'invalid data type', route};
    }
    await fetch(API_ENDPOINT.MANAGE_EMPLOYEE(editType, employeeId), {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formValues),
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) {
        data = resJson.message;
      } else if (resJson.status === 300) {
        route = resJson.location;
      } else {
        error = resJson.message;
      }
    }).catch((e) => {
      error = e.message;
    })
    return {data, error, route};
  },
}

export default UserFetcher;
