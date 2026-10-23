# blog-api
This is a blog api webpage from The Odin Project. It is made to allow users to comment and create posts.

Blog-Public: https://github.com/kingsamanimations/blog-public

Blog-Admin: https://github.com/kingsamanimations/blog-admin

## Tech:
- Node.js, Express
- PostgreSQL with Prisma 7
- JSON Web Tokens (`jsonwebtoken`) and `bcryptjs` for password hashing

Setup

## Setup

1. Install dependencies:

```bash
   npm install
```

2. Create a `.env` file (see `.env.example`)
```
   DATABASE_URL="postgresql://user:password@localhost:5432/blog-api"
JWT_SECRET="long-string"
PORT=3000
```

3. Create tables and generate the Prisma client
```bash
   npx prisma migrate dev --name init
   npx prisma generate
```
4. Create the author account (Edit password in `prisma/seed.js` first):
```bash
   node prisma/seed.js
```

5. Start the server:
```bash
   node src/app.js
```
## Authentication
Log in with `POST /auth/login` to receive a token, then send it to protected requests:

```
Authorization: Bearer <token>
```
Tokens expire within a day.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | none | Returns a JWT |
| GET | `/posts` | none | Published posts |
| GET | `/posts/:postId` | none | One published post |
| GET | `/posts/all` | author | All posts, including drafts |
| GET | `/posts/all/:postId` | author | One post, including drafts |
| POST | `/posts` | author | Create a post |
| PUT | `/posts/:postId` | author | Edit a post or toggle `published` |
| DELETE | `/posts/:postId` | author | Delete a post and its comments |
| GET | `/posts/:postId/comments` | none | Comments on a published post |
| POST | `/posts/:postId/comments` | none | Add a comment (`username`, `content`) |
| PUT | `/posts/:postId/comments/:commentId` | author | Edit a comment |
| DELETE | `/posts/:postId/comments/:commentId` | author | Delete a comment |

## Related projects
- Public blog: (link)
- Admin site: (link)

## Credits + Notes:
I had help from research to create this. Deploying was the most trickiest part, so I'm going to put deploying aside for now. I'll come back and deploy it so you all can see it soon.

You can check it out here when it's released: TBA