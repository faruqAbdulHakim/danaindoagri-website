import Image from 'next/image';

import CommonAppbar from '@/components/common/common-appbar';
import CommonFooter from '@/components/common/common-footer';
import authMiddleware from '@/utils/middleware/auth-middleware'
import PurchaseList from '@/components/screens/purchase/purchase-list';
import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function PurchasePage({ User }) {
 return <>
    {/* decoration */}
    <div className='-z-10'>
      <div className='absolute h-screen w-1/2 top-0 right-0'>
        <Image src='/assets/images/img_14.svg' alt='' layout='fill' objectFit='contain' objectPosition='top right'/>
      </div>
    </div>

    {/* content */}
    <div className='relative'>
      <CommonAppbar User={User} />
      <main className='p-8 bg-white/80 backdrop-blur-md rounded-3xl'>
        <h1 className='text-xl font-semibold ml-4'>
          Daftar pembelian
        </h1>
        <PurchaseList User={User}/>
      </main>
      <CommonFooter />
    </div>
  </>
}

export async function getServerSideProps({ req, res }) {
  const { User } = await authMiddleware(req, res);

  const userRole = User?.role?.roleName;
  if (userRole !== ROLE_NAME.CUSTOMERS) {
    return {
      redirect: {
        destination: '/org/dashboard',
        permanent: false,
      },
      props: {}
    }
  }

  return {
    props: {
      User: User || null,
    },
  }
}
