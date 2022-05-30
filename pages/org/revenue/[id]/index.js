import RevenueDetailScreen from '@/components/screens/org/revenue/revenue-detail-screen';
import OrganizationLayout from '@/components/layouts/organization-layout';
import authMiddleware from '@/utils/middleware/auth-middleware';
import OrderHelper from '@/utils/supabase-helper/order-helper';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function RevenueDetailPage({ User, OrderDetail }) {
  return <>
    <OrganizationLayout User={User}>
      <RevenueDetailScreen OrderDetail={OrderDetail}/>
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
      props: {}
    }
  }

  const userRole = User.role.roleName
  if (userRole !== ROLE_NAME.OWNER && userRole !== ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {}
    }
  }

  const { data: OrderDetail } = await OrderHelper.getOrderDetailById(params.id);
  if (!OrderDetail) {
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
      User,
      OrderDetail,
    }
  }
}
