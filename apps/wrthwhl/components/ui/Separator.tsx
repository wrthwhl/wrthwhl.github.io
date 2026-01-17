import * as React from 'react';
import { cn } from '../../lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: React.ReactNode;
  labelPosition?: 'left' | 'center' | 'right';
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = 'horizontal',
      label,
      labelPosition = 'center',
      ...props
    },
    ref,
  ) => {
    if (label) {
      const positionClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      };

      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-3 my-phi-xl',
            positionClasses[labelPosition],
            className,
          )}
          {...props}
        >
          <div className="h-0 flex-1 border-t border-subtle" />
          <span className="text-muted-xs flex items-center gap-1.5">
            {label}
          </span>
          <div className="h-0 flex-1 border-t border-subtle" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0',
          orientation === 'horizontal'
            ? 'h-0 w-full border-t border-subtle'
            : 'h-full w-0 border-l border-subtle',
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = 'Separator';

export { Separator };
