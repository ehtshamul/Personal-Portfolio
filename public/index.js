let blog = [];
let projects = []; // renamed for consistency

// Global variables
const projectsGrid = document.getElementById("projects-grid");
const projectsLoading = document.querySelector(".projects-loading"); // using class selector
const blogGrid = document.getElementById("blog-grid");
const blogLoading = document.querySelector(".blog-loading");   // using class selector
// const contactForm = document.getElementById("contact-form");
const navMenu = document.querySelector(".nav-menu");

// Utility functions
function showLoading(element) {
    if (element) {
        element.style.display = 'block';
    }
}

function hideLoading(element) {
    if (element) {
        element.style.display = 'none';
    }
}

// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// function showError(container, message) {
//     if (container) {
//         container.innerHTML = `<div class="error-message">${message}</div>`;
//     }
// }
const showError = (container, message) => {
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
};




const showMessage = (type, message) => {
    // Remove existing messages
    document.querySelectorAll('.success-message, .error-message').forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    // Insert after contact form
    contactForm.parentNode.insertBefore(messageDiv, contactForm.nextSibling);

    // Auto-remove after 5 seconds
    setTimeout(() => messageDiv.remove(), 5000);
};

 


// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // Add CSS for message animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .message-popup .message-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .message-popup .message-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
            padding: 0;
            line-height: 1;
        }
        
        .message-popup .message-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            const targetElement = document.querySelector(target);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .blog-card, .skill-category, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Load projects API data using an async IIFE
    (async function(projectsLoading) {
        try { 
            showLoading(projectsLoading);
            const resp = await fetch('/api/projects/project');
            if (!resp.ok) { // Check if response is OK
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            const contentType = resp.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }
            projects = await resp.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            showError(projectsGrid, 'Failed to load projects. Please try again later.');
        } finally {
            hideLoading(projectsLoading);
        }
    })(projectsLoading);

    // Render projects in the grid
    function renderProjects(projectData) {
        if (!projectsGrid) return;
        if (projectData.length === 0) {
            projectsGrid.innerHTML = `<p>NO PROJECTS FOUND</p>`;
            return;
        }
        // Render projects logic here...
         projectsGrid.innerHTML = projectData.map(project => `
        <div class="project-card" data-aos="fade-up">
            <div class="project-image">
                <img src="${project.imageUrl || 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=600'}" 
                     alt="${project.title}"
                     loading="lazy">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                   ${project.technologies ? 
                     (Array.isArray(project.technologies) 
  ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') 
                       : `<span class="tech-tag">${project.technologies}</span>`
                     ) : ''
}
                </div>
                <div class="project-links">
                    ${project.githuburl ? `<a href="${project.githuburl}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>` : ''}
                    ${project.liveurl ? `<a href="${project.liveurl}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

    /// blog 
    const loadAndRenderBlogs = async (blogLoading) => {
    try {
        showLoading(blogLoading);

        const resp = await fetch('/api/blogs/blog');
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }
        
        const contentType = resp.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        const blogsData = await resp.json();

        if (!blogGrid) return;

        blogGrid.innerHTML = blogsData.length === 0
            ? '<p class="no-data">No blog posts found.</p>'
            : blogsData.slice(0, 6).map(blog => `
                <div class="blog-card" data-aos="fade-up">
                    <div class="blog-image">
                        <img src="${blog.imageUrl || 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=600'}" 
                             alt="${blog.title}" loading="lazy">
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span><i class="fas fa-user"></i> ${blog.author || 'Admin'}</span>
                            <span><i class="fas fa-calendar"></i> ${formatDate(blog.createdAt)}</span>
                        </div>
                        <h3 class="blog-title">${blog.title}</h3>
                        <p class="blog-excerpt">${blog.excerpt}</p>
                        <div class="blog-tags">
                            ${blog.tags && blog.tags.length > 0 
                              ? blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('') 
                              : ''
                            }
                        </div>
                    </div>
                </div>
            `).join('');

    } catch (error) {
        console.error('Error loading blogs:', error);
        if (blogGrid) {
            showError(blogGrid, 'Failed to load blog posts. Please try again later.');
        }
    } finally {
        hideLoading(blogLoading);
    }
};

loadAndRenderBlogs(blogLoading);

///contacts form  
const contactForm = document.getElementById('contact-form');

    const handleContactForm = async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const contactData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        subject: formData.get('subject').trim(),
        message: formData.get('message').trim()
    };

    // Basic validation
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
        showMessage('error', 'Please fill in all fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        showMessage('error', 'Please enter a valid email address');
        return;
    }

    console.log('Sending contact data:', contactData);

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response');
        }

            const result = await response.json();

            if (response.ok) {
                showMessage('success', result.message || 'Message sent successfully!');
                contactForm.reset();
            } else {
                showMessage('error', result.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        if (error.message.includes('non-JSON response')) {
            showMessage('error', 'Server error. Please try again later.');
        } else {
            showMessage('error', 'Network error. Please check your connection and try again.');
        }
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    };

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

// Improved showMessage function
    const showMessage = (type, message) => {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-popup ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-text">${message}</span>
            <button class="message-close">&times;</button>
        </div>
    `;

    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    // Add close functionality
    const closeBtn = messageDiv.querySelector('.message-close');
    closeBtn.addEventListener('click', () => messageDiv.remove());

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);

    document.body.appendChild(messageDiv);
    };










        





    });

