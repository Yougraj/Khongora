# MongoDB Atlas Setup

## Step 1: Configure Environment Variables

Add your MongoDB URI to `.env.local`:

```env
MONGODB_URI=mongodb+srv://yougraj:ijiwy45riw@cluster0.ec2tahw.mongodb.net/?retryWrites=true&w=majority
```

## Step 2: Install Dependencies

Dependencies are already installed. If needed:

```bash
npm install mongodb
```

## Step 3: Seed the Database

Run the initial seed script (if one exists) to populate MongoDB with basic data:

```bash
npx ts-node scripts/seed-db.ts
```

This will create collections:
- `books` - Book collection
- `novels` - Novel/episodic stories
- `poems` - Poems with analysis
- `articles` - Blog articles

## Step 4: API Routes

The following API endpoints are available:

- `GET /api/books` - List all books
- `GET /api/books/[id]` - Get single book
- `GET /api/novels` - List all novels
- `GET /api/novels/[id]` - Get single novel
- `GET /api/poems` - List all poems
- `GET /api/poems/[id]` - Get single poem
- `GET /api/articles` - List all articles
- `GET /api/articles/[id]` - Get single article

## Database Schema

### Books Collection
```javascript
{
  title: String,
  author: String,
  cover: String,
  rating: Number,
  readers: Number,
  category: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Novels Collection
```javascript
{
  title: String,
  author: String,
  category: String,
  rating: Number,
  episodes: Number,
  readTime: String,
  description: String,
  episodesList: [{
    id: String,
    title: String,
    duration: String,
    content: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Poems Collection
```javascript
{
  title: String,
  author: String,
  category: String,
  content: String,
  analysis: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Articles Collection
```javascript
{
  title: String,
  author: String,
  category: String,
  readTime: String,
  excerpt: String,
  content: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

1. **Connection errors**: Check your MongoDB Atlas network access settings
2. **Missing data**: Run the seed script again
3. **API errors**: Check that the database name is 'khongora'
