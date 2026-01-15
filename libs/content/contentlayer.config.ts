import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Resume = defineDocumentType(() => ({
  name: 'Resume',
  filePathPattern: `**/resumeTPO.mdx`,
  contentType: 'mdx',
  isSingleton: true,
  fields: {
    lastEditedAt: {
      type: 'date',
      description: 'The date of the last edit',
      required: true,
    },
  },
  computedFields: {},
}));

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: 'src',
  documentTypes: [Resume],
  mdx: { rehypePlugins: [], remarkPlugins: [] },
});
