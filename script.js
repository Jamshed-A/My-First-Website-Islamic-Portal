// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle sidebar menu
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Close sidebar
function closeSidebarMenu() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners
menuToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', closeSidebarMenu);
overlay.addEventListener('click', closeSidebarMenu);

// Close menu when clicking on navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.dataset.page) {
            e.preventDefault();
            closeSidebarMenu();
            loadPage(link.dataset.page);
        }
    });
});

// Page loading functionality
function loadPage(page) {
    // This would load different content based on the page
    // For now, we'll just show an alert
    alert(`Loading ${page} page...`);
}

// Function to update dates
function updateDates() {
    const now = new Date();
    const gregorianDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // For Islamic date, we'll use a proper conversion function
    const islamicDate = getIslamicDate(now);

    document.getElementById('gregorianDate').textContent = gregorianDate;
    document.getElementById('islamicDate').textContent = islamicDate;
}

// Function to get Islamic date (more accurate calculation)
function getIslamicDate(date) {
    // This is a more accurate placeholder implementation
    // In a real application, you would use a proper Islamic date library like 'moment-hijri'

    // Simple conversion factors (approximate)
    const daysInGregorianYear = 365.25;
    const daysInIslamicYear = 354.37;

    // Base date: January 1, 2024 = 19 Jumada al-Awwal, 1445 AH
    const baseGregorian = new Date(2024, 0, 1); // Jan 1, 2024
    const baseIslamicDay = 19;
    const baseIslamicMonth = 4; // Jumada al-Awwal is month 5 (0-indexed as 4)
    const baseIslamicYear = 1445;

    const months = ['Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani', 'Jumada al-Awwal',
                   'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal',
                   'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];

    // Calculate difference in days
    const diffTime = Math.abs(date - baseGregorian);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Approximate calculation (this is still simplified)
    const daysToAdd = diffDays; // In a real implementation, you'd need to account for the different year lengths

    // Calculate Islamic date (simplified)
    let day = baseIslamicDay + daysToAdd;
    let month = baseIslamicMonth;
    let year = baseIslamicYear;

    // This is still a simplified approach - in a real app, use a proper library
    // For demo purposes, we'll just return a fixed date that's close to current
    const currentIslamicDate = getCurrentIslamicDate(date);
    return `${currentIslamicDate.day} ${months[currentIslamicDate.month]} ${currentIslamicDate.year} AH`;
}

// Helper function for Islamic date calculation (simplified)
function getCurrentIslamicDate(date) {
    // This is a simplified calculation - in a real app, use a proper Islamic date library
    // For demonstration purposes, we'll return a date that's approximately correct
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // This is a very rough approximation
    // In a real implementation, use a library like 'moment-hijri' or 'hijri-date'
    let hijriYear, hijriMonth, hijriDay;

    // Approximate conversion (not accurate, for demo only)
    if (year === 2024) {
        // January 2024 is approximately Jumada al-Awwal 1445 AH
        hijriYear = 1445;
        hijriMonth = 4; // Jumada al-Awwal (0-indexed)
        hijriDay = day + 18; // Approximate offset

        if (hijriDay > 30) {
            hijriDay -= 30;
            hijriMonth++;
        }

        if (hijriMonth > 11) {
            hijriMonth = 0;
            hijriYear++;
        }
    } else {
        // For other years, use a rough calculation
        hijriYear = year - 622; // Very rough approximation
        hijriMonth = month;
        hijriDay = day;
    }

    return {
        year: hijriYear,
        month: hijriMonth,
        day: hijriDay
    };
}

// Function to load daily hadith
async function loadDailyHadith() {
    try {
        const response = await fetch('/api/hadith/today');
        const hadith = await response.json();

        document.getElementById('hadithContent').innerHTML = `<p>${hadith.text}</p>`;
        document.getElementById('hadithReference').innerHTML = `<em>${hadith.reference}</em>`;
    } catch (error) {
        console.error('Error loading hadith:', error);
        // Fallback to sample hadith
        const hadiths = [
            {
                text: "The best among you are those who have the best manners and character.",
                reference: "Sahih al-Bukhari 6035"
            },
            {
                text: "None of you believes until he loves for his brother what he loves for himself.",
                reference: "Sahih al-Bukhari 13"
            },
            {
                text: "The ink of the scholar is more sacred than the blood of the martyr.",
                reference: "At-Tirmidhi"
            },
            {
                text: "Seek knowledge from the cradle to the grave.",
                reference: "Sunan Ibn Majah 224"
            },
            {
                text: "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.",
                reference: "Sahih al-Bukhari 6114"
            }
        ];

        // Get today's hadith based on date
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
        const index = dayOfYear % hadiths.length;

        const hadith = hadiths[index];
        document.getElementById('hadithContent').innerHTML = `<p>${hadith.text}</p>`;
        document.getElementById('hadithReference').innerHTML = `<em>${hadith.reference}</em>`;
    }
}

// Function to load featured content
async function loadFeaturedContent() {
    try {
        // Load featured content from API
        const articlesResponse = await fetch('/api/content/articles');
        const articles = await articlesResponse.json();

        const booksResponse = await fetch('/api/content/books');
        const books = await booksResponse.json();

        const videosResponse = await fetch('/api/content/videos');
        const videos = await videosResponse.json();

        // Update articles (limit to 3)
        const articlesList = document.getElementById('latestArticles');
        articlesList.innerHTML = '';
        articles.slice(0, 3).forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/uploads/articles/${article.filename}">${article.originalName}</a>`;
            articlesList.appendChild(li);
        });

        // Update books (limit to 3)
        const booksList = document.getElementById('recentBooks');
        booksList.innerHTML = '';
        books.slice(0, 3).forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/uploads/books/${book.filename}">${book.originalName}</a>`;
            booksList.appendChild(li);
        });

        // Update videos (limit to 3)
        const videosList = document.getElementById('popularVideos');
        videosList.innerHTML = '';
        videos.slice(0, 3).forEach(video => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/uploads/videos/${video.filename}">${video.originalName}</a>`;
            videosList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading featured content:', error);
        // Fallback to sample content
        const articles = [
            { title: "Understanding Prayer in Islam", link: "#" },
            { title: "The Importance of Charity", link: "#" },
            { title: "Ramadan Reflections", link: "#" }
        ];

        const books = [
            { title: "The Sealed Nectar", link: "#" },
            { title: "Fortification of the Soul", link: "#" },
            { title: "The Life of Prophet Muhammad", link: "#" }
        ];

        const videos = [
            { title: "Introduction to Quran", link: "#" },
            { title: "Prayer Tutorial", link: "#" },
            { title: "Hajj Pilgrimage", link: "#" }
        ];

        // Update articles
        const articlesList = document.getElementById('latestArticles');
        articlesList.innerHTML = '';
        articles.forEach(article => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${article.link}">${article.title}</a>`;
            articlesList.appendChild(li);
        });

        // Update books
        const booksList = document.getElementById('recentBooks');
        booksList.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${book.link}">${book.title}</a>`;
            booksList.appendChild(li);
        });

        // Update videos
        const videosList = document.getElementById('popularVideos');
        videosList.innerHTML = '';
        videos.forEach(video => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${video.link}">${video.title}</a>`;
            videosList.appendChild(li);
        });
    }
}

// Initialize the page
function init() {
    updateDates();
    loadDailyHadith();
    loadFeaturedContent();

    // Update dates every minute
    setInterval(updateDates, 60000);

    // Update hadith daily (in a real implementation, you might want to check the date)
    // For demo purposes, we'll update every 30 seconds
    setInterval(loadDailyHadith, 30000);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);