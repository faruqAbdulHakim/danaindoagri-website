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
  GET_PRODUCTS: '/api/products',
  ADD_PRODUCT: '/api/products',
  UPDATE_PRODUCT: (productId, productImgUrl) => 
    `/api/products?productId=${productId || ''}&productImgUrl=${productImgUrl || ''}`,
}

export default API_ENDPOINT;
