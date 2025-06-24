# ASocialI - Social Media Posting Platform

A modern, full-stack platform for creating, scheduling, and posting visually stunning content to multiple social media platforms. Built with React (Vite), Node.js/Express, and a robust API backend, it supports advanced content templates, user authentication, and seamless social integrations.

## Features

- **Multi-Platform Social Posting:** Schedule and publish posts to LinkedIn, Facebook, Instagram, and more.
- **Beautiful Festival Templates:** Unique, professional templates for major festivals (Diwali, Holi, Christmas, etc.) with dynamic, animated designs.
- **User Authentication:** Secure sign-up, sign-in, OTP verification, and social login support.
- **Content Scheduling:** Flexible scheduling for posts, including carousels and image galleries.
- **Admin Dashboard:** Manage users, posts, and platform settings.
- **API-Driven:** Clean separation of client, admin, and server codebases.
- **Responsive UI:** Built with Tailwind CSS and Framer Motion for smooth, modern interfaces.
- **Image Uploads & Management:** Upload, preview, and manage images for posts.
- **Analytics:** Track engagement (likes, comments, views) for each post.

## Project Structure

```
Social-Media-Posting/
├── admin/      # Admin dashboard (React + Vite)
├── client/     # Main user-facing app (React + Vite)
├── server/     # Node.js/Express backend API
├── Messages/   # Localization files
├── public/     # Static assets
├── uploads/    # Uploaded images
├── Readme.md   # This file
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/Social-Media-Posting.git
   cd Social-Media-Posting
   ```
2. **Install dependencies for each app:**
   ```sh
   cd admin && npm install && cd ../client && npm install && cd ../server && npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the `server/` folder and fill in your API keys, DB connection, and social credentials.

### Running the Apps

- **Start the backend server:**
  ```sh
  cd server
  npm run dev
  ```
- **Start the client app:**
  ```sh
  cd client
  npm run dev
  ```
- **Start the admin dashboard:**
  ```sh
  cd admin
  npm run dev
  ```

Visit the client at `http://localhost:5173` and the admin at `http://localhost:5174` (or as configured).

## Usage

- **Create and schedule posts** with beautiful templates.
- **Authenticate** via email/OTP or social login.
- **Connect your social accounts** and authorize posting.
- **Manage posts and analytics** from the dashboard.

## Customization

- Update API endpoints or add new features in `server/`.
- Adjust UI themes and styles in `tailwind.config.js` and CSS files.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

**Made with ❤️ by bitrox.tech**
