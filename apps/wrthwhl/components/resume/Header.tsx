import { ReactNode } from 'react';
import { Avatar, AvatarImage } from '../ui/Avatar';
import { useResume } from './Context';

export const Header = ({ children }: { children?: ReactNode }) => {
  const resume = useResume();
  if (!resume) return null;

  return (
    <div className="flex items-start">
      {resume.avatar && (
        <Avatar size="xl" className="mb-[0.618em]">
          <AvatarImage src={resume.avatar} alt={resume.name} />
        </Avatar>
      )}
      <div className="flex flex-col mx-[1em] my-[0.09em]">
        <h1
          className="font-heading font-bold text-4xl text-teal-5 cursor-default hover:text-teal-3 transition-colors"
          style={{ fontVariant: 'all-small-caps' }}
        >
          {resume.name}
        </h1>
        {resume.nationality && (
          <span className="text-xs text-gray-6">
            Nationality: {resume.nationality}
          </span>
        )}
        {resume.yob && (
          <span className="text-xs text-gray-6">YoB: {resume.yob}</span>
        )}
      </div>
    </div>
  );
};
