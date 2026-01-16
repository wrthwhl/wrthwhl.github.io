import { useMDXComponent } from 'next-contentlayer2/hooks';
import { allResumes, Resume } from '@wrthwhl/content';
import { Button } from '../components/ui/Button';
import { GoldenPageLayout } from '../components/ui/GoldenPageLayout';
import {
  ResumeContext,
  Header,
  Summary,
  Section,
  Timeline,
  SkillGroup,
  Skill,
  Skills,
  Contact,
} from '../components/resume';

// MDX component mapping - only semantic components exposed
const mdxComponents = {
  Header,
  Summary,
  Section,
  Job: Timeline.Item,
  Training: Timeline.Item,
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
      <GoldenPageLayout>
        <div className="max-w-[80ch] mx-auto mt-[1.618em] pb-[1.618em] relative">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="absolute right-0 no-print"
          >
            Print
          </Button>
          <MdxContent components={mdxComponents} />
        </div>
      </GoldenPageLayout>
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
