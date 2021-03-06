import OrganizationLayout from '@/components/layouts/organization-layout';
import authMiddleware from '@/utils/middleware/auth-middleware';
import ProductsHelper from '@/utils/supabase-helper/products-helper';
import ProductDetail from '@/components/screens/org/products/product-detail';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function DetailPage({ User, Product }) {
  return <>
    <OrganizationLayout User={User}>
      <ProductDetail Product={Product} />
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
  
  const roleName = User?.role?.roleName;
  if (roleName === ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/customer/profile',
        permanent: false,
      },
      props: {},
    }
  }

  const productId = params.id;
  const { data: Product, error } = await ProductsHelper.getProductById(productId);
  if (error) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      User, Product
    },
  }
}