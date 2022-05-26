import authMiddleware from '@/utils/middleware/auth-middleware';
import OrganizationLayout from '@/components/layouts/organization-layout';
import CONFIG from '@/global/config';
import ReceiptNumberScreen from '@/components/screens/org/receipt-number/receipt-number-screen';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function ReceiptNumberPage({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <ReceiptNumberScreen />
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
  
  const userRole = User.role.roleName;
  if (userRole !== ROLE_NAME.PRODUCTION) {
    return {
      redirect: {
        destination: '/org/dashboard',
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

