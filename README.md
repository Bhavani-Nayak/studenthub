
# StudentHub - Educational Management System

## Project Overview

StudentHub is a comprehensive educational management system designed to help administrators, faculty, and students track academic progress, attendance, and course information. The platform provides intuitive dashboards with visualizations and data management tools for the entire educational ecosystem.

## Live Demo

**URL**: https://lovable.dev/projects/9d1ef81c-754a-42a9-b15a-9867ec192ac8

## Project Structure

```
student-track-compass/
├── public/                 # Static assets
│   ├── lovable-uploads/    # Uploaded images and files
│   └── og-image.png        # Open Graph image for social sharing
├── src/
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── ui/             # UI components from shadcn/ui
│   │   ├── AuthContext.tsx # Authentication context provider
│   │   ├── DashboardLayout.tsx # Layout wrapper for dashboard pages
│   │   ├── PrivateRoute.tsx    # Route protection component
│   │   └── Sidebar.tsx     # Navigation sidebar component
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx  # Hook for responsive design
│   │   └── use-toast.ts    # Toast notification hook
│   ├── lib/                # Utility libraries
│   │   └── utils.ts        # General utility functions
│   ├── pages/              # Application pages
│   │   ├── Index.tsx       # Landing/login page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── StudentData.tsx # Student information management
│   │   ├── Attendance.tsx  # Attendance tracking
│   │   ├── Performance.tsx # Academic performance metrics
│   │   ├── Courses.tsx     # Course management
│   │   ├── Users.tsx       # User management (admin only)
│   │   └── NotFound.tsx    # 404 page
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Technologies & Dependencies

### Core Framework & Build Tools

- **React**: The frontend library for building user interfaces
- **TypeScript**: Provides type safety to enhance code quality and developer experience
- **Vite**: Fast and efficient build tool for modern web applications

### Routing & Navigation

- **react-router-dom**: Handles client-side routing between different pages

### UI Components & Styling

- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom user interfaces
- **shadcn/ui**: A collection of accessible and customizable UI components built on Radix UI
- **Radix UI**: Low-level, accessible UI primitives for building high-quality components
- **Lucide React**: Modern icon library with clean, consistent designs
- **class-variance-authority**: Utility for creating variant-based component styles
- **clsx** & **tailwind-merge**: Tools for conditionally joining class names and resolving conflicts

### Data Visualization

- **Recharts**: Composable charting library built on React components for visualizing student performance and attendance data

### State Management & Data Fetching

- **@tanstack/react-query**: Powerful data synchronization library for fetching, caching, and updating data

### Forms & Validation

- **React Hook Form**: Performant, flexible forms with easy validation
- **Zod**: TypeScript-first schema validation library

### Date & Time Handling

- **date-fns**: Modern JavaScript date utility library

### Toast Notifications

- **sonner**: Lightweight, customizable toast notification system

### Animations & Transitions

- **tailwindcss-animate**: Animation utilities for Tailwind CSS
- **Vaul**: Modal and drawer animations

## Authentication & Authorization

The application implements a role-based access control system with three user types:
- **Admin**: Full access to all features, including user management
- **Faculty**: Access to student data, attendance, performance metrics, and courses
- **Student**: Limited access to personal performance data and course information

Authentication is currently implemented using mock data for demonstration purposes, with plans to integrate with backend services in future iterations.

## Key Features

1. **Role-based Dashboards**: Different views for administrators, faculty, and students
2. **Academic Performance Tracking**: Visualizations of student grades and progress
3. **Attendance Management**: Track and report student attendance 
4. **Course Management**: Information about courses, schedules, and materials
5. **Student Records**: Comprehensive student information database
6. **User Management**: Administrative controls for user accounts and permissions

## Development

To develop this project locally:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment

The application can be deployed directly from Lovable by clicking on Share -> Publish, or by exporting the codebase to GitHub and using your preferred hosting service.

## Custom Domain

For custom domain deployment, Netlify is recommended. Please refer to [our documentation](https://docs.lovable.dev/tips-tricks/custom-domain/) for detailed instructions.
