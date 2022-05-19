import SideToSideProductLayout from '@/components/layouts/side-to-side-product';
import ProductsHelper from '@/utils/supabase-helper/products-helper';
import ProductOrderScreen from '@/components/screens/products/product-order-screen';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function ProductOrder({ User, Product }) {
  return <>
    <SideToSideProductLayout Product={Product} User={User}>
      <ProductOrderScreen Product={Product} User={User}/>
    </SideToSideProductLayout>
  </>
}

export async function getServerSideProps({ req, res, params }) {
  const productId = params.id;
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

  const userRole = User.role.roleName;
  if (userRole === ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/org/products',
        permanent: false,
      },
      props: {},
    };
  }
  if (userRole !== ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/org/dashboard',
        permanent: false,
      },
      props: {},
    };
  }

  const { data: Product } = await ProductsHelper.getProductById(productId)
  if (!Product) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      props: {},
    }
  }

  return {
    props: {
      User: User || null,
      Product,
    },
  };
}
