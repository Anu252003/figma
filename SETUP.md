# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Step 3: (Optional) Configure Notion API

1. Create a Notion integration at https://www.notion.so/my-integrations
2. Create a database with these properties:
   - `Title` (Title)
   - `Description` (Text)
   - `URL` (URL)
   - `Published` (Checkbox)
   - `Created` (Created time)
3. Share the database with your integration
4. Copy the database ID from the URL
5. Create `.env.local` file:
```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
```

## Step 4: Test Email Functionality

1. Open the app in your browser
2. Click "Generate Email Address"
3. Copy the generated email
4. Send a test email to that address
5. Check the inbox - emails should appear within 10 seconds

## Features

✅ Temporary email generation using mail.tm API
✅ Real-time inbox with auto-refresh
✅ Dark/light theme toggle
✅ Notion blog integration (optional)
✅ Fully responsive design
✅ Modern UI with Tailwind CSS

## Troubleshooting

- **Email generation fails**: Check your internet connection and mail.tm API status
- **Notion posts not showing**: Verify API key and database ID, ensure database is shared with integration
- **Theme toggle not working**: Clear browser cache and localStorage

For more details, see [README.md](README.md)

