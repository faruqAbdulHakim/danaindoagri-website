import RevenueListScreen from '@/components/screens/org/revenue/revenue-list-screen';
import OrganizationLayout from '@/components/layouts/organization-layout';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function RevenueListPage({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <RevenueListScreen />
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
      props: {}
    }
  }

  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.OWNER && userRole !== ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {}
    }
  }

  return {
    props: {
      User
    }
  }
}
