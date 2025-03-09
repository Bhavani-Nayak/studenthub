
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

## Components Breakdown

### Core Components

1. **AuthContext.tsx**
   - Authentication context provider that manages user login/logout
   - Handles user state persistence with localStorage
   - Provides role-based access control (admin, faculty, student)
   - Contains mock user data for demonstration purposes

2. **DashboardLayout.tsx**
   - Main layout wrapper for all dashboard pages
   - Contains responsive layout logic
   - Renders the sidebar and main content area
   - Handles access control based on user roles

3. **PrivateRoute.tsx**
   - Protects routes from unauthorized access
   - Redirects unauthenticated users to the login page
   - Wraps protected routes with the DashboardLayout

4. **Sidebar.tsx**
   - Responsive navigation sidebar
   - Shows different menu items based on user role
   - Manages navigation between different sections

### Dashboard Components

1. **DashboardHeader.tsx**
   - Page header component with title and logo
   - Used across different dashboard pages for consistent branding

2. **StatsCards.tsx**
   - Displays key statistics in card format
   - Used on the dashboard to show summary metrics
   - Configurable for different user roles

3. **QuickAccessCards.tsx**
   - Navigation shortcuts to frequently used sections
   - Interactive cards that link to different parts of the application

4. **AdminCharts.tsx**
   - Data visualization components for administrators and faculty
   - Includes performance bar charts and attendance pie charts

5. **StudentCharts.tsx**
   - Student-specific performance visualizations
   - Shows academic progress by course

### Page Components

1. **Index.tsx**
   - Landing/login page for the application
   - Contains the authentication form

2. **Dashboard.tsx**
   - Main dashboard that adapts based on user role
   - Shows relevant statistics, charts, and quick access cards

3. **StudentData.tsx**
   - Displays student records in a tabular format
   - Different views for admin, faculty, and students

4. **Attendance.tsx**
   - For faculty: Interface for marking student attendance
   - For students: View of their attendance history
   - For admin: Overview of attendance records

5. **Performance.tsx**
   - Visualizations of academic performance
   - Grade tracking and comparisons

6. **Courses.tsx**
   - Course listings and timetable information
   - Class schedule management

7. **Users.tsx**
   - Admin-only page for user management
   - Create, edit, and manage user accounts

8. **NotFound.tsx**
   - 404 error page for handling invalid routes

## UI Components

The application uses shadcn/ui components, which are built on top of Radix UI primitives. These include:

- **Button, Card, Table**: Basic UI building blocks
- **Tabs, Tooltip**: Interactive UI elements
- **Toast**: Notification system
- **Dialog, Popover**: Modal and popup interfaces

## Technologies & Dependencies

### Core Framework & Build Tools

- **React**: The frontend library for building user interfaces
  - *Used for*: Creating interactive components and managing state

- **TypeScript**: Provides type safety to enhance code quality and developer experience
  - *Used for*: Static typing, better autocomplete, and catching errors during development

- **Vite**: Fast and efficient build tool for modern web applications
  - *Used for*: Quick development server, optimized builds, and hot module replacement

### Routing & Navigation

- **react-router-dom**: Handles client-side routing between different pages
  - *Used for*: Navigation between pages without full page reloads
  - *Used in*: App.tsx for route definitions, PrivateRoute for protected routes

### UI Components & Styling

- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom user interfaces
  - *Used for*: Styling components without writing custom CSS
  - *Used in*: All component files for styling

- **shadcn/ui**: A collection of accessible and customizable UI components built on Radix UI
  - *Used for*: Providing consistent, accessible UI components
  - *Used in*: Throughout the application for buttons, cards, forms, etc.

- **Radix UI**: Low-level, accessible UI primitives for building high-quality components
  - *Used for*: Foundation for shadcn/ui components
  - *Used in*: Indirectly through shadcn/ui components

- **Lucide React**: Modern icon library with clean, consistent designs
  - *Used for*: All icons in the application
  - *Used in*: Sidebar, dashboard cards, buttons

- **class-variance-authority**: Utility for creating variant-based component styles
  - *Used for*: Defining component variants with different styles
  - *Used in*: shadcn/ui component definitions

- **clsx** & **tailwind-merge**: Tools for conditionally joining class names and resolving conflicts
  - *Used for*: Managing complex class combinations
  - *Used in*: Utils.ts for the cn helper function

### Data Visualization

- **Recharts**: Composable charting library built on React components
  - *Used for*: Creating performance and attendance charts
  - *Used in*: AdminCharts.tsx, StudentCharts.tsx

### State Management & Data Fetching

- **@tanstack/react-query**: Powerful data synchronization library
  - *Used for*: Fetching, caching, and updating data
  - *Used in*: Set up in App.tsx but not yet fully utilized

### Forms & Validation

- **React Hook Form**: Performant, flexible forms with easy validation
  - *Used for*: Form handling in the application
  - *Used in*: Not fully implemented but available for use

- **Zod**: TypeScript-first schema validation library
  - *Used for*: Validating form inputs
  - *Used in*: Not fully implemented but available for use

### Date & Time Handling

- **date-fns**: Modern JavaScript date utility library
  - *Used for*: Date formatting and manipulation
  - *Used in*: Not fully implemented but available for use

### Toast Notifications

- **sonner**: Lightweight, customizable toast notification system
  - *Used for*: User feedback and notifications
  - *Used in*: Toast messages in AuthContext.tsx and feature placeholders

### Animations & Transitions

- **tailwindcss-animate**: Animation utilities for Tailwind CSS
  - *Used for*: Adding animations to UI elements
  - *Used in*: Various components for transition effects

- **Vaul**: Modal and drawer animations
  - *Used for*: Enhanced drawer and modal experiences
  - *Used in*: Not fully implemented but available for use

## Authentication & Authorization

The application implements a role-based access control system with three user types:

- **Admin**: Full access to all features, including user management
- **Faculty**: Access to student data, attendance, performance metrics, and courses
- **Student**: Limited access to personal performance data and course information

Authentication is currently implemented using mock data in AuthContext.tsx for demonstration purposes, with plans to integrate with backend services in future iterations.

## Key Features

1. **Role-based Dashboards**: Different views for administrators, faculty, and students
2. **Academic Performance Tracking**: Visualizations of student grades and progress
3. **Attendance Management**: Track and report student attendance 
4. **Course Management**: Information about courses, schedules, and materials
5. **Student Records**: Comprehensive student information database
6. **User Management**: Administrative controls for user accounts and permissions

## How to Modify the Application

### Changing UI Elements

- **Layout Changes**: 
  - `src/components/DashboardLayout.tsx` - Overall dashboard structure
  - `src/components/Sidebar.tsx` - Navigation menu
  
- **Styling Changes**:
  - `tailwind.config.ts` - Theme colors and global styling options
  - `src/index.css` - Global CSS styles
  
- **Logo & Branding**:
  - `src/components/dashboard/DashboardHeader.tsx` - Logo in dashboard
  - `src/pages/Index.tsx` - Logo on login page

### Modifying Pages

- **Dashboard**: 
  - `src/pages/Dashboard.tsx` - Main dashboard page
  - `src/components/dashboard/StatsCards.tsx` - Statistics cards
  - `src/components/dashboard/QuickAccessCards.tsx` - Quick access menu cards
  - `src/components/dashboard/AdminCharts.tsx` & `StudentCharts.tsx` - Charts and visualizations
  
- **Student Data**:
  - `src/pages/StudentData.tsx` - Student records page
  
- **Attendance**:
  - `src/pages/Attendance.tsx` - Attendance management
  
- **Courses**:
  - `src/pages/Courses.tsx` - Course information and timetable
  
- **Performance**:
  - `src/pages/Performance.tsx` - Academic performance metrics

### Changing Authentication & Users

- **Authentication Logic**:
  - `src/components/AuthContext.tsx` - User authentication and role management
  
- **Mock User Data**:
  - `src/components/AuthContext.tsx` - Contains MOCK_USERS array with sample users
  
- **Route Protection**:
  - `src/components/PrivateRoute.tsx` - Access control for routes
  - `src/App.tsx` - Route definitions and protection settings

### Adding New Features

1. **New Page**:
   - Create a new file in `src/pages/`
   - Add the route to `src/App.tsx`
   - Add navigation link to `src/components/Sidebar.tsx` if needed
   
2. **New Component**:
   - Create component in appropriate directory (`src/components/` or `src/components/dashboard/`)
   - Import and use in relevant pages

3. **New Functionality**:
   - For data fetching: Use React Query in the relevant component/page
   - For state management: Extend context providers or create new ones in `src/components/`

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
