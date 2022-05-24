import OrganizationLayout from '@/components/layouts/organization-layout';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OnlineOrderDetailScreen from '@/components/screens/org/orders/detail/online-order-detail-screen';
import OrderHelper from '@/utils/supabase-helper/order-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function OnlineOrderDetail({ User, Order }) {
  return <>
    <OrganizationLayout User={User}>
      <OnlineOrderDetailScreen Order={Order} />
    </OrganizationLayout>
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
  
  const userRole = User.role.roleName;
  if (userRole === ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }
  
  const { data: Order, error } = await OrderHelper.getOnlineOrderById(params.id);
  if (error) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      props: {}
    }
  }

  return {
    props: {
      User, Order,
    }
  }
}
