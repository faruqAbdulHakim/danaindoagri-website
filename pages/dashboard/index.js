import Router from 'next/router';
import { useState } from 'react';

import authMiddleware from '@/utils/middleware/auth-middleware';
import API_ENDPOINT from '@/global/api-endpoint';

export default function Dashboard({User}) {
  const [isLogout, setIsLogout] = useState(false);

  const buttonHandler = () => {
    setIsLogout(true);
    fetch(API_ENDPOINT.LOGOUT).then((res) => {
      return res.json();
    }).then((resJson) => {
      if (resJson.status === 300) {
        Router.push(resJson.location)
      }
    }).catch(() => {}).finally(() => {
      setIsLogout(false);
    })
  };

  return <>
    <p>
      {JSON.stringify(User, )}
    </p>
    <button onClick={buttonHandler} className='bg-red-600 text-white px-4 py-2 disabled:bg-slate-600' disabled={isLogout}>
      LogOut
    </button>
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
  return {
    props: {
      User
    },
  }
}

