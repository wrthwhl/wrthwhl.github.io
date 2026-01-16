import { ReactNode } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SkillGroup = ({
  rating,
  children,
}: {
  rating: number;
  children: ReactNode;
}) => {
  return (
    <div className="max-w-[17.95em] mx-[1.618em] text-center">
      <div
        className={cn(
          'flex justify-center',
          '[&>div]:relative [&>div]:w-[22px] [&>div]:h-[22px]',
          '[&_svg]:absolute [&_svg]:top-0 [&_svg]:left-0',
          '[&_svg:first-of-type]:text-teal-5 [&_svg:first-of-type]:fill-transparent',
          '[&_svg:last-of-type]:text-teal-3 [&_svg:last-of-type]:fill-teal-3',
          '[&_svg:last-of-type]:[clip-path:circle(0%_at_50%_50%)]',
          '[&_svg:last-of-type]:transition-[clip-path] [&_svg:last-of-type]:duration-300 [&_svg:last-of-type]:ease-in-out',
          '[&>div:hover_svg:last-of-type]:[clip-path:circle(75%_at_50%_50%)]',
          '[&>div:hover~div_svg:last-of-type]:[clip-path:circle(75%_at_50%_50%)]',
        )}
      >
        {[...Array(rating).keys()].map((i) => (
          <div key={i}>
            <Star size={22} />
            <Star size={22} />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export const Skill = ({
  category,
  children,
}: {
  category: string;
  children: ReactNode;
}) => {
  return (
    <div className="mt-[0.618em]">
      <div
        className="text-gray-6 text-sm"
        style={{ fontVariant: 'all-small-caps' }}
      >
        {category}
      </div>
      <div className="text-gray-2 text-xs">{children}</div>
    </div>
  );
};

export const Skills = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="my-[1.618em] mx-[1em] flex flex-row justify-evenly"
      style={{ breakInside: 'avoid' }}
    >
      {children}
    </div>
  );
};
