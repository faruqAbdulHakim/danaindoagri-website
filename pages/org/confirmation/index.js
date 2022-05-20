import authMiddleware from '@/utils/middleware/auth-middleware';
import OrganizationLayout from '@/components/layouts/organization-layout';
import CONFIG from '@/global/config';
import OnlineConfirmationScreen from '@/components/screens/org/confirmation/online-confirmation-screen';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function ConfirmationPage({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <OnlineConfirmationScreen />
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
  
  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/org/dashboard',
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

