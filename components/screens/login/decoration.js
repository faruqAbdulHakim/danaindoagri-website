import Image from 'next/image';

export default function Decoration() {
  return <>
    <div className='relative min-h-[30vh] sm:min-h-[90vh] h-full w-full'>
      <Image src='/assets/images/img_13.jpg' alt='aa' layout='fill' objectFit='cover' objectPosition='center'/>
    </div>
  </>
}