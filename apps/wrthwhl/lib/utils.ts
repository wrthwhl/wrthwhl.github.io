import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Golden ratio spacing utility
export const fib = (
  values: Array<number | string> | number,
  suffix = '',
  factor = 1,
): string => {
  const params: Array<number | string> =
    typeof values === 'number' ? [values] : values;
  const res: Array<number | string> = [];
  for (const val of params) {
    if (typeof val === 'number')
      res.push(`${Math.round(0.618 ** -val * factor * 1000) / 1000}${suffix}`);
    else res.push(val);
  }
  return res.join(' ');
};
