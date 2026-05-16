export interface Episode {
  id: string;
  title: string;
  duration: string;
  content?: string;
}

export interface Novel {
  _id?: string;
  title: string;
  author: string;
  category: string;
  rating: number;
  episodes: number;
  readTime: string;
  description: string;
  episodesList: Episode[];
  createdAt?: Date;
  updatedAt?: Date;
}
