import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const dateFormatFromUTC = (dateString: Date) => {
  return dayjs.utc(dateString).local().format('D MMM, h.mm A');
};

export const currencyFormat = (amount: number, options: Intl.NumberFormatOptions = {}) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  }).format(amount);
};

export const numberFormat = (number: number, notation: 'standard' | 'compact' = 'standard') =>
  new Intl.NumberFormat('en-IN', {
    notation,
  }).format(number);
