// reference: customer/profile/tab-nav.js

export default function TabNav({ tab, setTab }) {
  return (
    <>
      <div className="flex gap-x-6 gap-y-2 flex-wrap mb-8">
        <TabNavButton
          text="Biodata Diri"
          isActive={tab === 'biodata'}
          clickHandler={() => setTab('biodata')}
        />
        <TabNavButton
          text="Alamat"
          isActive={tab === 'address'}
          clickHandler={() => setTab('address')}
        />
        <TabNavButton
          text="Autentikasi"
          isActive={tab === 'authentication'}
          clickHandler={() => setTab('authentication')}
        />
      </div>
    </>
  );
}

function TabNavButton({ text, isActive, clickHandler }) {
  return (
    <>
      <button
        type="button"
        className={`py-2 px-4 rounded-full hover:bg-primary hover:text-white active:opacity-40 transition-all
      ${
        isActive
          ? 'bg-gradient-to-br from-primary to-primary/40 text-white'
          : 'text-slate-700'
      }`}
        onClick={clickHandler}
      >
        {text}
      </button>
    </>
  );
}
