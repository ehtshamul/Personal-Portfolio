// Global variables
let currentUser = null;
let currentEditingProject = null;
let currentEditingBlog = null;
let allProjects = [];
let allBlogs = [];

// DOM Elements
const adminSidebar = document.querySelector('.admin-sidebar');
const adminSections = document.querySelectorAll('.admin-section');
const navItems = document.querySelectorAll('.nav-item[data-section]');
const logoutBtn = document.getElementById('logout-btn');

// Modal elements
const projectModal = document.getElementById('project-modal');
const blogModal = document.getElementById('blog-modal');
const projectForm = document.getElementById('project-form');
const blogForm = document.getElementById('blog-form');

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
    loadDashboardData();
});

// Check if user is authenticated
const checkAuth = () => {
    const token = localStorage.getItem('admintoken');
    const user = localStorage.getItem('adminuser');
    
    if (!token || !user) {
        console.log('No authentication data found, redirecting to login');
        window.location.href = '/admin';
        return;
    }
    
    try {
        currentUser = JSON.parse(user);
        
        // Validate user data structure
        if (!currentUser.username || !currentUser.id) {
            console.error('Invalid user data structure');
            logout();
            return;
        }
        
        document.getElementById('admin-username').textContent = `Welcome, ${currentUser.username}`;
    } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
    }
};

// Setup event listeners
const setupEventListeners = () => {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
            setActiveNavItem(item);
        });
    });

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Modal controls
    setupModalEventListeners();
    
    // Form submissions
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }
    
    if (blogForm) {
        blogForm.addEventListener('submit', handleBlogSubmit);
    }

    // Reply form submission
    const replyForm = document.getElementById('reply-form');
    if (replyForm) {
        replyForm.addEventListener('submit', handleReplySubmit);
    }

    // Add buttons
    const addProjectBtn = document.getElementById('add-project-btn');
    const addBlogBtn = document.getElementById('add-blog-btn');
    
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => openProjectModal());
    }
    
    if (addBlogBtn) {
        addBlogBtn.addEventListener('click', () => openBlogModal());
    }

    // Event delegation for table buttons
    document.addEventListener('click', e => {
        // Project edit button
        if (e.target.closest('.edit-project-btn')) {
            const button = e.target.closest('.edit-project-btn');
            const projectId = button.dataset.projectId;
            console.log('Edit project button clicked for ID:', projectId);
            editProject(projectId);
        }
        
        // Project delete button
        if (e.target.closest('.delete-project-btn')) {
            const button = e.target.closest('.delete-project-btn');
            const projectId = button.dataset.projectId;
            console.log('Delete project button clicked for ID:', projectId);
            deleteProject(projectId);
        }
        
        // Blog edit button
        if (e.target.closest('.edit-blog-btn')) {
            const button = e.target.closest('.edit-blog-btn');
            const blogId = button.dataset.blogId;
            console.log('Edit blog button clicked for ID:', blogId);
            editBlog(blogId);
        }
        
        // Blog delete button
        if (e.target.closest('.delete-blog-btn')) {
            const button = e.target.closest('.delete-blog-btn');
            const blogId = button.dataset.blogId;
            console.log('Delete blog button clicked for ID:', blogId);
            deleteBlog(blogId);
        }
        
        // Contact view button
        if (e.target.closest('.view-contact-btn')) {
            const button = e.target.closest('.view-contact-btn');
            const contactId = button.dataset.contactId;
            console.log('View contact button clicked for ID:', contactId);
            viewContact(contactId);
        }
        
        // Contact reply button
        if (e.target.closest('.reply-contact-btn')) {
            const button = e.target.closest('.reply-contact-btn');
            const contactId = button.dataset.contactId;
            console.log('Reply contact button clicked for ID:', contactId);
            replyContact(contactId);
        }
        
        // Contact delete button
        if (e.target.closest('.delete-contact-btn')) {
            const button = e.target.closest('.delete-contact-btn');
            const contactId = button.dataset.contactId;
            console.log('Delete contact button clicked for ID:', contactId);
            deleteContact(contactId);
        }
    });
};

// Setup modal event listeners
const setupModalEventListeners = () => {
    // Close modals
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
        close.addEventListener('click', closeModals);
    });

    // Cancel buttons
    const cancelProjectBtn = document.getElementById('cancel-project');
    const cancelBlogBtn = document.getElementById('cancel-blog');
    const cancelReplyBtn = document.getElementById('cancel-reply');
    
    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', closeModals);
    }
    
    if (cancelBlogBtn) {
        cancelBlogBtn.addEventListener('click', closeModals);
    }
    
    if (cancelReplyBtn) {
        cancelReplyBtn.addEventListener('click', closeModals);
    }

    // Close modals when clicking outside
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });
};

// Show specific section
const showSection = sectionName => {
    adminSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionName) {
            case 'projects':
                loadProjects();
                break;
            case 'blogs':
                loadBlogs();
                break;
            case 'contacts':
                loadContacts();
                break;
        }
    }
};

// Set active navigation item
const setActiveNavItem = activeItem => {
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
};

// Load dashboard data
const loadDashboardData = async () => {
    try {
        await Promise.all([
            loadDashboardStats(),
            loadProjects(),
            loadBlogs(),
            loadContacts()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
};

// Load dashboard statistics
const loadDashboardStats = async () => {
    try {
        const [projectsResponse, blogsResponse, contactsResponse] = await Promise.all([
            apiRequest('/api/projects/project'),
            apiRequest('/api/blogs/blog'),
            apiRequest('/api/contact/mails')
        ]);

        const projects = await projectsResponse.json();
        const blogs = await blogsResponse.json();
        const contacts = await contactsResponse.json();

        document.getElementById('projects-count').textContent = projects.length;
        document.getElementById('blogs-count').textContent = blogs.length;
        document.getElementById('contacts-count').textContent = contacts.length;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
};

// Load projects
const loadProjects = async () => {
    try {
        const response = await apiRequest('/api/projects/project');
        const projects = await response.json();
        allProjects = projects; // Store for later access
        renderProjectsTable(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Failed to load projects');
    }
};

// Render projects table
const renderProjectsTable = projects => {
    const tbody = document.getElementById('projects-table-body');
    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No projects found</td></tr>';
        return;
    }

    tbody.innerHTML = projects.map(project => `
        <tr data-project-id="${project._id}">
            <td>
                <strong>${project.title}</strong>
                ${project.featured ? '<span class="status-badge status-published">Featured</span>' : ''}
            </td>
            <td>${typeof project.technologies === 'string' 
                ? project.technologies.split(',').slice(0, 3).join(', ') + (project.technologies.split(',').length > 3 ? '...' : '')
                : Array.isArray(project.technologies) 
                    ? project.technologies.slice(0, 3).join(', ') + (project.technologies.length > 3 ? '...' : '')
                    : project.technologies || ''
            }</td>
            <td>
                <span class="status-badge ${project.featured ? 'status-published' : 'status-draft'}">
                    ${project.featured ? 'Yes' : 'No'}
                </span>
            </td>
            <td>${formatDate(project.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-sm edit-project-btn" data-project-id="${project._id}" title="Edit Project">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm delete-project-btn" data-project-id="${project._id}" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log('Projects table rendered with', projects.length, 'projects');
};

// Load blogs
const loadBlogs = async () => {
    try {
        const response = await apiRequest('/api/blogs/blog');
        const blogs = await response.json();
        allBlogs = blogs; // Store for later access
        renderBlogsTable(blogs);
    } catch (error) {
        console.error('Error loading blogs:', error);
        showError('Failed to load blogs');
    }
};

// Render blogs table
const renderBlogsTable = blogs => {
    const tbody = document.getElementById('blogs-table-body');
    if (!tbody) return;

    if (blogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No blog posts found</td></tr>';
        return;
    }

    tbody.innerHTML = blogs.map(blog => `
        <tr data-blog-id="${blog._id}">
            <td><strong>${blog.title}</strong></td>
            <td>${blog.author}</td>
            <td>
                <span class="status-badge ${blog.published ? 'status-published' : 'status-draft'}">
                    ${blog.published ? 'Published' : 'Draft'}
                </span>
            </td>
            <td>${formatDate(blog.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-sm edit-blog-btn" data-blog-id="${blog._id}" title="Edit Blog">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm delete-blog-btn" data-blog-id="${blog._id}" title="Delete Blog">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log('Blogs table rendered with', blogs.length, 'blogs');
};

// Load contacts
const loadContacts = async () => {
    try {
        const response = await apiRequest('/api/contact/mails');
        const contacts = await response.json();
        renderContactsTable(contacts);
    } catch (error) {
        console.error('Error loading contacts:', error);
        showError('Failed to load contacts');
    }
};

// Render contacts table
const renderContactsTable = contacts => {
    const tbody = document.getElementById('contacts-table-body');
    if (!tbody) return;

    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No messages found</td></tr>';
        return;
    }

    tbody.innerHTML = contacts.map(contact => `
        <tr data-contact-id="${contact._id}">
            <td><strong>${contact.name}</strong></td>
            <td>${contact.email}</td>
            <td>${contact.subject}</td>
            <td>
                <span class="status-badge status-${contact.status}">
                    ${contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </span>
            </td>
            <td>${formatDate(contact.createdAt)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-primary btn-sm view-contact-btn" data-contact-id="${contact._id}" title="View Message">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-success btn-sm reply-contact-btn" data-contact-id="${contact._id}" title="Reply">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm delete-contact-btn" data-contact-id="${contact._id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log('Contacts table rendered with', contacts.length, 'contacts');
};

// Project modal functions
const openProjectModal = (project = null) => {
    console.log('openProjectModal called with project:', project);
    currentEditingProject = project;
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('project-modal-title');
    const form = document.getElementById('project-form');
    
    console.log('Modal elements:', { modal, title, form });
    
    if (!modal || !title || !form) {
        console.error('Modal elements not found');
        showError('Modal elements not found');
        return;
    }
    
    if (project) {
        title.textContent = 'Edit Project';
        populateProjectForm(project);
    } else {
        title.textContent = 'Add Project';
        form.reset();
    }
    
    // Force modal to show
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.classList.add('active');
    
    console.log('Modal should now be active');
};

const populateProjectForm = project => {
    console.log('populateProjectForm called with project:', project);
    try {
        document.getElementById('project-title').value = project.title || '';
        document.getElementById('project-description').value = project.description || '';
        document.getElementById('project-technologies').value = project.technologies || '';
        document.getElementById('project-github').value = project.githuburl || project.githubUrl || '';
        document.getElementById('project-live').value = project.liveurl || project.liveUrl || '';
        document.getElementById('project-image').value = project.imageUrl || '';
        document.getElementById('project-featured').checked = project.featured || false;
    } catch (error) {
        console.error('Error populating project form:', error);
    }
};

// Blog modal functions
const openBlogModal = (blog = null) => {
    console.log('openBlogModal called with blog:', blog);
    currentEditingBlog = blog;
    const modal = document.getElementById('blog-modal');
    const title = document.getElementById('blog-modal-title');
    const form = document.getElementById('blog-form');
    
    console.log('Blog modal elements:', { modal, title, form });
    
    if (!modal || !title || !form) {
        console.error('Blog modal elements not found');
        showError('Blog modal elements not found');
        return;
    }
    
    if (blog) {
        title.textContent = 'Edit Blog Post';
        populateBlogForm(blog);
    } else {
        title.textContent = 'Add Blog Post';
        form.reset();
        document.getElementById('blog-author').value = 'Admin';
        document.getElementById('blog-published').checked = true;
    }
    
    // Force modal to show
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.classList.add('active');
    
    console.log('Blog modal should now be active');
};

const populateBlogForm = blog => {
    console.log('populateBlogForm called with blog:', blog);
    try {
        document.getElementById('blog-title').value = blog.title || '';
        document.getElementById('blog-excerpt').value = blog.excerpt || '';
        document.getElementById('blog-content').value = blog.content || '';
        document.getElementById('blog-author').value = blog.author || 'Admin';
        document.getElementById('blog-tags').value = Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '';
        document.getElementById('blog-image').value = blog.imageUrl || '';
        document.getElementById('blog-published').checked = blog.published || false;
    } catch (error) {
        console.error('Error populating blog form:', error);
    }
};

// Close modals
const closeModals = () => {
    console.log('closeModals called');
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        modal.style.display = 'none';
    });
    currentEditingProject = null;
    currentEditingBlog = null;
};

// Handle project form submission
const handleProjectSubmit = async e => {
    console.log('Project form submission started');
    e.preventDefault();
    
    const formData = new FormData(projectForm);
    const projectData = {
        title: formData.get('title')?.trim(),
        description: formData.get('description')?.trim(),
        technologies: formData.get('technologies')?.trim(),
        githubUrl: formData.get('githubUrl'),
        liveUrl: formData.get('liveUrl'),
        imageUrl: formData.get('imageUrl')?.trim(),
        featured: formData.get('featured') === 'on'
    };

    console.log('Project data to submit:', projectData);

    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.technologies) {
        showError('Title, description, and technologies are required');
        return;
    }

    try {
        let response;
        if (currentEditingProject) {
            // UPDATE existing project
            console.log('Updating project with ID:', currentEditingProject._id);
            response = await apiRequest(`/api/projects/update/${currentEditingProject._id}`, {
                method: 'PUT',
                body: JSON.stringify(projectData)
            });
        } else {
            // CREATE new project
            console.log('Creating new project');
            response = await apiRequest('/api/projects/create', {
                method: 'POST',
                body: JSON.stringify(projectData)
            });
        }

        if (response.ok) {
            showSuccess(currentEditingProject ? 'Project updated successfully!' : 'Project added successfully!');
            closeModals();
            loadProjects();
            loadDashboardStats();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save project');
        }
    } catch (error) {
        console.error('Error saving project:', error);
        showError('Network error. Please try again.');
    }
};

// Handle blog form submission
const handleBlogSubmit = async e => {
    console.log('Blog form submission started');
    e.preventDefault();
    
    const formData = new FormData(blogForm);
    const blogData = {
        title: formData.get('title')?.trim(),
        excerpt: formData.get('excerpt')?.trim(),
        content: formData.get('content')?.trim(),
        author: formData.get('author')?.trim() || 'Admin',
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        imageUrl: formData.get('imageUrl')?.trim(),
        published: formData.get('published') === 'on'
    };

    console.log('Blog data to submit:', blogData);

    // Validate required fields
    if (!blogData.title || !blogData.excerpt || !blogData.content) {
        showError('Title, excerpt, and content are required');
        return;
    }

    console.log('Sending blog data:', blogData);

    try {
        let response;
        if (currentEditingBlog) {
            // UPDATE existing blog
            console.log('Updating blog with ID:', currentEditingBlog._id);
            response = await apiRequest(`/api/blogs/update/${currentEditingBlog._id}`, {
                method: 'PUT',
                body: JSON.stringify(blogData)
            });
        } else {
            // CREATE new blog
            console.log('Creating new blog');
            response = await apiRequest('/api/blogs/create', {
                method: 'POST',
                body: JSON.stringify(blogData)
            });
        }

        if (response.ok) {
            showSuccess(currentEditingBlog ? 'Blog post updated successfully!' : 'Blog post added successfully!');
            closeModals();
            loadBlogs();
            loadDashboardStats();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save blog post');
        }
    } catch (error) {
        console.error('Error saving blog post:', error);
        showError('Network error. Please try again.');
    }
};

// Functions for table actions (no longer global since we use event delegation)
const editProject = projectId => {
    console.log('editProject called with ID:', projectId);
    console.log('allProjects:', allProjects);
    const project = allProjects.find(p => p._id === projectId);
    console.log('Found project:', project);
    if (project) {
        openProjectModal(project);
    } else {
        showError('Project not found');
    }
};

const deleteProject = async projectId => {
    console.log('deleteProject called with ID:', projectId);
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    try {
        const response = await apiRequest(`/api/projects/delete/${projectId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showSuccess('Project deleted successfully!');
            loadProjects();
            loadDashboardStats();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showError('Network error. Please try again.');
    }
};

const editBlog = blogId => {
    console.log('editBlog called with ID:', blogId);
    console.log('allBlogs:', allBlogs);
    const blog = allBlogs.find(b => b._id === blogId);
    console.log('Found blog:', blog);
    if (blog) {
        openBlogModal(blog);
    } else {
        showError('Blog post not found');
    }
};

const deleteBlog = async blogId => {
    console.log('deleteBlog called with ID:', blogId);
    if (!confirm('Are you sure you want to delete this blog post?')) {
        return;
    }

    try {
        const response = await apiRequest(`/api/blogs/delete/${blogId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showSuccess('Blog post deleted successfully!');
            loadBlogs();
            loadDashboardStats();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to delete blog post');
        }
    } catch (error) {
        console.error('Error deleting blog post:', error);
        showError('Network error. Please try again.');
    }
};

// Contact functions
const viewContact = async contactId => {
    try {
        const response = await apiRequest(`/api/contact/mail/${contactId}`);
        
        if (response.ok) {
            const contact = await response.json();
            alert(`From: ${contact.name} (${contact.email})\nSubject: ${contact.subject}\n\nMessage:\n${contact.message}`);
        } else {
            showError('Failed to load contact details');
        }
    } catch (error) {
        console.error('Error viewing contact:', error);
        showError('Failed to load contact details');
    }
};

const replyContact = async contactId => {
    try {
        const response = await apiRequest(`/api/contact/mail/${contactId}`);
        
        if (response.ok) {
            const contact = await response.json();
            openReplyModal(contact);
        } else {
            showError('Failed to load contact details');
        }
    } catch (error) {
        console.error('Error loading contact for reply:', error);
        showError('Failed to load contact details');
    }
};

const deleteContact = async contactId => {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }

    try {
        const response = await apiRequest(`/api/contact/delete/${contactId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showSuccess('Message deleted successfully!');
            loadContacts();
            loadDashboardStats();
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to delete message');
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        showError('Network error. Please try again.');
    }
};

// Reply modal functions
const openReplyModal = (contact) => {
    console.log('openReplyModal called with contact:', contact);
    const modal = document.getElementById('reply-modal');
    const title = document.getElementById('reply-modal-title');
    const form = document.getElementById('reply-form');
    
    console.log('Reply modal elements:', { modal, title, form });
    
    if (!modal || !title || !form) {
        console.error('Reply modal elements not found');
        showError('Reply modal elements not found');
        return;
    }
    
    // Populate the form with contact details
    document.getElementById('reply-to').value = contact.email;
    document.getElementById('reply-subject').value = `Re: ${contact.subject}`;
    document.getElementById('original-message').textContent = contact.message;
    document.getElementById('reply-message').value = '';
    
    // Store contact ID for form submission
    form.dataset.contactId = contact._id;
    
    // Force modal to show
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.classList.add('active');
    
    console.log('Reply modal should now be active');
};

// Handle reply form submission
const handleReplySubmit = async e => {
    console.log('Reply form submission started');
    e.preventDefault();
    
    const form = e.target;
    const contactId = form.dataset.contactId;
    const formData = new FormData(form);
    
    const replyData = {
        to: formData.get('to')?.trim(),
        subject: formData.get('subject')?.trim(),
        message: formData.get('message')?.trim()
    };

    console.log('Reply data to submit:', replyData);
    console.log('Contact ID:', contactId);
    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    // Validate required fields
    if (!replyData.to || !replyData.subject || !replyData.message) {
        showError('To, subject, and message are required');
        return;
    }

    try {
        console.log('Making API request to:', `/api/contact/reply-to/${contactId}`);
        const response = await apiRequest(`/api/contact/reply-to/${contactId}`, {
            method: 'POST',
            body: JSON.stringify(replyData)
        });

        console.log('Response received:', response);
        console.log('Response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('Response data:', result);
            showSuccess('Reply sent successfully!');
            closeModals();
            loadContacts();
            loadDashboardStats();
        } else {
            const error = await response.json();
            console.error('Error response:', error);
            showError(error.message || 'Failed to send reply');
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        showError('Network error. Please try again.');
    }
};

// Keep the global functions for backward compatibility and testing
window.editProject = editProject;
window.deleteProject = deleteProject;
window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
window.viewContact = viewContact;
window.replyContact = replyContact;
window.deleteContact = deleteContact;

// Utility functions
const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('admintoken');
    
    if (!token) {
        console.error('No authentication token found');
        logout();
        return;
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    // Add body only if present
    if (options.body) {
        mergedOptions.body = options.body;
    }

    try {
        const response = await fetch(url, mergedOptions);
        
        if (response.status === 401) {
            console.error('Authentication failed, logging out');
            showError('Session expired. Please login again.');
            logout();
            return;
        }
        
        if (response.status === 403) {
            showError('Access denied. You do not have permission for this action.');
            return response;
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return response;
    } catch (error) {
        console.error('API request error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Network error. Please check your connection.');
        } else {
            showError(error.message || 'An error occurred while processing your request.');
        }
        throw error;
    }
};

const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('admintoken');
    localStorage.removeItem('adminuser');
    
    // Clear any other session data
    sessionStorage.clear();
    
    // Show logout message
    showSuccess('Logged out successfully');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = '/admin';
    }, 1000);
};

const formatDate = dateString => {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const showSuccess = message => {
    showNotification(message, 'success');
};

const showError = message => {
    showNotification(message, 'error');
};

const showNotification = (message, type) => {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'success' ? 'success-message' : 'error-message'}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
};

