# Islamic Portal Website

A responsive Islamic website with dynamic content updates, featuring daily hadith, Islamic date, and comprehensive content management system.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dynamic Content**: Daily hadith and Islamic date updates
- **Content Management**: Admin panel for managing articles, books, videos, and audios
- **File Upload**: Support for PDFs (books), images (articles), videos, and audios
- **Hamburger Menu**: Easy navigation with collapsible sidebar
- **Islamic Themes**: Clean, respectful design appropriate for Islamic content

## Pages

1. **Home Page**: Features daily hadith, prayer times, and featured content
2. **Articles**: Text and image-based Islamic content
3. **Books**: PDF-based Islamic literature
4. **Videos**: Islamic video content
5. **Audios**: Islamic audio content
6. **Admin Panel**: Content management system

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express
- **File Upload**: Multer for handling multipart forms
- **Styling**: Pure CSS with responsive design

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Clone or download this repository
3. Navigate to the project directory
4. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the server:

```bash
npm start
```

2. Open your browser and go to `http://localhost:3000`

## File Structure

```
islamic-portal/
├── index.html          # Home page
├── admin.html          # Admin panel
├── articles.html       # Articles page
├── books.html          # Books page
├── videos.html         # Videos page
├── audios.html         # Audios page
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript
├── admin.js            # Admin panel JavaScript
├── articles.js         # Articles page JavaScript
├── books.js            # Books page JavaScript
├── videos.js           # Videos page JavaScript
├── audios.js           # Audios page JavaScript
├── server.js           # Node.js server
├── package.json        # Project dependencies
└── uploads/            # Directory for uploaded files
    ├── articles/
    ├── books/
    ├── videos/
    └── audios/
```

## Admin Panel

The admin panel allows you to:

- Update daily hadith
- Upload and manage articles (text/images)
- Upload and manage books (PDFs)
- Upload and manage videos
- Upload and manage audios
- Delete existing content

Access the admin panel at `/admin.html`

## API Endpoints

- `GET /api/hadith/today` - Get today's hadith
- `POST /api/hadith/today` - Update today's hadith
- `GET /api/content/:type` - Get content by type (articles, books, videos, audios)
- `POST /api/upload` - Upload content
- `DELETE /api/content/:type/:filename` - Delete content

## File Upload Guidelines

- **Articles**: Images only (for featured images)
- **Books**: PDF files only
- **Videos**: Video files (MP4, AVI, MOV, etc.)
- **Audios**: Audio files (MP3, WAV, etc.)

Maximum file size: 50MB

## Security Considerations

- File type validation on both client and server side
- File size limits enforced
- Sanitized file names to prevent path traversal
- Content type verification

## Responsive Design

The website is fully responsive and adapts to different screen sizes:
- Mobile: Single column layout with hamburger menu
- Tablet: Adjusted spacing and layout
- Desktop: Multi-column layout with full navigation

## Islamic Date Calculation

The Islamic date is calculated using an approximate conversion algorithm. For production use, consider implementing a more accurate library like `moment-hijri`.

## License

MIT License - Feel free to use and modify for your own projects.