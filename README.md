# Bug Blitz

A modern, collaborative issue tracking system built with Next.js 15, TypeScript, and Server Actions. This platform allows users to create projects, manage issues, and collaborate with team members effectively.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - Role-based access control (Admin, Project Owner, Member)
  - Profile management and customization

- **Project Management**
  - Create and manage multiple projects
  - Invite team members to projects
  - Customizable project settings
  - Project activity tracking

- **Issue Tracking**
  - Create, update, and resolve issues
  - Rich text issue descriptions with markdown support
  - Issue categorization and priority levels
  - Issue assignments and due dates
  - Comment thread for each issue

- **Admin Features**
  - User management and role assignment
  - Project oversight and moderation
  - System-wide analytics and reporting

## 💻 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Server Actions**: Used for all data mutations

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/dontforgetsemicologne/bugblitz
cd bugblitz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
DATABASE_URL="your-mongodb-url"
NEXTAUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

5. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
├── app/
│   ├── (auth)/     # Authentication pages
│   ├── projects/   # Project-related pages
│   └── issues/     # Issue-related pages
├── components/     # Reusable components
├── lib/           # Utility functions and shared logic
│   ├── actions/   # Server actions
│   └── utils/     # Helper functions
├── prisma/        # Database schema
└── public/        # Static assets
```

## 🔐 Security

- All routes are protected with NextAuth.js authentication
- Server-side validation using Server Actions
- Data validation with Zod
- XSS protection with proper content sanitization
- CSRF protection with Next.js built-in security

## 🤝 Server Actions

Main server actions available in the application:

- `createProject` - Create a new project
- `updateProject` - Update project details
- `deleteProject` - Delete a project (admin only)
- `createIssue` - Create a new issue
- `updateIssue` - Update an issue
- `deleteIssue` - Delete an issue
- `addProjectMember` - Add a member to a project
- `removeProjectMember` - Remove a member from a project

## 🔄 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🌟 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Our amazing contributors and users

## 📧 Contact

For any queries or support, please create an issue on GitHub: [Create an issue](https://github.com/yourusername/issue-tracker/issues)