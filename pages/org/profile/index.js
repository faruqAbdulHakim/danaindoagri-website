import authMiddleware from '@/utils/middleware/auth-middleware';
import CONFIG from '@/global/config';
import OrganizationLayout from '@/components/layouts/organization-layout';

import UserProfile from '@/components/screens/org/profile/user-profile';

export default function Profile({ User }) {
  return <>
    <OrganizationLayout User={User}>
      <UserProfile User={User}/>
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

