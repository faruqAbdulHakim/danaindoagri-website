import OrganizationLayout from '@/components/layouts/organization-layout';
import EditOfflineOrderScreen from '@/components/screens/org/orders/edit-offline-order-screen';
import authMiddleware from '@/utils/middleware/auth-middleware';
import OrderHelper from '@/utils/supabase-helper/order-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function EditOfflineOrder({ User, Order }) {
  return <>
    <OrganizationLayout User={User}>
      <EditOfflineOrderScreen Order={Order} />
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
  if (userRole !== ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }
  
  const { data: Order, error } = await OrderHelper.getOfflineOrderById(params.id);
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
