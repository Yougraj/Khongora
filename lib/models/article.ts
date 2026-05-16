export interface Article {
  _id?: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
  excerpt: string;
  content?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
