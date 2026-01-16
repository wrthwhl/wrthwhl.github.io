import { MantineThemeOverride } from '@mantine/core';
import { sageDark, teal as radixTeal } from '@radix-ui/colors';
const [, , ...dark] = Object.values(sageDark).reverse();
const [, , ...teal] = Object.values(radixTeal);

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  colors: {
    dark: dark as any,
    teal: teal as any,
  },
  primaryColor: 'teal',
  headings: { fontFamily: '"Kufam", sans-serif', fontWeight: 100 },
  other: {
    fib: (values, suffix = '', factor = 1) => {
      const params: Array<number | string> =
        typeof values === 'number' ? [values] : values;
      const res: Array<number | string> = [];
      for (const val of params) {
        if (typeof val === 'number')
          res.push(
            `${Math.round(0.618 ** -val * factor * 1000) / 1000}${suffix}`
          );
        else res.push(val);
      }
      return res.join(' ');
    },
  },
};

export const styles = {};

declare module '@mantine/core' {
  export interface MantineThemeOther {
    fib: (
      values: Array<number | string> | number,
      suffix?: string,
      factor?: number
    ) => string;
  }
}
