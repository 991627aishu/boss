# RV University Student Services Portal

A modern, responsive web application built with React and TailwindCSS for RV University's student services portal.

## Features

- **QR Code Landing Page**: Clean, branded landing page with RV University logo
- **Interactive Homepage**: 8 clickable committee/service boxes in a responsive grid layout
- **Section Pages**: Individual pages for each committee with organized content cards
<<<<<<< HEAD
- **NFA Automation**: AI-powered NFA (No Further Action) document generation
=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
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
<<<<<<< HEAD
9. **NFA Automation** - AI-powered document generation
=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
<<<<<<< HEAD
- Python 3.7+ (for NFA automation features)
=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

### Installation

1. Clone or download the project files
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

<<<<<<< HEAD
4. Install Python dependencies (for NFA automation):

```bash
cd backend/python
pip install -r requirements.txt
```

### Running the Application

Start both frontend and backend servers:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend server
npm start
```

The application will open in your browser at `http://localhost:3002`
The backend API will be available at `http://localhost:5000`
=======
### Running the Application

Start the development server:

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

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
<<<<<<< HEAD
│   ├── SectionPage.js      # Individual section pages
│   └── NfaAutomationForm.js # NFA automation form
├── App.js                  # Main app component with routing
├── index.js               # Entry point
└── index.css              # Global styles and TailwindCSS

backend/
├── server.js              # Express.js backend server
├── python/
│   ├── generate_nfa_automation.py # AI-powered NFA generation
│   └── requirements.txt   # Python dependencies
└── generated_letters/     # Generated NFA documents
=======
│   └── SectionPage.js      # Individual section pages
├── App.js                  # Main app component with routing
├── index.js               # Entry point
└── index.css              # Global styles and TailwindCSS
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
```

## Technology Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
<<<<<<< HEAD
- **Express.js**: Backend API server
- **Python**: AI-powered document generation
- **OpenAI API**: AI text generation
- **python-docx**: Word document generation

## NFA Automation Features

- AI-powered NFA document generation
- Multiple NFA types (reimbursement, advance, etc.)
- Customizable content with bullet points
- Table data integration
- Document editing capabilities
- Download as Word documents
=======
- **Responsive Design**: Mobile-first approach
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

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

<<<<<<< HEAD
## API Endpoints

- `GET /api/health` - Health check
- `GET /api/test-python` - Test Python integration
- `POST /api/generate-nfa` - Generate NFA document
- `POST /api/edit-nfa` - Edit NFA document
- `POST /api/download-edited-nfa` - Download edited NFA

## Troubleshooting

If you encounter issues:

1. **Python not found**: Ensure Python 3.7+ is installed and in PATH
2. **Dependencies missing**: Run `pip install -r backend/python/requirements.txt`
3. **Port conflicts**: Change ports in `package.json` and `backend/server.js`
4. **CORS issues**: Check backend CORS configuration

=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344
## Future Enhancements

- Backend API integration for form submissions
- User authentication and role-based access
- Document upload/download functionality
- Real-time notifications
- Admin dashboard for content management
<<<<<<< HEAD
- Enhanced AI features for document generation
=======
>>>>>>> 01c2e338bf6394697bda0e18a8ef44375a469344

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 RV University. All rights reserved.
