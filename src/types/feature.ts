export type ResourceLink = {
  type: string;
  url: string;
};

export type Feature = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  type?: string;
  slug?: string;
  average_rating?: number;
  links?: ResourceLink[];
};
