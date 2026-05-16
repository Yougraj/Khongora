import { MongoClient, ObjectId } from 'mongodb';
import { config } from 'dotenv';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ Error: MONGODB_URI environment variable is not defined.");
  console.error("Please check your .env file and ensure the variable name matches exactly.");
  process.exit(1);
}

const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas Cloud.");

    const db = client.db('khongora');

    // ─────────────────────────────────────────
    // 1. ARTICLES
    // ─────────────────────────────────────────
    const articlesCollection = db.collection('articles');
    const articlesData = [
      {
        title: "The Future of Artificial Intelligence in Healthcare",
        author: "Dr. Sarah Mitchell",
        category: "Technology",
        tags: ["AI", "healthcare", "machine learning", "innovation"],
        summary: "Exploring how AI is revolutionizing diagnostics, drug discovery, and patient care.",
        content: "Artificial intelligence is rapidly transforming the healthcare landscape...",
        readTimeMinutes: 8,
        views: 15420,
        likes: 932,
        published: true,
        publishedAt: new Date("2024-11-10"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Climate Change and Its Global Economic Impact",
        author: "Prof. James Okafor",
        category: "Environment",
        tags: ["climate", "economy", "sustainability", "policy"],
        summary: "A deep dive into how rising temperatures are reshaping global markets.",
        content: "The economic consequences of climate change are no longer a distant projection...",
        readTimeMinutes: 12,
        views: 9870,
        likes: 541,
        published: true,
        publishedAt: new Date("2024-10-22"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Quantum Computing: Breaking the Limits of Classical Machines",
        author: "Dr. Anika Patel",
        category: "Science",
        tags: ["quantum", "computing", "physics", "future tech"],
        summary: "Understanding qubits, superposition, and why quantum matters for the next decade.",
        content: "Quantum computers leverage the principles of quantum mechanics to process information...",
        readTimeMinutes: 10,
        views: 22100,
        likes: 1340,
        published: true,
        publishedAt: new Date("2025-01-05"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // ─────────────────────────────────────────
    // 2. BLOGS
    // ─────────────────────────────────────────
    const blogsCollection = db.collection('blogs');
    const blogsData = [
      {
        title: "My 30-Day Minimalist Challenge: What I Learned",
        author: "Emma Clarke",
        slug: "30-day-minimalist-challenge",
        category: "Lifestyle",
        tags: ["minimalism", "personal growth", "declutter", "habits"],
        excerpt: "I got rid of everything I didn't need for 30 days. Here's what changed.",
        body: "Day one was the hardest. I stood in my living room surrounded by years of accumulation...",
        coverImage: "https://example.com/images/minimalism.jpg",
        comments: 48,
        likes: 312,
        featured: true,
        readTime: "6 min",
        published: true,
        publishedAt: new Date("2025-02-14"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "How I Built a SaaS App in 72 Hours",
        author: "Ravi Sharma",
        slug: "saas-app-72-hours",
        category: "Tech & Dev",
        tags: ["saas", "startup", "coding", "nextjs", "hackathon"],
        excerpt: "A step-by-step breakdown of shipping a product over one wild weekend.",
        body: "It started with a half-baked idea on a Friday night and ended with 50 paying customers...",
        coverImage: "https://example.com/images/saas-build.jpg",
        comments: 135,
        likes: 876,
        published: true,
        publishedAt: new Date("2025-03-01"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Solo Travel in Japan: A First-Timer's Guide",
        author: "Lucia Fernandez",
        slug: "solo-travel-japan-guide",
        category: "Travel",
        tags: ["japan", "solo travel", "culture", "budget travel"],
        excerpt: "Cherry blossoms, ramen at midnight, and getting lost in Kyoto — I'd do it all again.",
        body: "Landing at Narita Airport alone with a pocket dictionary and a lot of hope...",
        coverImage: "https://example.com/images/japan-travel.jpg",
        comments: 92,
        likes: 1203,
        published: true,
        publishedAt: new Date("2025-03-18"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // ─────────────────────────────────────────
    // 3. BOOKS
    // ─────────────────────────────────────────
    const booksCollection = db.collection('books');
    const booksData = [
      {
        title: "Atomic Habits",
        author: "James Clear",
        genre: ["Self-Help", "Psychology", "Productivity"],
        isbn: "978-0735211292",
        publisher: "Avery",
        publishedYear: 2018,
        pages: 320,
        language: "English",
        rating: 4.8,
        totalReviews: 95000,
        description: "An easy and proven way to build good habits and break bad ones.",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=280&h=400&fit=crop",
        category: "Self-Help",
        readTime: "5 hrs",
        chapters: 13,
        readers: 95000,
        content: "<h2>Chapter 1</h2><p>Every action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, so does the evidence of your new identity.</p>",
        available: true,
        price: 16.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        genre: ["History", "Anthropology", "Non-Fiction"],
        isbn: "978-0062316097",
        publisher: "Harper",
        publishedYear: 2015,
        pages: 443,
        language: "English",
        rating: 4.7,
        totalReviews: 82000,
        description: "How Homo sapiens became Earth's dominant species — and what it cost us.",
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=280&h=400&fit=crop",
        category: "History",
        readTime: "7 hrs",
        chapters: 18,
        readers: 82000,
        content: "<h2>Chapter 1</h2><p>About 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang.</p>",
        available: true,
        price: 18.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: ["Fiction", "Philosophy", "Adventure"],
        isbn: "978-0062315007",
        publisher: "HarperOne",
        publishedYear: 1988,
        pages: 197,
        language: "English",
        rating: 4.6,
        totalReviews: 110000,
        description: "A young shepherd's journey to find treasure and discover his Personal Legend.",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=280&h=400&fit=crop",
        category: "Fiction",
        readTime: "3 hrs",
        chapters: 8,
        readers: 110000,
        content: "<h2>Chapter 1</h2><p>When he had been a shepherd, he had traveled along the same roads year after year, and the hills and the streams had always been the same.</p>",
        available: true,
        price: 14.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // ─────────────────────────────────────────
    // 4. NOVELS
    // ─────────────────────────────────────────
    const novelsCollection = db.collection('novels');
    const novelsData = [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: ["Literary Fiction", "Fantasy", "Philosophy"],
        isbn: "978-0525559474",
        synopsis: "Between life and death there is a library, and within that library, the shelves go on forever.",
        chapters: 43,
        wordCount: 81000,
        setting: "A magical library existing outside of time",
        protagonists: ["Nora Seed"],
        themes: ["regret", "second chances", "mental health", "identity"],
        publishedYear: 2020,
        rating: 4.5,
        category: "Fantasy",
        readTime: "12 hrs",
        episodes: 24,
        description: "Between life and death there is a library, and within that library, the shelves go on forever.",
        episodesList: [
          {
            id: 1,
            title: "The Library",
            duration: "25 min",
            content: "<h2>Episode 1: The Library</h2><p>Nora Seed found herself in a library between life and death, where every book offered a different life she could have lived.</p>",
          },
          {
            id: 2,
            title: "The Book of Regrets",
            duration: "30 min",
            content: "<h2>Episode 2: The Book of Regrets</h2><p>Each regret opened a door to another version of Nora's life — Olympic swimmer, rock star, wife, mother.</p>",
          },
        ],
        language: "English",
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: ["Science Fiction", "Adventure", "Thriller"],
        isbn: "978-0593135204",
        synopsis: "A lone astronaut must save Earth from an extinction-level threat — with no memory of who he is.",
        chapters: 31,
        wordCount: 102000,
        setting: "Deep space, solar systems light-years from Earth",
        protagonists: ["Ryland Grace", "Rocky"],
        themes: ["survival", "friendship", "science", "sacrifice"],
        publishedYear: 2021,
        rating: 4.9,
        language: "English",
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        genre: ["Fantasy", "Epic", "Adventure"],
        isbn: "978-0756404079",
        synopsis: "The riveting first-person narrative of Kvothe — the most notorious wizard his world has ever seen.",
        chapters: 92,
        wordCount: 257000,
        setting: "The fictional world of Temerant",
        protagonists: ["Kvothe"],
        themes: ["magic", "legend", "love", "tragedy", "music"],
        publishedYear: 2007,
        rating: 4.7,
        language: "English",
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // ─────────────────────────────────────────
    // 5. POEMS
    // ─────────────────────────────────────────
    const poemsCollection = db.collection('poems');
    const poemsData = [
      {
        title: "The Road Not Taken",
        author: "Robert Frost",
        form: "Lyric",
        lines: 20,
        stanzas: 4,
        themes: ["choices", "individuality", "regret", "nature"],
        content: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth...`,
        publishedYear: 1916,
        collection: "Mountain Interval",
        language: "English",
        likes: 54200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Still I Rise",
        author: "Maya Angelou",
        form: "Free Verse",
        lines: 43,
        stanzas: 9,
        themes: ["resilience", "empowerment", "identity", "dignity", "race"],
        content: `You may write me down in history
With your bitter, twisted lies,
You may trod me in the very dirt
But still, like dust, I'll rise...`,
        publishedYear: 1978,
        collection: "And Still I Rise",
        language: "English",
        likes: 87300,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "If—",
        author: "Rudyard Kipling",
        form: "Didactic",
        lines: 32,
        stanzas: 4,
        themes: ["virtue", "manhood", "perseverance", "wisdom", "character"],
        content: `If you can keep your head when all about you
Are losing theirs and blaming it on you,
If you can trust yourself when all men doubt you,
But make allowance for their doubting too...`,
        publishedYear: 1910,
        collection: "Rewards and Fairies",
        language: "English",
        likes: 61500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // ─────────────────────────────────────────
    // SEED ALL COLLECTIONS
    // ─────────────────────────────────────────
    const libraryCollection = db.collection('library');

    const collections = [
      { name: "articles",  col: articlesCollection,  data: articlesData  },
      { name: "blogs",     col: blogsCollection,     data: blogsData     },
      { name: "books",     col: booksCollection,     data: booksData     },
      { name: "novels",    col: novelsCollection,    data: novelsData    },
      { name: "poems",     col: poemsCollection,     data: poemsData     },
    ];

    const insertedIds: Record<string, ObjectId[]> = {};

    for (const { name, col, data } of collections) {
      console.log(`🧹 Clearing [${name}]...`);
      await col.deleteMany({});
      const withMeta = data.map((item, i) => ({
        ...item,
        uploadedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000),
        likeCount: (item as { likeCount?: number }).likeCount ?? 5 + i * 3,
      }));
      const result = await col.insertMany(withMeta);
      insertedIds[name] = Object.values(result.insertedIds);
      console.log(`🌱 [${name}] seeded — ${result.insertedCount} documents inserted.`);
    }

    console.log("🧹 Clearing [comments]...");
    await db.collection("comments").deleteMany({});
    const sampleComments = [
      {
        contentType: "books" as const,
        contentId: insertedIds.books[0].toString(),
        name: "Priya Sharma",
        email: "priya@example.com",
        text: "Loved this book — clear and motivating from start to finish.",
        hidden: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        contentType: "novels" as const,
        contentId: insertedIds.novels[0].toString(),
        name: "Alex Morgan",
        email: "alex@example.com",
        text: "The first episode pulled me in immediately. Can't wait for more.",
        hidden: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        contentType: "poems" as const,
        contentId: insertedIds.poems[0].toString(),
        name: "Jamie Lee",
        email: "jamie@example.com",
        text: "Beautiful poem. Read it twice this morning.",
        hidden: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        contentType: "articles" as const,
        contentId: insertedIds.articles[0].toString(),
        name: "Sam Rivera",
        email: "sam@example.com",
        text: "Great article — well researched and easy to follow.",
        hidden: false,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    ];
    await db.collection("comments").insertMany(sampleComments);
    console.log(`🌱 [comments] seeded — ${sampleComments.length} documents inserted.`);

    console.log("🧹 Clearing [library]...");
    await libraryCollection.deleteMany({});

    const libraryData = [
      {
        type: "book",
        contentId: insertedIds.books[0],
        title: booksData[0].title,
        author: booksData[0].author,
        progress: 45,
        total: 100,
        lastRead: "2 hours ago",
        status: "reading",
      },
      {
        type: "novel",
        contentId: insertedIds.novels[0],
        title: novelsData[0].title,
        author: novelsData[0].author,
        progress: 8,
        total: 24,
        lastRead: "Yesterday",
        status: "reading",
        currentEpisode: 2,
      },
      {
        type: "poem",
        contentId: insertedIds.poems[0],
        title: poemsData[0].title,
        author: poemsData[0].author,
        progress: 100,
        total: 100,
        lastRead: "3 days ago",
        status: "completed",
      },
      {
        type: "blog",
        contentId: insertedIds.blogs[0],
        title: blogsData[0].title,
        author: blogsData[0].author,
        progress: 100,
        total: 100,
        lastRead: "2 days ago",
        status: "completed",
      },
      {
        type: "book",
        contentId: insertedIds.books[1],
        title: booksData[1].title,
        author: booksData[1].author,
        progress: 0,
        total: 100,
        lastRead: "Not started",
        status: "saved",
      },
    ];

    await libraryCollection.insertMany(libraryData);
    console.log(`🌱 [library] seeded — ${libraryData.length} documents inserted.`);

    console.log("\n🎉 All collections seeded successfully!");

  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  } finally {
    await client.close();
    console.log("🔌 MongoDB connection closed safely.");
  }
}

seedDatabase();