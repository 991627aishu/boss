import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'sdc',
      title: 'Student Disciplinary Committee',
      subtitle: 'SDC',
      icon: '⚖️',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'student-clubs',
      title: 'Student Clubs',
      subtitle: 'Clubs & Activities',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'sgrc',
      title: 'Student Grievance Redressal Committee',
      subtitle: 'SGRC',
      icon: '🤝',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'external-events',
      title: 'External Event Participation',
      subtitle: 'Events & Participation',
      icon: '🌍',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'innovation',
      title: 'Centre for Innovation and Entrepreneurship',
      subtitle: 'Innovation Hub',
      icon: '💡',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'equity-cell',
      title: 'Equity Cell',
      subtitle: 'Equity & Inclusion',
      icon: '🌈',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'anti-ragging',
      title: 'Anti-Ragging Committee',
      subtitle: 'Anti-Ragging',
      icon: '🛡️',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'mentor-mentee',
      title: 'Mentor-Mentee',
      subtitle: 'Mentorship Program',
      icon: '👥',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'note-for-approval',
      title: 'Note For Approval',
      subtitle: 'Approval Process',
      icon: '📝',
      color: 'from-yellow-400 to-yellow-600'
    },
  ];

  const handleSectionClick = (sectionId) => {
    if (sectionId === 'note-for-approval') {
      navigate('/nfa-landing');  // 👉 Go to NFA Landing Page first
    } else {
      navigate(`/section/${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shadow-lg p-3">
              <img 
                src="/rv logo.jpeg" 
                alt="RV University Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RV University</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Services</h2>
          <p className="text-xl text-gray-600">
            Select a committee or service to access forms and resources
          </p>
        </div>

        {/* Grid of Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`bg-gradient-to-br ${section.color} rounded-xl p-8 cursor-pointer hover-lift fade-in h-[220px] w-full`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center text-white h-full flex flex-col justify-center">
                <div className="text-5xl mb-6">{section.icon}</div>
                <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                <p className="text-base opacity-90">{section.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 RV University. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
