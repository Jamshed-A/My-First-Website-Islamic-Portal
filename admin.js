// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const adminTabs = document.querySelectorAll('.admin-tab');
const tabContents = document.querySelectorAll('.tab-content');
const statusMessage = document.getElementById('statusMessage');

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

// Event listeners for sidebar
menuToggle.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', closeSidebarMenu);
overlay.addEventListener('click', closeSidebarMenu);

// Tab switching functionality
adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Remove active class from all tabs and contents
        adminTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// File upload drag and drop functionality
function setupFileUpload(fileUploadId, fileId, fileInfoId) {
    const fileUpload = document.getElementById(fileUploadId);
    const fileInput = document.getElementById(fileId);
    const fileInfo = document.getElementById(fileInfoId);

    // Click to browse
    fileUpload.addEventListener('click', (e) => {
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });

    // Drag and drop
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });

    fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
    });

    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');

        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateFileInfo(fileInfo, e.dataTransfer.files[0]);
        }
    });

    // File selection
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateFileInfo(fileInfo, fileInput.files[0]);
        }
    });
}

// Update file info display
function updateFileInfo(fileInfoElement, file) {
    if (file) {
        fileInfoElement.textContent = `Selected: ${file.name} (${formatFileSize(file.size)})`;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form submission handlers
document.getElementById('hadithForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const text = document.getElementById('hadithText').value;
    const reference = document.getElementById('hadithReference').value;

    if (!text || !reference) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/hadith/today', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, reference })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Hadith updated successfully!', 'success');
            // Reset form
            document.getElementById('hadithText').value = '';
            document.getElementById('hadithReference').value = '';
        } else {
            showMessage(result.error || 'Error updating hadith', 'error');
        }
    } catch (error) {
        showMessage('Error updating hadith: ' + error.message, 'error');
    }
});

document.getElementById('articleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
    const author = document.getElementById('articleAuthor').value;
    const category = document.getElementById('articleCategory').value;
    const fileInput = document.getElementById('articleFile');
    const file = fileInput.files[0];

    if (!title || !content || !author) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'article');
    formData.append('title', title);
    formData.append('description', content);
    formData.append('author', author);
    formData.append('category', category);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Article added successfully!', 'success');
            // Reset form
            document.getElementById('articleForm').reset();
            document.getElementById('articleFileInfo').textContent = '';
            // Reload articles grid
            loadContent('articles', document.getElementById('articlesGrid'));
        } else {
            showMessage(result.error || 'Error adding article', 'error');
        }
    } catch (error) {
        showMessage('Error adding article: ' + error.message, 'error');
    }
});

document.getElementById('bookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const description = document.getElementById('bookDescription').value;
    const category = document.getElementById('bookCategory').value;
    const fileInput = document.getElementById('bookFile');
    const file = fileInput.files[0];

    if (!title || !author || !file) {
        showMessage('Please fill in all required fields and select a PDF file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'book');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author', author);
    formData.append('category', category);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Book added successfully!', 'success');
            // Reset form
            document.getElementById('bookForm').reset();
            document.getElementById('bookFileInfo').textContent = '';
            // Reload books grid
            loadContent('books', document.getElementById('booksGrid'));
        } else {
            showMessage(result.error || 'Error adding book', 'error');
        }
    } catch (error) {
        showMessage('Error adding book: ' + error.message, 'error');
    }
});

document.getElementById('videoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const category = document.getElementById('videoCategory').value;
    const fileInput = document.getElementById('videoFile');
    const file = fileInput.files[0];

    if (!title || !file) {
        showMessage('Please fill in all required fields and select a video file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'video');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Video added successfully!', 'success');
            // Reset form
            document.getElementById('videoForm').reset();
            document.getElementById('videoFileInfo').textContent = '';
            // Reload videos grid
            loadContent('videos', document.getElementById('videosGrid'));
        } else {
            showMessage(result.error || 'Error adding video', 'error');
        }
    } catch (error) {
        showMessage('Error adding video: ' + error.message, 'error');
    }
});

document.getElementById('audioForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('audioTitle').value;
    const description = document.getElementById('audioDescription').value;
    const category = document.getElementById('audioCategory').value;
    const fileInput = document.getElementById('audioFile');
    const file = fileInput.files[0];

    if (!title || !file) {
        showMessage('Please fill in all required fields and select an audio file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', 'audio');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Audio added successfully!', 'success');
            // Reset form
            document.getElementById('audioForm').reset();
            document.getElementById('audioFileInfo').textContent = '';
            // Reload audios grid
            loadContent('audios', document.getElementById('audiosGrid'));
        } else {
            showMessage(result.error || 'Error adding audio', 'error');
        }
    } catch (error) {
        showMessage('Error adding audio: ' + error.message, 'error');
    }
});

// Function to load content for admin panel
async function loadContent(contentType, containerElement) {
    try {
        const response = await fetch(`/api/content/${contentType}`);
        const content = await response.json();

        // Clear container
        containerElement.innerHTML = '';

        // Add content items to the grid
        content.forEach(item => {
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';

            let contentHTML = `
                <h4>${item.originalName}</h4>
                <p>Size: ${formatFileSize(item.size)}</p>
                <p>Uploaded: ${new Date(item.uploadDate).toLocaleDateString()}</p>
                <div class="content-actions">
                    <button class="btn btn-primary" onclick="viewContent('${contentType}', '${item.filename}')">View</button>
                    <button class="btn btn-danger" onclick="deleteContent('${contentType}', '${item.filename}')">Delete</button>
                </div>
            `;

            contentItem.innerHTML = contentHTML;
            containerElement.appendChild(contentItem);
        });
    } catch (error) {
        console.error(`Error loading ${contentType}:`, error);
    }
}

// Function to view content
function viewContent(contentType, filename) {
    const url = `/uploads/${contentType}/${filename}`;
    window.open(url, '_blank');
}

// Function to delete content
async function deleteContent(contentType, filename) {
    if (!confirm(`Are you sure you want to delete this ${contentType}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/content/${contentType}/${filename}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} deleted successfully!`, 'success');
            // Reload the content grid
            const containerId = `${contentType}Grid`;
            const container = document.getElementById(containerId);
            if (container) {
                loadContent(contentType, container);
            }
        } else {
            const result = await response.json();
            showMessage(result.error || `Error deleting ${contentType}`, 'error');
        }
    } catch (error) {
        showMessage(`Error deleting ${contentType}: ${error.message}`, 'error');
    }
}

// Show status message
function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${type}`;
    statusMessage.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

// Function to update dates (same as in main script)
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

// Initialize the page
async function init() {
    updateDates();

    // Setup file uploads
    setupFileUpload('articleFileUpload', 'articleFile', 'articleFileInfo');
    setupFileUpload('bookFileUpload', 'bookFile', 'bookFileInfo');
    setupFileUpload('videoFileUpload', 'videoFile', 'videoFileInfo');
    setupFileUpload('audioFileUpload', 'audioFile', 'audioFileInfo');

    // Load content for each section
    loadContent('articles', document.getElementById('articlesGrid'));
    loadContent('books', document.getElementById('booksGrid'));
    loadContent('videos', document.getElementById('videosGrid'));
    loadContent('audios', document.getElementById('audiosGrid'));

    // Update dates every minute
    setInterval(updateDates, 60000);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);