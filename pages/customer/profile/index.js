import Image from 'next/image';

import CommonAppbar from '@/components/common/common-appbar';
import authMiddleware from '@/utils/middleware/auth-middleware'
import UserProfile from '@/components/screens/customer/profile/user-profile';
import CtaCard from '@/components/screens/customer/profile/cta-card';
import CommonFooter from '@/components/common/common-footer';
import CONFIG from '@/global/config';
import OrderHelper from '@/utils/supabase-helper/order-helper';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function Profile({ User, LastOrder }) {
  return <>
    <div className='relative'>
      {/* decoration */}
      <div className='-z-10'>
        <div className='absolute bottom-0 h-full max-h-[1360px] lg:max-h-[1140px] w-full'>
          <Image src='/assets/images/img_7.svg' alt='' layout='fill' objectFit='cover' objectPosition='top right'/>
        </div>
        <div className='absolute bottom-0 right-0 h-72 w-56'>
          <Image src='/assets/images/img_8.svg' alt='' layout='fill' objectFit='contain' objectPosition='bottom right'/>
        </div>
        <div className='absolute h-screen w-1/2 top-0 right-0'>
          <Image src='/assets/images/img_14.svg' alt='' layout='fill' objectFit='contain' objectPosition='top right'/>
        </div>
      </div>

      {/* content */}
      <div className='relative'>
        <CommonAppbar User={User} />
        <main className='flex flex-wrap flex-col md:flex-row p-4 max-w-screen-xl mx-auto gap-10'>
          {/* left side */}
          <div className='w-full max-w-[340px] mx-auto'>
            <CtaCard User={User} LastOrder={LastOrder} />
          </div>
          {/* profile */}
          <div className='flex-1'>
            <UserProfile User={User} />
          </div>
        </main>
        <CommonFooter />
      </div>
    </div>
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

  if (User?.role?.roleName !== ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    }
  }

  const { data: OrderList } = await OrderHelper.getCustomerOrders(User.id) || [];
  const LastOrder = OrderList[0] || {};
  console.log(LastOrder)
  return {
    props: {
      User, LastOrder
    },
  }
}