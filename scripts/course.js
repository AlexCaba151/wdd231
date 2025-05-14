// Course JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Course data array
    const courses = [
        {
            code: "CSE 110",
            name: "Programming Building Blocks",
            credits: 2,
            completed: true,
            category: "cse"
        },
        {
            code: "CSE 111",
            name: "Programming with Functions",
            credits: 2,
            completed: true,
            category: "cse"
        },
        {
            code: "CSE 210",
            name: "Programming with Classes",
            credits: 2,
            completed: true,
            category: "cse"
        },
        {
            code: "WDD 130",
            name: "Web Fundamentals",
            credits: 2,
            completed: true,
            category: "wdd"
        },
        {
            code: "WDD 131",
            name: "Web Frontend Development I",
            credits: 2,
            completed: true,
            category: "wdd"
        },
        {
            code: "WDD 231",
            name: "Web Frontend Development II",
            credits: 2,
            completed: false,
            category: "wdd"
        }
    ];
    
    // DOM elements
    const coursesContainer = document.getElementById('courses-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const totalCreditsElement = document.getElementById('total-credits');
    
    // Function to display courses
    function displayCourses(coursesToDisplay) {
        // Clear previous courses
        coursesContainer.innerHTML = '';
        
        // Display courses
        coursesToDisplay.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = `course ${course.completed ? 'completed' : ''}`;
            courseElement.setAttribute('data-category', course.category);
            
            courseElement.innerHTML = `
                <h3>${course.code}</h3>
                <p>${course.name}</p>
                <p>Credits: ${course.credits}</p>
                <p>${course.completed ? '✓ Completed' : 'Not Completed'}</p>
            `;
            
            coursesContainer.appendChild(courseElement);
        });
        
        // Calculate and display total credits
        const totalCredits = coursesToDisplay.reduce((total, course) => total + course.credits, 0);
        totalCreditsElement.textContent = totalCredits;
    }
    
    // Initial display of all courses
    displayCourses(courses);
    
    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter value
            const filter = button.getAttribute('data-filter');
            
            // Filter courses
            let filteredCourses;
            if (filter === 'all') {
                filteredCourses = courses;
            } else {
                filteredCourses = courses.filter(course => course.category === filter);
            }
            
            // Display filtered courses
            displayCourses(filteredCourses);
        });
    });
});