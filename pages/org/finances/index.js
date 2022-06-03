import OrganizationLayout from '@/components/layouts/organization-layout';
import authMiddleware from '@/utils/middleware/auth-middleware';
import FinancesScreen from '@/components/screens/org/finances/finances-screen';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function Finances({ User }) {
  return (
    <div>
      <OrganizationLayout User={User}>
        <FinancesScreen />
      </OrganizationLayout>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return {
      redirect: {
        destination: '/login',
        permanens: false,
      },
      props: {},
    };
  }

  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.MARKETING && userRole !== ROLE_NAME.OWNER) {
    return {
      redirect: {
        destination: '/org/dashboard',
        permanens: false,
      },
      props: {},
    };
  }

  return {
    props: {
      User,
    },
  };
}
