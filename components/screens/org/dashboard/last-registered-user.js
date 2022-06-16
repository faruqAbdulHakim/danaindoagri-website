import Router from 'next/router';
import { useState, useEffect, useRef } from 'react';

import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import CONFIG from '@/global/config';
import Image from 'next/image';

const { AVATAR_BASE_URL } = CONFIG.SUPABASE.BUCKETS.AVATARS;

export default function LastRegisteredUser({ setError }) {
  const [fetching, setFetching] = useState(false);
  const [userList, setUserList] = useState([]);

  const userListContainer = useRef(null);

  useEffect(() => {
    setFetching(true);
    fetch('/api/dashboard/last-registered-user')
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.status === 200) setUserList(resJson.data);
        else if (resJson.status === 300) Router.push(resJson.location);
        else throw new Error(resJson.message);
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [setError]);

  return (
    <div className="p-3 relative">
      <h2 className="text-lg font-semibold">Pendaftar terakhir</h2>
      <hr className="my-3" />
      {fetching ? (
        <p className="text-primary animate-bounce">Loading</p>
      ) : (
        <>
          <div
            className="flex flex-col gap-4 max-h-[220px] pb-16 overflow-hidden no-scroll scroll-smooth"
            ref={userListContainer}
          >
            {userList.map((user) => {
              return <UserItem user={user} key={user.id} />;
            })}
          </div>
          <div
            className="absolute bottom-0 left-0 w-full bg-gradient-to-b gap-2
            from-white/0 to-white flex items-center justify-center py-2"
          >
            <button
              type="button"
              onClick={() => {
                userListContainer.current.scrollTop -= 200;
              }}
              className="p-2 border shadow-md rounded-full bg-white hover:scale-105 active:scale-95 transition-all"
            >
              <BsChevronUp />
            </button>
            <button
              type="button"
              onClick={() => {
                userListContainer.current.scrollTop += 200;
              }}
              className="p-2 border shadow-md rounded-full bg-white hover:scale-105 active:scale-95 transition-all"
            >
              <BsChevronDown />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function UserItem({ user }) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <div className="bg-slate-200 aspect-square w-10 rounded-full relative overflow-hidden">
        {imageError ? (
          <Image
            src="/assets/images/avatar.png"
            alt=""
            layout="fill"
            className="rounded-full"
          />
        ) : (
          <Image
            src={`${AVATAR_BASE_URL}/avatar${user.id}`}
            alt="avatar"
            onError={() => setImageError(true)}
            layout="fill"
          />
        )}
      </div>
      <h3 className="overflow-clip w-40">{user.fullName}</h3>
    </div>
  );
}
