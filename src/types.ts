export interface Frontmatter {
  title: string;
  description?: string;
  layout?: string;
  tags: string[];
  heroImage: string;
  imageWidth: number;
  imageHeight: number;
  createdAt: string;
  imageFormat?: string;
}