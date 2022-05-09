import Image from 'next/image';

import CommonAppbar from '@/components/common/common-appbar';
import ProductList from '@/components/screens/products/product-list';
import authMiddleware from '@/utils/middleware/auth-middleware';
import CommonFooter from '@/components/common/common-footer';

export default function ProductsPage({ User }) {
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
      <main className='p-8 max-w-screen-xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl font-semibold ml-4'>
          Produk
        </h1>
        <ProductList />
      </main>
      <CommonFooter />
    </div>
  </>
}

export async function getServerSideProps({ req, res }) {
  const { User } = await authMiddleware(req, res);
  return {
    props: {
      User: User || null,
    },
  };
}
