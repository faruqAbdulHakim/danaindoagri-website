const API_ENDPOINT = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  USERS_PROFILE_UPDATE: '/api/users/update',
  USERS_CHANGE_PASSWORD: '/api/users/change-password',
  USERS_CHANGE_ADDRESS: '/api/users/change-address',
  GET_USERS: (roleQuery, searchQuery) => 
    `/api/users/get-users?roleQuery=${roleQuery}&searchQuery=${searchQuery || ''}`,
  MANAGE_EMPLOYEE: (editType, employeeId) => 
    `/api/owner/manage-employee?editType=${editType || ''}&employeeId=${employeeId || ''}`,
}

export default API_ENDPOINT;
