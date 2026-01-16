import { ReactNode, useEffect, useState } from 'react';
import { Phone, Mail, Linkedin, Github } from 'lucide-react';
import Obfuscate from 'react-obfuscate';
import { useResume } from './Context';

// Client-only wrapper to prevent hydration mismatch with react-obfuscate
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;
  return <>{children}</>;
};

export const Contact = () => {
  const resume = useResume();
  if (!resume?.contact) return null;

  const { phone, email, linkedin, github } = resume.contact;

  const iconClass =
    'text-teal-5 hover:text-teal-4 hover:stroke-1 transition-colors';

  return (
    <div className="flex flex-row my-[2.618em] mx-[1.618em] justify-evenly">
      {phone && (
        <ClientOnly>
          <Obfuscate tel={phone} aria-label="Call me!">
            <Phone size={50} strokeWidth={0.5} className={iconClass} />
          </Obfuscate>
        </ClientOnly>
      )}
      {email && (
        <ClientOnly>
          <Obfuscate email={email} aria-label="Mail me!">
            <Mail size={50} strokeWidth={0.5} className={iconClass} />
          </Obfuscate>
        </ClientOnly>
      )}
      {linkedin && (
        <a href={`https://www.linkedin.com/in/${linkedin}/`}>
          <Linkedin size={50} strokeWidth={0.5} className={iconClass} />
        </a>
      )}
      {github && (
        <a href={`https://github.com/${github}/`}>
          <Github size={50} strokeWidth={0.5} className={iconClass} />
        </a>
      )}
    </div>
  );
};
