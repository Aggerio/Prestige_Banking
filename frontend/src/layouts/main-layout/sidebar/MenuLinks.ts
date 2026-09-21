import { SvgIconProps } from '@mui/material';
import CreditCardIcon from 'components/icons/menu-icons/CreditCardIcon';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import SettingsIcon from 'components/icons/menu-icons/SettingsIcon';
import TransferIcon from 'components/icons/menu-icons/TransferIcon';
import UserIcon from 'components/icons/menu-icons/UserIcon';

export enum linkEnum {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
  Accounts = 'accounts',
  Credit = 'credit-cards',
  Setting = 'Setting',
}

export interface MenuLinkType {
  id: number;
  title: string;
  link: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  available: boolean;
}
export const menuLinks: MenuLinkType[] = [
  {
    id: 1,
    title: linkEnum.Dashboard,
    link: '/dashboard',
    icon: HomeIcon,
    available: true,
  },
  {
    id: 2,
    title: linkEnum.Transactions,
    link: '/transactions',
    icon: TransferIcon,
    available: true,
  },
  {
    id: 3,
    title: linkEnum.Accounts,
    link: '#!',
    icon: UserIcon,
    available: false,
  },
  {
    id: 5,
    title: linkEnum.Credit,
    link: '#!',
    icon: CreditCardIcon,
    available: false,
  },
  {
    id: 8,
    title: linkEnum.Setting,
    link: '#!',
    icon: SettingsIcon,
    available: false,
  },
];
