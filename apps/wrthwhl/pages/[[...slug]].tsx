import {
  Avatar,
  Box,
  Container,
  Title,
  Text,
  Divider,
  ActionIcon,
  Button,
} from '@mantine/core';
import {
  IconSchool,
  IconBriefcase,
  IconBulb,
  IconId,
  IconStar,
  IconPhone,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
} from '@tabler/icons-react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { allResumes, Resume } from '@wrthwhl/content';
import Obfuscate from 'react-obfuscate';
import {
  useEffect,
  useState,
  ReactNode,
  createContext,
  useContext,
} from 'react';

// Keep fib function for golden ratio spacing
const fib = (
  values: Array<number | string> | number,
  suffix = '',
  factor = 1,
): string => {
  const params: Array<number | string> =
    typeof values === 'number' ? [values] : values;
  const res: Array<number | string> = [];
  for (const val of params) {
    if (typeof val === 'number')
      res.push(`${Math.round(0.618 ** -val * factor * 1000) / 1000}${suffix}`);
    else res.push(val);
  }
  return res.join(' ');
};

// Context to pass document data to components
const ResumeContext = createContext<Resume | null>(null);
const useResume = () => useContext(ResumeContext);

// Client-only wrapper to prevent hydration mismatch with react-obfuscate
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;
  return <>{children}</>;
};

// Golden ratio layout wrapper
const Golden = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyItems: 'center',
        flexGrow: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <Box style={{ flex: '1 1 38.2%' }} />
      <Box
        style={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
        }}
      >
        <Box style={{ flex: '1 1 38.2%' }} />
        <Container style={{ flex: '0 0 auto', maxWidth: '80ch' }}>
          {children}
        </Container>
        <Box style={{ flex: '1 1 61.8%' }} />
      </Box>
      <Box style={{ flex: '1 1 61.8%' }} />
    </Box>
  );
};

// --- Semantic Components ---

const Header = ({ children }: { children?: ReactNode }) => {
  const resume = useResume();
  if (!resume) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'start' }}>
      {resume.avatar && (
        <Avatar
          src={resume.avatar}
          alt={resume.name}
          size="xl"
          sx={(t) => ({
            borderRadius: t.other.fib(-1, 'em'),
            marginBottom: t.other.fib(-1, 'em'),
          })}
        />
      )}
      <Box
        sx={(t) => ({
          display: 'flex',
          flexDirection: 'column',
          margin: `${t.other.fib(-5, 'em')} ${t.other.fib(0, 'em')}`,
        })}
      >
        <Title
          style={{
            fontWeight: 'bold',
            fontVariant: 'all-small-caps',
            display: 'inline',
          }}
          sx={(t) => ({
            color: t.colors.teal[5],
            cursor: 'default',
            '&:hover': { color: t.colors.teal[3] },
          })}
        >
          {resume.name}
        </Title>
        {resume.nationality && (
          <Text size="xs" sx={(t) => ({ color: t.colors.gray[5] })}>
            Nationality: {resume.nationality}
          </Text>
        )}
        {resume.yob && (
          <Text size="xs" sx={(t) => ({ color: t.colors.gray[5] })}>
            YoB: {resume.yob}
          </Text>
        )}
      </Box>
    </Box>
  );
};

const Summary = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={(t) => ({
        margin: `${t.other.fib(1, 'em')} 0 ${t.other.fib(2, 'em')}`,
        fontSize: 'var(--mantine-font-size-md)',
        textAlign: 'justify',
        color: t.colors.gray[2],
        cursor: 'default',
        '& strong': {
          color: t.colors.teal[5],
          fontWeight: 900,
          fontSize: 'var(--mantine-font-size-lg)',
        },
        '& strong:hover': {
          color: t.colors.teal[3],
        },
        '& em': {
          color: t.colors.teal[5],
          fontWeight: 600,
        },
        '& em:hover': {
          color: t.colors.teal[3],
        },
      })}
    >
      {children}
    </Box>
  );
};

const iconMap: Record<string, typeof IconBriefcase> = {
  briefcase: IconBriefcase,
  school: IconSchool,
  lightbulb: IconBulb,
  contact: IconId,
};

const Section = ({
  title,
  icon,
  children,
  noPrint,
}: {
  title: string;
  icon?: string;
  children: ReactNode;
  noPrint?: boolean;
}) => {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <Box sx={noPrint ? { '@media print': { display: 'none' } } : undefined}>
      <Divider
        style={{ margin: `${fib(1, 'em')} 0` }}
        label={
          <>
            {Icon && <Icon size={14} />}
            <Text color="dimmed" ml={5} size="xs">
              {title}
            </Text>
          </>
        }
        labelPosition="center"
      />
      {children}
    </Box>
  );
};

const Job = ({
  title,
  org,
  start,
  end,
  children,
}: {
  title: string;
  org: string;
  start: string;
  end?: string;
  children: ReactNode;
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        margin: `${fib(1, 'em')} ${fib(1, 'em')}`,
        breakInside: 'avoid',
      }}
    >
      <Box
        style={{
          marginRight: fib(1, 'em'),
          fontFamily: 'var(--mantine-font-family-monospace)',
        }}
      >
        <Box
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'center',
          }}
        >
          <Text c="dimmed" inherit>
            {end || 'Now'}
          </Text>
          <Box
            style={{
              width: '50%',
              height: '100%',
              borderRight: 'solid 1px var(--mantine-color-gray-8)',
            }}
          />
          <Text c="dimmed" inherit>
            {start}
          </Text>
        </Box>
      </Box>
      <Box>
        <Text
          size="sm"
          fw="bold"
          component="span"
          sx={(t) => ({
            cursor: 'default',
            color: t.colors.teal[5],
            '&:hover': { color: t.colors.teal[3] },
          })}
        >
          {title}
        </Text>{' '}
        <Text size="sm" c="dimmed" component="span">
          @ {org}
        </Text>
        <Box
          sx={(t) => ({
            fontSize: 'var(--mantine-font-size-sm)',
            lineHeight: 'var(--mantine-line-height-sm)',
            color: 'var(--mantine-color-gray-4)',
            marginBottom: t.other.fib(-3, 'em'),
            '& ul': {
              paddingLeft: '1em',
              margin: `${t.other.fib(-1, 'em')} auto 0`,
            },
          })}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

const SkillGroup = ({
  rating,
  children,
}: {
  rating: number;
  children: ReactNode;
}) => {
  return (
    <Box
      sx={(t) => ({
        maxWidth: t.other.fib(6, 'em'),
        margin: `0 ${t.other.fib(1, 'em')}`,
        textAlign: 'center',
      })}
    >
      <Box
        sx={(t) => ({
          display: 'flex',
          justifyContent: 'center',
          '& > div': { position: 'relative', width: 22, height: 22 },
          '& svg': { position: 'absolute', top: 0, left: 0 },
          '& svg:first-of-type': {
            color: t.colors.teal[5],
            fill: 'transparent',
          },
          '& svg:last-of-type': {
            color: t.colors.teal[3],
            fill: t.colors.teal[3],
            clipPath: 'circle(0% at 50% 50%)',
            transition: 'clip-path 0.3s ease',
          },
          '& > div:hover svg:last-of-type, & > div:hover ~ div svg:last-of-type':
            {
              clipPath: 'circle(75% at 50% 50%)',
            },
        })}
      >
        {[...Array(rating).keys()].map((i) => (
          <Box key={i}>
            <IconStar size={22} />
            <IconStar size={22} />
          </Box>
        ))}
      </Box>
      {children}
    </Box>
  );
};

const Skill = ({
  category,
  children,
}: {
  category: string;
  children: ReactNode;
}) => {
  return (
    <Box sx={(t) => ({ marginTop: t.other.fib(-1, 'em') })}>
      <Text color="dimmed" sx={{ fontVariant: 'all-small-caps' }} size="sm">
        {category}
      </Text>
      <Text sx={(t) => ({ color: t.colors.gray[2] })} size="xs">
        {children}
      </Text>
    </Box>
  );
};

const Skills = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={(t) => ({
        margin: `${t.other.fib(1, 'em')} ${t.other.fib(0, 'em')}`,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      })}
    >
      {children}
    </Box>
  );
};

const Contact = () => {
  const resume = useResume();
  if (!resume?.contact) return null;

  const { phone, email, linkedin, github } = resume.contact;

  const iconStyle = (t: any) => ({
    color: t.colors.teal[5],
    '& svg:hover': { color: t.colors.teal[4], strokeWidth: 1 },
  });

  return (
    <Box
      sx={(t) => ({
        display: 'flex',
        flexDirection: 'row',
        margin: `${t.other.fib(2, 'em')} ${t.other.fib(1, 'em')}`,
        justifyContent: 'space-evenly',
      })}
    >
      {phone && (
        <ClientOnly>
          <Obfuscate tel={phone} aria-label="Call me!">
            <ActionIcon size={50} variant="transparent" sx={iconStyle}>
              <IconPhone size={50} stroke={0.5} />
            </ActionIcon>
          </Obfuscate>
        </ClientOnly>
      )}
      {email && (
        <ClientOnly>
          <Obfuscate email={email} aria-label="Mail me!">
            <ActionIcon size={50} variant="transparent" sx={iconStyle}>
              <IconMail size={50} stroke={0.5} />
            </ActionIcon>
          </Obfuscate>
        </ClientOnly>
      )}
      {linkedin && (
        <a href={`https://www.linkedin.com/in/${linkedin}/`}>
          <ActionIcon size={50} variant="transparent" sx={iconStyle}>
            <IconBrandLinkedin size={50} stroke={0.5} />
          </ActionIcon>
        </a>
      )}
      {github && (
        <a href={`https://github.com/${github}/`}>
          <ActionIcon size={50} variant="transparent" sx={iconStyle}>
            <IconBrandGithub size={50} stroke={0.5} />
          </ActionIcon>
        </a>
      )}
    </Box>
  );
};

// MDX component mapping - only semantic components exposed
const mdxComponents = {
  Header,
  Summary,
  Section,
  Job,
  SkillGroup,
  Skill,
  Skills,
  Contact,
};

export function Index({ doc }: { doc: Resume }) {
  const MdxContent = useMDXComponent(doc.body.code);
  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <ResumeContext.Provider value={doc}>
      <Golden>
        <Box
          style={{
            maxWidth: '80ch',
            margin: `${fib(1, 'em')} auto 0`,
            paddingBottom: fib(1, 'em'),
            position: 'relative',
          }}
        >
          <Button
            variant="outline"
            onClick={handlePrint}
            styles={{
              root: {
                margin: '1em auto',
                display: 'block',
                position: 'absolute',
                right: 0,
              },
            }}
            className="no-print"
          >
            Print
          </Button>
          <MdxContent components={mdxComponents} />
        </Box>
      </Golden>
    </ResumeContext.Provider>
  );
}

export const getStaticPaths = () => {
  const paths = allResumes.map((resume) => ({
    params: { slug: [resume.slug] },
  }));
  paths.push({ params: { slug: [] } });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = ({
  params,
}: {
  params?: { slug?: string[] };
}) => {
  const slug = params?.slug?.[0] || 'resume';
  const doc = allResumes.find((r) => r.slug === slug) || allResumes[0];

  return {
    props: { doc },
  };
};

export default Index;
