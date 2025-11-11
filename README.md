# TempusMail Replica

A modern, responsive replica of TempusMail.com homepage built with Next.js, featuring temporary email generation, inbox functionality, and Notion blog integration.

## Features

- 🎨 Modern, responsive UI with dark/light theme toggle
- 📧 Temporary email generation using mail.tm API
- 📬 Real-time inbox for viewing received emails (auto-refreshes every 10 seconds)
- 📝 Popular articles section with Notion blog cards
- 🌙 Dark mode support with system preference detection
- 📱 Fully responsive design for all devices
- 🚀 Built with Next.js 14 and TypeScript

## Prerequisites

- Node.js 18+ and npm
- (Optional) Notion account for blog integration

## Setup

1. **Clone the repository and install dependencies:**
```bash
npm install
```

2. **Create a `.env.local` file in the root directory:**
```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

   > **Note:** The Notion API key and database ID are optional. If not provided, the blog section will display sample articles.

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Environment Variables

### Required
None! The app works without any environment variables for the email functionality.

### Optional
- `NOTION_API_KEY`: Your Notion integration token (for blog posts)
- `NOTION_DATABASE_ID`: Your Notion database ID (for blog posts)

## Notion Setup (Optional)

To enable the blog posts section:

1. **Create a Notion Integration:**
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Give it a name and select your workspace
   - Copy the "Internal Integration Token"

2. **Create a Database in Notion:**
   - Create a new database in your Notion workspace
   - Add the following properties:
     - `Title` (Title type)
     - `Description` (Text type)
     - `URL` (URL type)
     - `Published` (Checkbox type)
     - `Created` (Created time type)
   - Add your blog posts to the database

3. **Share the Database with Your Integration:**
   - Click the "..." menu on your database
   - Select "Connections" → "Add connections"
   - Select your integration

4. **Get the Database ID:**
   - Open your database in Notion
   - The URL will look like: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
   - Copy the `DATABASE_ID` (the long string of characters)

5. **Add to `.env.local`:**
```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Usage

### Generating Temporary Emails

1. Click the "Generate Email Address" button
2. Your temporary email address will be displayed
3. Copy the email address and use it for registrations or sign-ups
4. Emails sent to this address will appear in the inbox automatically

### Viewing Emails

1. The inbox automatically refreshes every 10 seconds
2. Click on any email in the inbox to view its full content
3. You can manually refresh by clicking the "Refresh" button

### Theme Toggle

- Click the theme toggle button in the header to switch between light and dark modes
- Your preference is saved in localStorage

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend API:** Next.js API Routes (built on Node.js)
- **Email Service:** mail.tm API
- **Blog Integration:** Notion API
- **Deployment:** Vercel (recommended)

> **Note:** This project uses Next.js API Routes instead of a separate Express.js or Fastify server. Next.js API Routes provide the same functionality while being more integrated with the framework and easier to deploy. If you need a separate Express.js server, you can easily refactor the API routes.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── email/
│   │   │   ├── generate/route.ts    # Email generation API
│   │   │   └── messages/route.ts    # Email fetching API
│   │   └── notion/
│   │       └── posts/route.ts       # Notion blog posts API
│   ├── under-construction/
│   │   └── page.tsx                 # Under construction page
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page
├── components/
│   ├── EmailGenerator.tsx           # Email generation component
│   ├── Footer.tsx                   # Footer component
│   ├── Header.tsx                   # Header with theme toggle
│   ├── Inbox.tsx                    # Email inbox component
│   ├── PopularArticles.tsx          # Blog posts component
│   └── ThemeProvider.tsx            # Theme context provider
└── ...
```

## Testing

1. **Test Email Generation:**
   - Generate a temporary email
   - Verify the email address is displayed correctly
   - Check that it's saved in localStorage

2. **Test Email Reception:**
   - Send an email to the generated address
   - Wait a few seconds for it to appear in the inbox
   - Click on the email to view its content

3. **Test Responsive Design:**
   - Resize the browser window
   - Test on mobile devices
   - Verify all components adapt correctly

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Docker container

## Troubleshooting

### Email Generation Fails
- Check your internet connection
- Verify that mail.tm API is accessible
- Check browser console for errors

### Notion Blog Posts Not Showing
- Verify your Notion API key is correct
- Check that the database ID is correct
- Ensure the database is shared with your integration
- Verify the database has the required properties

### Theme Toggle Not Working
- Clear browser cache and localStorage
- Check browser console for errors

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [mail.tm](https://mail.tm) for the temporary email API
- [Notion](https://notion.so) for the database and API
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the styling utilities

