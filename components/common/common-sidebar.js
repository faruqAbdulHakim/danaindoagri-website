import Link from 'next/link';
import { useRouter } from 'next/router';

import { AiOutlineLineChart, AiOutlineFileText } from 'react-icons/ai';
import { RiDashboardLine } from 'react-icons/ri';
import { BiUserCircle } from 'react-icons/bi';
import { BsBoxSeam, BsCart2, BsBank, BsCheck2All } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';

import CONFIG from '@/global/config';

const { ROLE_NAME } = CONFIG.SUPABASE;

export default function CommonSidebar({ User }) {
  const router = useRouter();
  const { pathname } = router;

  // navlink except for owner
  const roleName = User?.role?.roleName;
  const NavLinkList = getNavLinkList(roleName);
  const OwnerNavLinkList = getOwnerNavLinkList();

  return (
    <>
      <div>
        <div className="flex justify-between bg-primary rounded-l-3xl h-full">
          {/* content */}
          <div className="flex-1 flex flex-col pl-4 pt-4 text-white">
            <h2 className="text-lg px-6 font-semibold hidden lg:inline">
              {roleName === ROLE_NAME.MARKETING
                ? 'Divisi Marketing'
                : roleName === ROLE_NAME.PRODUCTION
                ? 'Divisi Produksi'
                : roleName === ROLE_NAME.OWNER && 'Pemilik Usaha'}
            </h2>
            <div className="flex flex-col gap-8 justify-between lg:mt-6 mb-4 h-[calc(100vh-170px)] overflow-scroll no-scroll">
              <div className="space-y-1">
                {generateNavLink(NavLinkList, pathname)}
              </div>

              {/* Owner only */}
              {roleName === ROLE_NAME.OWNER && (
                <div className="space-y-1">
                  {generateNavLink(OwnerNavLinkList, pathname)}
                </div>
              )}
            </div>
          </div>
          {/* decor */}
          <div className="w-6 bg-white rounded-l-3xl"></div>
        </div>
      </div>
    </>
  );
}

function generateNavLink(NavLink, pathname) {
  return (
    <>
      {Object.entries(NavLink).map(([key, val]) => {
        const { Icon } = val;
        const isActive = pathname.includes(val.location);
        return (
          <div key={key} className="relative">
            {isActive && (
              <div className="bg-white h-2 w-full absolute -top-2 left-0">
                <div className="bg-primary h-full w-full rounded-br-3xl"></div>
              </div>
            )}
            {isActive && (
              <div className="bg-white h-2 w-full absolute -bottom-2 left-0">
                <div className="bg-primary h-full w-full rounded-tr-3xl"></div>
              </div>
            )}
            <Link href={val.location}>
              <a
                className={`flex items-center py-3 pl-3 lg:pl-6 pr-1 lg:pr-10
              ${
                isActive
                  ? 'bg-white text-primary rounded-l-3xl'
                  : 'hover:opacity-70 active:opacity-40 transition-all'
              }
            `}
              >
                <Icon size={20} className="mr-2" />
                <span className="hidden lg:block">{val.text}</span>
              </a>
            </Link>
          </div>
        );
      })}
    </>
  );
}

function getNavLinkList(roleName) {
  const NavLinkList = {
    dashboard: {
      location: '/org/dashboard',
      text: 'Dashboard',
      Icon: RiDashboardLine,
    },
    profile: {
      location: '/org/profile',
      text: 'Profile',
      Icon: BiUserCircle,
    },
    products: {
      location: '/org/products',
      text: 'Produk',
      Icon: BsBoxSeam,
    },
    orders: {
      location: '/org/orders',
      text: 'Pemesanan',
      Icon: BsCart2,
    },
    confirmation: {
      location: '/org/confirmation',
      text: 'Konfirmasi',
      Icon: BsCheck2All,
    },
    receiptNumber: {
      location: '/org/receipt-number',
      text: 'Nomor Resi',
      Icon: MdOutlineConfirmationNumber,
    },
    customerData: {
      location: '/org/customer-data',
      text: 'Data Customer',
      Icon: HiOutlineUserGroup,
    },
    revenue: {
      location: '/org/revenue',
      text: 'Pendapatan',
      Icon: AiOutlineLineChart,
    },
    expenses: {
      location: '/org/expenses',
      text: 'Pengeluaran',
      Icon: AiOutlineFileText,
    },
  };

  if (roleName === ROLE_NAME.MARKETING) {
    const {
      dashboard,
      profile,
      products,
      orders,
      confirmation,
      customerData,
      revenue,
      expenses,
    } = NavLinkList;
    return {
      dashboard,
      profile,
      products,
      orders,
      confirmation,
      customerData,
      revenue,
      expenses,
    };
  }
  if (roleName === ROLE_NAME.PRODUCTION) {
    const { dashboard, profile, products, orders, receiptNumber } = NavLinkList;
    return { dashboard, profile, products, orders, receiptNumber };
  }
  if (roleName === ROLE_NAME.OWNER) {
    const {
      dashboard,
      profile,
      products,
      orders,
      customerData,
      revenue,
      expenses,
    } = NavLinkList;
    return {
      dashboard,
      profile,
      products,
      orders,
      customerData,
      revenue,
      expenses,
    };
  }
}

function getOwnerNavLinkList() {
  return {
    manageMarketing: {
      location: '/org/owner/manage-marketing',
      text: 'Div. Marketing',
      Icon: BsBank,
    },
    manageProduction: {
      location: '/org/owner/manage-production',
      text: 'Div. Produksi',
      Icon: BsBank,
    },
  };
}
