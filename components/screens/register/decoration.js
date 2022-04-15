import Image from 'next/image'

export default function Decoration() {
  return <>
    <div className='relative bg-slate-50 py-4 flex flex-col h-full'>
      <div className='h-16 w-full relative top-6 left-6'>
        <Image src='/assets/images/logo.svg' alt='' layout='fill' objectFit='contain' objectPosition='top left'/>
      </div>
      <div className='min-h-[240px] w-4/5 mx-auto relative flex-1'>
        <Image src='/assets/images/img_12.svg' alt='' layout='fill' objectFit='contain' objectPosition='center'/>
      </div>
    </div>
  </>
}