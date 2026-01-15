import {
  Avatar,
  Box,
  Container,
  Title,
  Text,
  Timeline,
  Sx,
  Divider,
  ActionIcon,
  Button,
  List,
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
} from '@tabler/icons';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { resume } from '@wrthwhl/content';
import Obfuscate from 'react-obfuscate';

const Golden = ({
  children,
  sx,
  ...rest
}: {
  children: JSX.Element | JSX.Element[];
  sx?: Sx;
}) => {
  // const pdfRef = useRef();
  // const handleDownload = async () => {
  //   const element = pdfRef.current;
  //   const canvas = await html2canvas(element);
  //   const data = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF();
  //   const imgProperties = pdf.getImageProperties(data);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  //   pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save('print.pdf');
  // };
  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          justifyItems: 'center',
          flexGrow: 1,
          width: '100%',
          height: '100%',
        },
        sx,
      ]}
      {...rest}
    >
      <Box sx={{ flex: '1 1 38.2%' }} />
      <Box
        sx={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
        }}
      >
        <Box sx={{ flex: '1 1 38.2%' }} />
        <Container
          sx={{
            flex: '0 0 auto',
            maxWidth: '80ch',
          }}
        >
          {children}
        </Container>
        <Box sx={{ flex: '1 1 61.8%' }} />
      </Box>
      <Box sx={{ flex: '1 1 61.8%' }} />
    </Box>
  );
};

const mdxComponents = {
  Avatar,
  Section: ({ children, mx, my }) => (
    <Box
      sx={(t) => ({
        margin: `${t.other.fib(my || 3, 'em')} ${t.other.fib(mx || 0, 'em')}`,
      })}
    >
      {children}
    </Box>
  ),
  Title,
  Text,
  TimelineItem: ({ children, title, org, startYear, endYear, sx }) => (
    <Box
      sx={[
        (t) => ({
          display: 'flex',
          flexDirection: 'row',
          margin: `${t.other.fib(1, 'em')} ${t.other.fib(1, 'em')}`,
          breakInside: 'avoid',
        }),
        sx,
      ]}
    >
      <Box
        sx={(t) => ({
          marginRight: t.other.fib(1, 'em'),
          fontFamily: t.fontFamilyMonospace,
        })}
      >
        <Box
          sx={(t) => ({
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'center',
          })}
        >
          <Text color="dimmed" inherit>
            {endYear || 'Now'}
          </Text>
          <Box
            sx={(t) => ({
              width: '50%',
              height: '100%',
              borderRight: `solid 1px ${t.colors.gray[8]}`,
            })}
          ></Box>
          <Text color="dimmed" inherit>
            {startYear}
          </Text>
        </Box>
      </Box>
      <Box>
        <Text
          size="sm"
          color="teal"
          weight="bold"
          sx={(t) => ({
            cursor: 'default',
            '&:hover': { color: t.colors.teal[3] },
          })}
        >
          {title}{' '}
          <Text size="sm" color="dimmed" component="span">
            @ {org}
          </Text>
        </Text>
        <Text size="sm" sx={(t) => ({ color: t.colors.gray[4] })}>
          {children}
        </Text>
      </Box>
    </Box>
  ),
  Divider: ({ ...props }) => (
    <Divider sx={(t) => ({ margin: `${t.other.fib(1, 'em')} 0` })} {...props} />
  ),
  Timeline,
  IconBriefcase,
  IconBulb,
  IconSchool,
  IconId,
  IconStar,
  IconPhone,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
  List,
  Obfuscate,
  ActionIcon,
  Box,
};

export function Index({ doc }) {
  const MdxContent = useMDXComponent(doc.body.code);
  const handlePrint = () => {
    if (window !== undefined) window.print();
  };

  return (
    <Golden>
      <Box
        sx={(t) => ({
          maxWidth: '80ch',
          margin: `${t.other.fib(1, 'em')} auto 0`,
          paddingBottom: t.other.fib(1, 'em'),
          position: 'relative',
        })}
      >
        <Button
          variant="outline"
          onClick={handlePrint}
          sx={{
            '@media print': { display: 'none' },
            margin: '1em auto',
            display: 'block',
            position: 'absolute',
            right: 0,
          }}
        >
          Print
        </Button>
        <MdxContent components={mdxComponents} />
      </Box>
    </Golden>
  );
}

export const getStaticProps = () => {
  return { props: { doc: resume } };
};

export default Index;
