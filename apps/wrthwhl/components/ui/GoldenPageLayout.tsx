import { ReactNode } from 'react';

export const GoldenPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-row items-stretch justify-center grow w-full h-full">
      <div className="grow basis-[38.2%]" />
      <div className="shrink-0 flex flex-col max-w-full">
        <div className="grow basis-[38.2%]" />
        <div className="shrink-0 max-w-[80ch]">{children}</div>
        <div className="grow basis-[61.8%]" />
      </div>
      <div className="grow basis-[61.8%]" />
    </div>
  );
};
