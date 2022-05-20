import CONFIG from './config';

const { RAJAONGKIR } = CONFIG;

const API_ENDPOINT = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  USERS_PROFILE_UPDATE: '/api/users',
  USERS_CHANGE_PASSWORD: '/api/users/change-password',
  USERS_CHANGE_ADDRESS: '/api/users/change-address',
  USERS_UPDATE_AVATAR: (userId) => 
    `/api/users/update-avatar?userId=${userId}`,
  GET_USERS: (roleQuery, searchQuery) => 
    `/api/users?roleQuery=${roleQuery}&searchQuery=${searchQuery || ''}`,
  MANAGE_EMPLOYEE: (editType, employeeId) => 
    `/api/owner/manage-employee?editType=${editType || ''}&employeeId=${employeeId || ''}`,
  PRODUCTS: '/api/products',
  ADDRESS: {
    GET_PROVINCES: '/api/address/provinces',
    GET_CITIES: '/api/address/cities',
  },
  RAJAONGKIR: {
    MYAPI_GET_COST: '/api/rajaongkir',
    // cors issues use this api endpoint in server side
    GET_COST: `https://api.rajaongkir.com/${RAJAONGKIR.ACCOUNT_TYPE}/cost`
  },
  ORDER: '/api/order',
  ORG_ORDER: '/api/org/order',
  PROOF_OF_PAYMENT: '/api/order/proof-of-payment',
}

export default API_ENDPOINT;
