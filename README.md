# Personal Portfolio - Full Stack Web Application

A modern, responsive personal portfolio website built with the MERN stack (MongoDB, Express.js, Node.js) featuring a dynamic admin dashboard for content management.

## 🚀 Project Overview

This is a comprehensive personal portfolio application that showcases professional work, blog posts, and provides a contact system. The application includes both a public-facing portfolio website and a secure admin dashboard for content management.

### Key Features

- **Public Portfolio Website**: Modern, responsive design showcasing projects, skills, and blog posts
- **Admin Dashboard**: Secure content management system for projects, blogs, and contact messages
- **Authentication System**: JWT-based authentication for admin access
- **Content Management**: CRUD operations for projects, blog posts, and contact management
- **Contact System**: Contact form with message management
- **Responsive Design**: Mobile-first approach with Bootstrap and custom CSS
- **Security Features**: Rate limiting, helmet security, CORS protection
- **Real-time Updates**: Dynamic content loading without page refresh
- **Image Management**: Support for project and blog images with placeholder fallbacks

## ⚡ Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd Personal-Portfolio
npm install

# Create .env file with your configuration
echo "PORT=8000\nDBsurl=mongodb://127.0.0.1:27017/haq_portfolio\nJWT_SECRET=your_secret_key" > .env

# Start development server
npm run dev
```

Visit `http://localhost:8000` to see your portfolio!

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **nodemailer** - Email functionality
- **express-rate-limit** - Rate limiting for API protection
- **helmet** - Security middleware

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with responsive design
- **JavaScript (ES6+)** - Client-side functionality
- **Bootstrap 5** - UI framework for responsive design
- **Font Awesome** - Icon library

### Development Tools
- **nodemon** - Development server with auto-restart
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Personal Portfolio/
├── App/
│   ├── controller/
│   │   ├── admin/
│   │   │   ├── blog.js
│   │   │   ├── contact.js
│   │   │   ├── projects.js
│   │   │   └── roles.js
│   │   └── web/
│   ├── middleware/
│   │   └── usermiddle.js
│   ├── models/
│   │   ├── admin/
│   │   │   ├── blog.js
│   │   │   ├── contact.js
│   │   │   ├── projects.js
│   │   │   └── user.js
│   │   └── web/
│   └── routes/
│       ├── admin/
│       │   ├── admin.js
│       │   ├── blogs.js
│       │   ├── contact.js
│       │   └── projects.js
│       └── web/
├── public/
│   ├── assets/
│   │   ├── bootstrap/
│   │   └── hero.jpeg
│   ├── admin.html
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── index.html
│   ├── index.js
│   ├── login.js
│   └── style.css
├── main.js
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Personal-Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   DBsurl=mongodb://127.0.0.1:27017/haq_portfolio
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally, or
   - Update the `DBsurl` in `.env` with your MongoDB Atlas connection string

5. **Create Admin User**
   ```bash
   npm run create-admin
   ```

6. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Access the application**
   - Public Portfolio: `http://localhost:8000`
   - Admin Login: `http://localhost:8000/admin`
   - Dashboard: `http://localhost:8000/dashboard`

## 📊 Database Models

### Project Model
```javascript
{
  title: String (required),
  description: String (required),
  technologies: String (required),
  githuburl: String (optional),
  liveurl: String (optional),
  imageUrl: String (default: placeholder),
  featured: Boolean (default: false),
  timestamps: true
}
```

### Blog Model
```javascript
{
  title: String (required),
  content: String (required),
  excerpt: String (required),
  author: String (default: "Admin"),
  tags: [String],
  imageUrl: String (default: placeholder),
  published: Boolean (default: true),
  timestamps: true
}
```

### Contact Model
```javascript
{
  name: String (required),
  email: String (required),
  subject: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'replied'], default: 'new'),
  timestamps: true
}
```

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: "admin"),
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/admin/register` - Register new admin user
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (protected)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Blogs
- `GET /api/blogs` - Get all published blogs
- `POST /api/blogs` - Create new blog post (protected)
- `PUT /api/blogs/:id` - Update blog post (protected)
- `DELETE /api/blogs/:id` - Delete blog post (protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (protected)
- `PUT /api/contact/:id` - Update message status (protected)

## 🎨 Frontend Features

### Public Portfolio (`index.html`)
- **Hero Section**: Introduction with call-to-action buttons
- **About Section**: Personal information and statistics
- **Skills Section**: Categorized technical skills
- **Projects Section**: Dynamic project showcase
- **Blog Section**: Latest blog posts display
- **Contact Section**: Contact form and information

### Admin Dashboard (`dashboard.html`)
- **Dashboard Overview**: Statistics and quick insights
- **Project Management**: CRUD operations for projects
- **Blog Management**: CRUD operations for blog posts
- **Contact Management**: Message handling and status updates
- **Responsive Design**: Mobile-friendly admin interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: API protection against abuse
- **Helmet Security**: HTTP headers security
- **CORS Protection**: Cross-origin resource sharing control
- **Input Validation**: Server-side validation for all inputs

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set up environment variables for production
2. Configure MongoDB connection
3. Set up reverse proxy (nginx recommended)
4. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start main.js --name "portfolio"
   ```

## 📱 Responsive Design

The application is built with a mobile-first approach:
- Bootstrap 5 for responsive grid system
- Custom CSS for enhanced styling
- Font Awesome icons for visual elements
- Optimized for all device sizes

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run API tests
- `npm run create-admin` - Create initial admin user

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod`
   - Check connection string in `.env`
   - Verify MongoDB service is started

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:8000 | xargs kill -9`

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Clear browser localStorage
   - Check token expiration

4. **Static Files Not Loading**
   - Verify file paths in `public/` directory
   - Check express.static middleware configuration

### Development Tips

- Use `npm run dev` for development with auto-restart
- Check browser console for frontend errors
- Monitor server logs for backend issues
- Use MongoDB Compass for database visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Ehtsham ul haq**
- Email: ehtshamhaqnawaz@gmail.com
- Phone: +92 3160143685
- Location: Islamabad, Lahore

## 🙏 Acknowledgments

- Bootstrap for the responsive framework
- Font Awesome for the icon library
- MongoDB for the database solution
- Express.js community for the excellent documentation

---

**Note**: This is a personal portfolio project showcasing full-stack development skills with modern web technologies. The application demonstrates best practices in web development, security, and user experience design. 