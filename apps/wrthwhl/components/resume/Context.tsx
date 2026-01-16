import { createContext, useContext } from 'react';
import { Resume } from '@wrthwhl/content';

export const ResumeContext = createContext<Resume | null>(null);
export const useResume = () => useContext(ResumeContext);
