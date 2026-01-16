import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export const Summary = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={cn(
        'my-[1.618em] mb-[2.618em] text-base text-justify text-gray-2 cursor-default',
        '[&_strong]:text-teal-5 [&_strong]:font-black [&_strong]:text-lg [&_strong]:hover:text-teal-3',
        '[&_em]:text-teal-5 [&_em]:font-semibold [&_em]:hover:text-teal-3',
      )}
    >
      {children}
    </div>
  );
};
