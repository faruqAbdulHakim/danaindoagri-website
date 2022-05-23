import authMiddleware from '@/utils/middleware/auth-middleware';
import OrganizationLayout from '@/components/layouts/organization-layout';
import OfflineOrderScreen from '@/components/screens/org/orders/offline-order-screen';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function OfflineOrdersPage({ User, isMarketing }) {
  return <>
    <OrganizationLayout User={User}>
      <OfflineOrderScreen isMarketing={isMarketing} />
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
  
  const userRole = User.role.roleName
  if (userRole === ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/customer/profile',
        permanent: false,
      },
      props: {},
    }
  }

  return {
    props: {
      User,
      isMarketing: userRole === ROLE_NAME.MARKETING,
    },
  }
}
