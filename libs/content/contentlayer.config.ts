import { defineDocumentType, makeSource } from 'contentlayer2/source-files';
import { defineNestedType } from 'contentlayer2/source-files';

const Contact = defineNestedType(() => ({
  name: 'Contact',
  fields: {
    phone: { type: 'string' },
    email: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
  },
}));

export const Resume = defineDocumentType(() => ({
  name: 'Resume',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  isSingleton: false,
  fields: {
    lastEditedAt: {
      type: 'date',
      description: 'The date of the last edit',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    nationality: {
      type: 'string',
    },
    yob: {
      type: 'number',
    },
    avatar: {
      type: 'string',
    },
    contact: {
      type: 'nested',
      of: Contact,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: 'src',
  documentTypes: [Resume],
  mdx: { rehypePlugins: [], remarkPlugins: [] },
});
