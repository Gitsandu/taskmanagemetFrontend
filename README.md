# Task Management Application

A modern, responsive task management application built with React, Material UI, and Vite. This application allows users to create, edit, and manage tasks with features like priority levels, due dates, and status tracking.

## Features

- **Dashboard**: Visual overview of task distribution by priority and completion rate
- **Task Management**: Create, edit, delete, and filter tasks
- **Responsive Design**: Optimized for mobile, tablet, and desktop views
- **Filtering**: Filter tasks by status, priority, and due date
- **Sorting**: Sort tasks by various criteria (due date, priority, creation date)
- **User Authentication**: Secure login and registration system

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Gitsandu/taskmanagemetFrontend.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_AUTH_TOKEN_KEY=token
   VITE_USER_DATA_KEY=user
   ```
   
   **Environment Variables:**
   
   - `VITE_API_BASE_URL`: Base URL for API requests (adjust if your backend is running on a different port or host)
   - `VITE_AUTH_TOKEN_KEY`: Local storage key for storing the authentication token
   - `VITE_USER_DATA_KEY`: Local storage key for storing user data
   
   <span style="color:red">**NOTE:** This application uses browser local storage for maintaining authentication state. User tokens and data are stored locally on the client device. For production environments, consider implementing more secure token storage methods.</span>

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build

```bash
npm run build
```

This will create an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

This will serve the production build locally for testing.

## Project Structure

```
src/
├── api/                # API service functions
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable components
│   ├── common/         # Common UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components (Navbar, Sidebar, etc.)
├── features/           # Feature-specific components
│   ├── dashboard/      # Dashboard-related components
│   └── tasks/          # Task-related components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── App.jsx            # Main App component
├── App.css            # Global styles
└── main.jsx           # Entry point
```

## Key Dependencies

- **React**: Core UI library
- **React Router**: Client-side routing
- **Material UI**: Component library for consistent design
- **Axios**: HTTP client for API requests
- **React Hook Form**: Form management and validation
- **Chart.js**: Data visualization
- **date-fns**: Date manipulation and formatting

## Usage Guide

### Dashboard

The dashboard provides visual insights into your tasks:
- **Priority Distribution**: Shows the breakdown of tasks by priority level
- **Completion Rate**: Displays task completion rate over time
- **Upcoming Deadlines**: Lists tasks with approaching due dates

### Task Management

- **Create Task**: Click the "Create Task" button to add a new task
- **Edit Task**: Click the edit icon or button on a task to modify it
- **Delete Task**: Click the delete icon or button (with confirmation)
- **Change Status**: Mark tasks as completed or pending

### Filtering and Sorting

- Use the status dropdown to filter tasks by completion status
- Use the sort dropdown to change the order of displayed tasks
- Use the search field to find specific tasks
- Use sidebar filters for quick access to common filters (Today, High Priority, Completed)

## Responsive Design

The application is optimized for various screen sizes:
- **Mobile**: Single column layout with optimized touch targets
- **Tablet**: Two-column layout for tasks and improved space utilization
- **Desktop**: Three-column layout with expanded features and visualization

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify that the backend server is running
   - Check that the `VITE_API_BASE_URL` in your `.env` file is correct
   - Ensure all required environment variables are properly set in your `.env` file

2. **Build Errors**:
   - Run `npm clean-install` to ensure dependencies are correctly installed
   - Check for any console errors during build

