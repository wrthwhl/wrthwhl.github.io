'use client';

import { ReactNode } from 'react';
import { AvatarImage } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useResume } from './Context';
import { useScrollProgress } from '../../lib/useScrollProgress';
import { cn } from '../../lib/utils';

export const Header = ({ children }: { children?: ReactNode }) => {
  const resume = useResume();
  const { progress } = useScrollProgress(80);

  if (!resume) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  // Scale factor for avatar: 1 -> 0.6 (80px -> 48px)
  const avatarScale = 1 - progress * 0.4;
  const avatarSize = 80;

  // Fade out nationality/yob faster - complete by 40% scroll
  const infoOpacity = Math.max(0, 1 - progress * 2.5);
  // Smoothly reduce height from 2.5em to 0
  const infoHeight = 2.5 * (1 - progress);

  // Background: dark-8 (#171918 = 23,25,24) -> dark-9 (#101211 = 16,18,17)
  const bgR = Math.round(23 - progress * 7);
  const bgG = Math.round(25 - progress * 7);
  const bgB = Math.round(24 - progress * 7);

  return (
    <div
      className={cn('sticky top-0 z-50 px-4', progress > 0.2 && 'shadow-md')}
      style={{
        backgroundColor: `rgb(${bgR}, ${bgG}, ${bgB})`,
        paddingTop: `${1.618 - progress * 1}em`,
        paddingBottom: `${1 - progress * 0.5}em`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {resume.avatar && (
            <div
              className="shrink-0 overflow-hidden rounded-[0.618em]"
              style={{
                width: avatarSize * avatarScale,
                height: avatarSize * avatarScale,
              }}
            >
              <AvatarImage
                src={resume.avatar}
                alt={resume.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col ml-[1em]">
            <h1
              className="font-heading font-bold text-teal-5 cursor-default hover:text-teal-3 transition-colors"
              style={{
                fontVariant: 'all-small-caps',
                fontSize: `${2.25 - progress * 0.5}rem`,
                lineHeight: 1.1,
              }}
            >
              {resume.name}
            </h1>
            <div
              className="overflow-hidden"
              style={{
                opacity: infoOpacity,
                maxHeight: `${infoHeight}em`,
              }}
            >
              {resume.nationality && (
                <span className="text-xs text-gray-6 block">
                  Nationality: {resume.nationality}
                </span>
              )}
              {resume.yob && (
                <span className="text-xs text-gray-6 block">
                  YoB: {resume.yob}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handlePrint}
          className="no-print shrink-0"
        >
          Print
        </Button>
      </div>
    </div>
  );
};
