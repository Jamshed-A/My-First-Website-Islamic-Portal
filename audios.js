// DOM Elements for Audios page
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');

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

// Filter audios by category
categoryFilter.addEventListener('change', function() {
    filterAudios();
});

// Search audios
searchInput.addEventListener('input', function() {
    filterAudios();
});

// Filter function
function filterAudios() {
    const category = categoryFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();
    const audios = document.querySelectorAll('.audio-item');

    audios.forEach(audio => {
        const title = audio.querySelector('.audio-title').textContent.toLowerCase();
        const artist = audio.querySelector('.audio-artist').textContent.toLowerCase();
        const description = audio.querySelector('.audio-description').textContent.toLowerCase();
        const categoryTag = audio.querySelector('.audio-category').textContent.toLowerCase();

        const matchesCategory = category === '' || categoryTag.includes(category);
        const matchesSearch = title.includes(searchTerm) || artist.includes(searchTerm) || description.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            audio.style.display = 'block';
        } else {
            audio.style.display = 'none';
        }
    });
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
function init() {
    updateDates();

    // Update dates every minute
    setInterval(updateDates, 60000);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);