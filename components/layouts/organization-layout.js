import Image from 'next/image';

import CommonAppbar from '@/components/common/common-appbar';
import CommonSidebar from '@/components/common/common-sidebar';

export default function OrganizationLayout({ User, children }) {
  return <>
    {/* decoration */}
    <div className='-z-10'>
      <div className='absolute h-screen w-1/2 top-0 right-0'>
        <Image src='/assets/images/img_14.svg' alt='' layout='fill' objectFit='contain' objectPosition='top right'/>
      </div>
    </div>
    <div className='relative min-h-screen flex flex-col max-w-screen-xl mx-auto'>
      <CommonAppbar User={User} />
      <main className='flex flex-1'>
        <CommonSidebar User={User}/>
        <div className='flex-1'>
          {children}
        </div>
      </main>
    </div>
  </>
}