export interface Book {
  _id?: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  readers: number;
  category: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const bookSchema = {
  title: { type: 'string', required: true },
  author: { type: 'string', required: true },
  cover: { type: 'string', required: true },
  rating: { type: 'number', default: 0 },
  readers: { type: 'number', default: 0 },
  category: { type: 'string', required: true },
  description: { type: 'string' },
  createdAt: { type: 'date' },
  updatedAt: { type: 'date' }
};
