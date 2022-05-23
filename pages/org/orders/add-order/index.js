import authMiddleware from '@/utils/middleware/auth-middleware'
import CONFIG from '@/global/config';
import OrganizationLayout from '@/components/layouts/organization-layout';
import AddOrderScreen from '@/components/screens/org/orders/add-order-screen';

const { ROLE_NAME } = CONFIG.SUPABASE;


export default function AddOrderPage({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <AddOrderScreen />
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
    };
  }

  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/org/dashboard',
        permanent: false
      },
      props: {},
    };
  }

  return {
    props: {
      User: User || null
    }
  }
}
