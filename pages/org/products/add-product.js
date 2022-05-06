import OrganizationLayout from '@/components/layouts/organization-layout';
import AddProductForm from '@/components/screens/org/products/add-product-form';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function AddProduct({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <AddProductForm />
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
  if (roleName !== ROLE_NAME.MARKETING) {
    return {
      redirect: {
        destination: '/',
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