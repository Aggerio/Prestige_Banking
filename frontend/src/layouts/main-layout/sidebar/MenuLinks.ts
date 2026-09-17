import { SvgIconProps } from '@mui/material';
import CreditCardIcon from 'components/icons/menu-icons/CreditCardIcon';
import HomeIcon from 'components/icons/menu-icons/HomeIcon';
import SettingsIcon from 'components/icons/menu-icons/SettingsIcon';
import SignInIcon from 'components/icons/menu-icons/SignInIcon';
import SignUpIcon from 'components/icons/menu-icons/SignUpIcon';
import TransferIcon from 'components/icons/menu-icons/TransferIcon';
import UserIcon from 'components/icons/menu-icons/UserIcon';

export enum linkEnum {
  Dashboard = 'dashboard',
  Transactions = 'transactions',
  Accounts = 'accounts',
  Credit = 'credit-cards',
  Setting = 'Setting',
  Login = 'login',
  Signup = 'sign-up',
  ForgetPassword = 'forget-password',
  ResetPassword = 'reset-password',
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
    link: '/',
    icon: HomeIcon,
    available: true,
  },
  {
    id: 2,
    title: linkEnum.Transactions,
    link: '#!',
    icon: TransferIcon,
    available: false,
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
  {
    id: 9,
    title: linkEnum.Login,
    link: '/authentication/login',
    icon: SignInIcon,
    available: true,
  },
  {
    id: 10,
    title: linkEnum.Signup,
    link: '/authentication/sign-up',
    icon: SignUpIcon,
    available: true,
  },
];
