import OrganizationLayout from '@/components/layouts/organization-layout';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import ExpensesScreen from '@/components/screens/org/expenses/expenses-screen';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function Expenses({ User }) {
  return (
    <OrganizationLayout User={User}>
      <ExpensesScreen userRole={User.role.roleName} />
    </OrganizationLayout>
  );
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
    };
  }

  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.MARKETING && userRole !== ROLE_NAME.OWNER) {
    return {
      redirect: {
        destination: '/org/dashboard',
        permanent: false,
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
