import { useState } from 'react';

import TabNav from './tab-nav';
import BiodataTab from './biodata-tab';
import AuthenticationTab from './authentication-tab';
import AddressTab from './address-tab';

export default function UserProfile({ User }) {
  const [tab, setTab] = useState('biodata');

  return <>
    <div className='p-6 bg-slate-100 rounded-md shadow-xl shadow-black/5'>
      <TabNav tab={tab} setTab={setTab} />
      {
        tab === 'biodata' ?
        <BiodataTab User={User} />
        :
        tab === 'address' ? 
        <AddressTab User={User} />
        :
        tab === 'authentication' ?
        <AuthenticationTab />
        :
        <></>
      }
    </div>
  </>
}
