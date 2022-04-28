import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrganizationLayout from '@/components/layouts/organization-layout';
import EmployeeDataScreen from '@/components/screens/org/employee-data/employee-data-screen';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function manageMarketing({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <EmployeeDataScreen role={ROLE_NAME.MARKETING} />
    </OrganizationLayout>
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
    props: {
      User
    },
  }
}

