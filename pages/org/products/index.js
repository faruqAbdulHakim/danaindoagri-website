import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrganizationLayout from '@/components/layouts/organization-layout';
import ProductList from '@/components/screens/org/products/products-list';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function Products({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <ProductList userRole={User?.role?.roleName} />
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

  return {
    props: {
      User
    },
  }
}
