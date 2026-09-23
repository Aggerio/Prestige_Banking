import { SvgIconProps } from '@mui/material';
import CreditCardIcon from 'components/icons/menu-icons/CreditCardIcon';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import TransferIcon from 'components/icons/menu-icons/TransferIcon';
import UserIcon from 'components/icons/menu-icons/UserIcon';

export enum linkEnum {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
  Accounts = 'accounts',
  Credit = 'Cards',
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
    link: '/accounts',
    icon: UserIcon,
    available: true,
  },
  {
    id: 5,
    title: linkEnum.Credit,
    link: '/credit-cards',
    icon: CreditCardIcon,
    available: true,
  },
];
