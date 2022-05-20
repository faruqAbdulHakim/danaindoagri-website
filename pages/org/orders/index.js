import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrganizationLayout from '@/components/layouts/organization-layout';
import OnlineOrderScreen from '@/components/screens/org/orders/online-order-screen';

export default function Orders({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <OnlineOrderScreen />
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
  
  const { ROLE_NAME } = CONFIG.SUPABASE;
  if (User?.role?.roleName === ROLE_NAME.CUSTOMERS) {
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
      User
    },
  }
}

