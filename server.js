const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const articlesDir = path.join(uploadsDir, 'articles');
const booksDir = path.join(uploadsDir, 'books');
const videosDir = path.join(uploadsDir, 'videos');
const audiosDir = path.join(uploadsDir, 'audios');

[uploadsDir, articlesDir, booksDir, videosDir, audiosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Define uploads variable
const uploads = uploadsDir; // <-- YEH LINE ZAROORI HAI

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const contentType = req.body.contentType;
        let uploadPath = uploadsDir;

        switch(contentType) {
            case 'article':
                uploadPath = articlesDir;
                break;
            case 'book':
                uploadPath = booksDir;
                break;
            case 'video':
                uploadPath = videosDir;
                break;
            case 'audio':
                uploadPath = audiosDir;
                break;
            default:
                uploadPath = uploadsDir;
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const contentType = req.body.contentType;

    if (contentType === 'article') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for articles!'), false);
        }
    } else if (contentType === 'book') {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed for books!'), false);
        }
    } else if (contentType === 'video') {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed for videos!'), false);
        }
    } else if (contentType === 'audio') {
        if (file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files are allowed for audios!'), false);
        }
    } else {
        cb(new Error('Invalid content type!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// API Routes
app.get('/api/content/:type', (req, res) => {
    const contentType = req.params.type;
    let contentDir;

    switch(contentType) {
        case 'articles':
            contentDir = articlesDir;
            break;
        case 'books':
            contentDir = booksDir;
            break;
        case 'videos':
            contentDir = videosDir;
            break;
        case 'audios':
            contentDir = audiosDir;
            break;
        default:
            return res.status(400).json({ error: 'Invalid content type' });
    }

    fs.readdir(contentDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read directory' });
        }

        const content = files.map(file => {
            const filePath = path.join(contentDir, file);
            const stat = fs.statSync(filePath);
            return {
                filename: file,
                originalName: file,
                size: stat.size,
                uploadDate: stat.birthtime,
                url: `/uploads/${contentType}/${file}`
            };
        });

        res.json(content);
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const contentType = req.body.contentType;
    const title = req.body.title;
    const description = req.body.description || '';
    const author = req.body.author || '';
    const category = req.body.category || '';

    const metadata = {
        id: Date.now().toString(),
        title: title,
        description: description,
        author: author,
        category: category,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadDate: new Date(),
        url: req.file.path
    };

    const metadataFile = path.join(path.dirname(req.file.path), `${req.file.filename}.json`);
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    res.json({
        message: 'File uploaded successfully',
        file: metadata
    });
});

app.delete('/api/content/:type/:filename', (req, res) => {
    const contentType = req.params.type;
    const filename = req.params.filename;
    let contentDir;

    switch(contentType) {
        case 'articles':
            contentDir = articlesDir;
            break;
        case 'books':
            contentDir = booksDir;
            break;
        case 'videos':
            contentDir = videosDir;
            break;
        case 'audios':
            contentDir = audiosDir;
            break;
        default:
            return res.status(400).json({ error: 'Invalid content type' });
    }

    const filePath = path.join(contentDir, filename);
    const metadataPath = path.join(contentDir, `${filename}.json`);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not delete file' });
        }

        if (fs.existsSync(metadataPath)) {
            fs.unlink(metadataPath, (err) => {
                if (err) {
                    console.error('Could not delete metadata file:', err);
                }
            });
        }

        res.json({ message: 'File deleted successfully' });
    });
});

app.get('/api/hadith/today', (req, res) => {
    const hadiths = [
        {
            text: "The best among you are those who have the best manners and character.",
            reference: "Sahih al-Bukhari 6035",
            date: new Date().toISOString().split('T')[0]
        },
        {
            text: "None of you believes until he loves for his brother what he loves for himself.",
            reference: "Sahih al-Bukhari 13",
            date: new Date().toISOString().split('T')[0]
        },
        {
            text: "The ink of the scholar is more sacred than the blood of the martyr.",
            reference: "At-Tirmidhi",
            date: new Date().toISOString().split('T')[0]
        },
        {
            text: "Seek knowledge from the cradle to the grave.",
            reference: "Sunan Ibn Majah 224",
            date: new Date().toISOString().split('T')[0]
        },
        {
            text: "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.",
            reference: "Sahih al-Bukhari 6114",
            date: new Date().toISOString().split('T')[0]
        }
    ];

    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % hadiths.length;

    res.json(hadiths[index]);
});

app.post('/api/hadith/today', (req, res) => {
    const { text, reference } = req.body;

    if (!text || !reference) {
        return res.status(400).json({ error: 'Text and reference are required' });
    }

    res.json({
        message: 'Hadith updated successfully',
        hadith: { text, reference, date: new Date().toISOString().split('T')[0] }
    });
});

// Yeh line fix hai - ab uploads defined hai
app.use('/uploads', express.static(uploads));

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Upload directories created:`);
    console.log(`- Articles: ${articlesDir}`);
    console.log(`- Books: ${booksDir}`);
    console.log(`- Videos: ${videosDir}`);
    console.log(`- Audios: ${audiosDir}`);
});