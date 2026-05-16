export interface Poem {
  _id?: string;
  title: string;
  author: string;
  category: string;
  content: string;
  analysis?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
