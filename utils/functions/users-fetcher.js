import API_ENDPOINT from '@/global/api-endpoint';

const UserFetcher = {
  getUserByRole: async (roleQuery, searchQuery) => {
    let data, error, route;
    await fetch(API_ENDPOINT.GET_USERS(roleQuery, searchQuery)).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.data;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
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
      if (resJson.status === 201) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
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
      if (resJson.status === 200) data = resJson.message; 
      else if (resJson.status === 300) route = resJson.location;
      else if (resJson.status === 400) error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })
    return { data, error, route };
  },

  updateUser: async (body) => {
    let data, error, route;
    await fetch(API_ENDPOINT.USERS_PROFILE_UPDATE, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      return res.json()
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 400) error = resJson.message ;
      else if (resJson.status === 300) route = resJson.location;
    }).catch((e) => {
      error = e.message;
    })

    return { data, error, route }
  },

  updateAvatar: async (userId, file) => {
    let data, error, route;
    const formData = new FormData();
    formData.append('file', file);
    await fetch(API_ENDPOINT.USERS_UPDATE_AVATAR(userId), {
      method: 'PUT',
      body: formData,
    }).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 200) data = resJson.message;
      else if (resJson.status === 300) route = resJson.location;
      else error = resJson.message;
    }).catch((e) => {
      error = e.message;
    })
    return { data, error, route };
  },

  updateAddress: async (formValues) => {
    let data, error, route;
    await fetch(API_ENDPOINT.USERS_CHANGE_ADDRESS, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formValues),
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
  }
}

export default UserFetcher;
