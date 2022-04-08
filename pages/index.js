import AppBar from '@/components/screens/homepage/appbar';
import FirstSection from '@/components/screens/homepage/first-section';
import SecondSection from '@/components/screens/homepage/second-section';
import ThirdSection from '@/components/screens/homepage/third-section';
import FourthSection from '@/components/screens/homepage/fourth-section';
import FifthSection from '@/components/screens/homepage/fifth-section';
import Footer from '@/components/screens/homepage/footer';

import Image from 'next/image';
import HeroSection from '@/components/screens/homepage/hero-section';

export default function Home() {
  return (
    <>
    <div className='relative bg-white overflow-hidden'>
      {/* decoration */}
      <div className='-z-10'>
        <div className='absolute top-0 right-0 h-screen w-1/2'>
          <Image src='/assets/images/img_10.png' alt='' layout='fill' objectFit='contain' objectPosition='top right'/>
        </div>
        <div className='absolute top-0 translate-y-[50vh] left-0 h-screen w-28'>
          <Image src='/assets/images/img_11.png' alt='' layout='fill' objectFit='contain' objectPosition='bottom left'/>
        </div>
        <div className='absolute top-0 translate-y-[230vh] -scale-x-100 right-0 h-screen w-32'>
          <Image src='/assets/images/img_11.png' alt='' layout='fill' objectFit='contain' objectPosition='bottom left'/>
        </div>
        <div className='absolute bottom-0 h-full max-h-[1360px] lg:max-h-[1140px] w-full'>
          <Image src='/assets/images/img_7.svg' alt='' layout='fill' objectFit='cover' objectPosition='top right'/>
        </div>
        <div className='absolute bottom-0 right-0 h-72 w-56'>
          <Image src='/assets/images/img_8.svg' alt='' layout='fill' objectFit='contain' objectPosition='bottom right'/>
        </div>
      </div>
      {/* content */}
      <div className='relative z-0'>
        <AppBar />
        <main>
          <HeroSection />
          <FirstSection />
          <SecondSection />
          <ThirdSection />
          <FourthSection />
          <FifthSection />
        </main>
        <Footer />
      </div>
    </div>
    </>
  )
}
