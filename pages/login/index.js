import Link from 'next/link';

import { FiX } from 'react-icons/fi';

import OneCard from '@/components/layouts/one-card'
import Decoration from '@/components/screens/login/decoration'
import LoginForm from '@/components/screens/login/login-form'
import authMiddleware from '@/utils/middleware/auth-middleware';

export default function Login() {
  return <>
    <OneCard className='grid sm:grid-cols-2 relative'>
      {/* close button (route to homepage) */}
      <div className='absolute top-4 right-4 bg-slate-200 rounded-full hover:bg-black hover:text-white active:opacity-40 
        transition-all z-10'>
        <Link href='/'>
          <a>
            <FiX size={32} className='p-2'/>
          </a>
        </Link>
      </div>

      {/* left side */}
      <div className='order-1'>
        <LoginForm />
      </div>

      {/* right side */}
      <div className='sm:order-2'>
        <Decoration />
      </div>
    </OneCard>
  </>
}

export async function getServerSideProps({ req, res }) {
  const { User } = await authMiddleware(req, res);
  if (User) {
    return {
      redirect: {
        destination: '/org/dashboard',
        permanent: false,
      },
      props: {},
    }
  }
  return {
    props: {},
  }
}
