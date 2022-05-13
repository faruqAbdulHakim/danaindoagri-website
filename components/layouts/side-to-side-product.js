import Image from 'next/image';

import CommonAppbar from '../common/common-appbar';
import CONFIG from '@/global/config';

const { PRODUCTS_BASE_URL } = CONFIG.SUPABASE.BUCKETS.PRODUCTS;

export default function SideToSideProductLayout({ Product, User, children }) {
  return <>
    <div className='-z-10'>
      <div className='absolute h-screen w-1/2 top-0 right-0'>
        <Image src='/assets/images/img_14.svg' alt='' layout='fill' objectFit='contain' objectPosition='top right'/>
      </div>
    </div>
    <div className='relative min-h-screen flex flex-col max-w-screen-xl mx-auto'>
      <CommonAppbar User={User} />
      <main className='flex-1 grid sm:grid-cols-2 rounded-3xl overflow-hidden'>
        <div className='bg-gradient-to-br from-primary to-primary/30 h-full flex'>
          <div className='p-8 w-full max-w-lg mx-auto'>
            <h2 className='text-white text-xl font-semibold'>
              Produk
            </h2>
            <div className='mt-4 relative aspect-square w-full max-w-[320px] rounded-lg overflow-hidden'>
              <Image src={`${PRODUCTS_BASE_URL}/${Product.imgUrl}`} alt='' 
              layout='fill' objectFit='cover' objectPosition='center'/>
            </div>
          </div>
          <div className='w-6 bg-white rounded-l-3xl'>
          </div>
        </div>
        {children}
      </main>
    </div>
  </>
}