import Link from 'next/link';

import { FiX } from 'react-icons/fi';

import OneCard from '@/components/layouts/one-card';
import Decoration from '@/components/screens/register/decoration';
import RegisterForm from '@/components/screens/register/register-form';
import authMiddleware from '@/utils/middleware/auth-middleware';

export default function Register() {
  return <>
    <OneCard className='grid sm:grid-cols-2 relative'>
      {/* close button (route to homepage) */}
      <div className='absolute top-4 right-4 bg-slate-200 rounded-full hover:bg-black hover:text-white active:opacity-40 
      transition-all'>
        <Link href='/'>
          <a>
            <FiX size={32} className='p-2'/>
          </a>
        </Link>
      </div>
      
      {/* left side */}
      <div>
        <Decoration />
      </div>

      {/* right side */}
      <div>
        <RegisterForm />
      </div>
    </OneCard>
  </>
}

export async function getServerSideProps({ req, res }) {
  const { User } = await authMiddleware(req, res);
  if (User) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
      props: {},
    }
  }
  return {
    props: {},
  }
}
