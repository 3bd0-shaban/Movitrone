export interface iSeoPage {
  id?: number;
  tag_Title?: string;
  tag_Description?: boolean;
  canonical_Url?: string;
  keywoprds?: string[];
  Seo_Status?: 'Optimized' | 'Not Optimized';
  createdAt?: string;
}
