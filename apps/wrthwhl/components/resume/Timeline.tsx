import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface TimelineItemProps {
  title: string;
  org: string;
  start: string;
  end?: string;
  children: ReactNode;
}

const TimelineItem = ({
  title,
  org,
  start,
  end,
  children,
}: TimelineItemProps) => {
  return (
    <div
      className="flex flex-row mx-[0.382em] my-[1.382em]"
      style={{ breakInside: 'avoid' }}
    >
      <div className="mr-[1.382em] font-mono">
        <div className="h-full flex flex-col justify-between text-center">
          <span className="text-gray-7">{end || 'Now'}</span>
          <div className="w-1/2 h-full border-r border-gray-8" />
          <span className="text-gray-7">{start}</span>
        </div>
      </div>
      <div>
        <div>
          <span className="text-sm font-bold cursor-default text-teal-5 hover:text-teal-3 transition-colors">
            {title}
          </span>{' '}
          <span className="text-sm text-gray-6">@ {org}</span>
        </div>
        <div
          className={cn(
            'text-sm leading-snug text-gray-4 mb-[0.236em]',
            '[&_ul]:pl-4 [&_ul]:mt-[0.618em] [&_ul]:list-disc',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export interface TimelineProps {
  children: ReactNode;
}

export const Timeline = ({ children }: TimelineProps) => {
  return (
    <div style={{ breakAfter: 'auto', breakBefore: 'avoid' }}>{children}</div>
  );
};

Timeline.Item = TimelineItem;
