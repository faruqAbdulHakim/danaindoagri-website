import SideToSideProductLayout from '@/components/layouts/side-to-side-product';
import authMiddleware from '@/utils/middleware/auth-middleware';
import OrderHelper from '@/utils/supabase-helper/order-helper';
import AddReviewScreen from '@/components/screens/purchase/add-review-screen';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function AddReviewPage({ Order, User }) {
  return <>
    <SideToSideProductLayout Product={Order.orderdetail.products} User={User}>
      <AddReviewScreen Order={Order}/>
    </SideToSideProductLayout>
  </>
}

export async function getServerSideProps({ req, res, params }) {
  const { User } = await authMiddleware(req, res);
  if (!User) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      },
      props: {},
    }
  }

  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      },
      props: {}
    }
  }

  // get order and product by id
  const orderId = params.id;
  const { data: Order, error } = await OrderHelper.getCustomerOrderById(User.id, orderId);
  if (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }

  if (Order.orderdetail.status !== 'diterima') {
    return {
      redirect: {
        destination: '/purchase',
        permanent: false,
      },
      props: {},
    }
  }
  
  return {
    props: {
      User,
      Order,
    }
  }
}
