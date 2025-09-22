# RV University Student Services Portal

A modern, responsive web application built with React and TailwindCSS for RV University's student services portal.

## Features

- **QR Code Landing Page**: Clean, branded landing page with RV University logo
- **Interactive Homepage**: 8 clickable committee/service boxes in a responsive grid layout
- **Section Pages**: Individual pages for each committee with organized content cards
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI/UX**: Elegant design with hover animations and smooth transitions
- **University Branding**: Uses RV University colors and styling

## Available Sections

1. **Student Disciplinary Committee (SDC)**
2. **Student Clubs**
3. **Student Grievance Redressal Committee**
4. **External Event Participation**
5. **Centre for Innovation and Entrepreneurship**
6. **Equity Cell**
7. **Anti-Ragging Committee**
8. **Mentor-Mentee**

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── LandingPage.js      # QR landing page
│   ├── HomePage.js         # Main homepage with 8 sections
│   └── SectionPage.js      # Individual section pages
├── App.js                  # Main app component with routing
├── index.js               # Entry point
└── index.css              # Global styles and TailwindCSS
```

## Technology Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

## Customization

### Colors
The application uses RV University branding colors defined in `tailwind.config.js`:
- `rvu-blue`: #1e3a8a
- `rvu-gold`: #f59e0b
- `rvu-teal`: #0f766e

### Content
All section content is defined in `SectionPage.js` and can be easily modified to add or update forms, documents, and resources.

### Logo
Currently uses a placeholder logo. Replace the logo placeholder in `LandingPage.js` with the actual RV University logo.

## Future Enhancements

- Backend API integration for form submissions
- User authentication and role-based access
- Document upload/download functionality
- Real-time notifications
- Admin dashboard for content management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 RV University. All rights reserved.
