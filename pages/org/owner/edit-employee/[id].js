import EditEmployeeScreen from '@/components/screens/org/employee-data/edit-employee-screen';
import authMiddleware from '@/utils/middleware/auth-middleware';
import UsersHelper from '@/utils/supabase-helper/users-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function EditEmployee({ Employee }) {
  return <>
    <div className='p-4 bg-slate-100 min-h-screen flex justify-center items-cente'>
      <EditEmployeeScreen Employee={Employee}/>
    </div>
  </>
}

export async function getServerSideProps({ req, res, params }) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
      props: {},
    }
  }
  if (User?.role?.roleName !== ROLE_NAME.OWNER) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }


  const userId = params.id;
  const { data: Employee, error } = await UsersHelper.getUserById(userId);
  const employeeRoleName = Employee?.role?.roleName;
  if (error || (employeeRoleName !== ROLE_NAME.MARKETING && employeeRoleName !== ROLE_NAME.PRODUCTION)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }
  return {
    props: {
      Employee
    }
  }
}