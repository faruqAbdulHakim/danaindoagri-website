import ManageEmployeeScreen from '@/components/screens/org/employee-data/manage-employee-screen';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function AddEmployee() {
  return <>
    <div className='p-4 bg-slate-100 min-h-screen flex justify-center items-center'>
      <ManageEmployeeScreen />
    </div>
  </>
}

export async function getServerSideProps({ req, res }) {
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

  return {
    props: {},
  }
}
