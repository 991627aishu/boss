import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import { Link } from 'react-router-dom';

const SectionPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  // Section data based on the handwritten notes
  const sectionData = {
    'sdc': {
      title: 'Student Disciplinary Committee',
      subtitle: 'SDC',
      icon: '⚖️',
      color: 'from-red-500 to-red-600',
      items: [
        { title: 'Student Code of Conduct', type: 'File', icon: '📄' },
        { title: 'SDC Committee', type: 'File', icon: '📋' },
        { title: 'Anonymous Complaint Form', type: 'Form', icon: '📝' },
        { title: 'Complaint Form', type: 'Form', icon: '📝' },
        { title: 'Showcause Notice', type: 'Template', icon: '📄' },
        { title: 'Hearing Notice', type: 'Template', icon: '📄' },
        { title: 'SDC Decision', type: 'Template', icon: '📄' },
        { title: 'Complaint Withdrawal Form', type: 'Form', icon: '📝' },
        { title: 'UGC Notifications', type: 'Notification', icon: '📢' },
        { title: 'Student Clubs', type: 'Info', icon: '🎯' },
        { title: 'New Event Proposal Form', type: 'Form', icon: '📝' },
        { title: 'Reimbursement Form', type: 'Form', icon: '💰' },
        { title: 'Cash Advance Form', type: 'Form', icon: '💰' },
        { title: 'Event Completion Report Form', type: 'Form', icon: '📊' },
        { title: 'New Club Proposal Form', type: 'Form', icon: '📝' },
        { title: 'Club Closure Form', type: 'Form', icon: '📝' },
        { title: 'External Sponsor MOU Template', type: 'Template', icon: '📄' }
      ]
    },
    'student-clubs': {
      title: 'Student Clubs',
      subtitle: 'Clubs & Activities',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      items: [
        { title: 'Event Proposal Form', type: 'Form', icon: '📝' },
        { title: 'Reimbursement Form', type: 'Form', icon: '💰' },
        { title: 'Status of Reimbursement (Docs Pending)', type: 'Status', icon: '⏳' },
        { title: 'RVU Policy', type: 'Policy', icon: '📋' },
        { title: 'List of Sponsorships', type: 'List', icon: '📋' },
        { title: 'Mandatory Event Completion Form', type: 'Form', icon: '📝', note: 'with Video/Photo Submission' }
      ]
    },
    'sgrc': {
      title: 'Student Grievance Redressal Committee',
      subtitle: 'SGRC',
      icon: '🤝',
      color: 'from-green-500 to-green-600',
      items: [
        { title: 'Complaint Form', type: 'Form', icon: '📝' },
        { title: 'Anonymous Complaint Form', type: 'Form', icon: '📝' },
        { title: 'Notice Form', type: 'Form', icon: '📄' },
        { title: 'Resolution Note', type: 'Document', icon: '📄' },
        { title: 'UGC Notifications', type: 'Notification', icon: '📢' }
      ]
    },
    'external-events': {
      title: 'External Event Participation',
      subtitle: 'Events & Participation',
      icon: '🌍',
      color: 'from-purple-500 to-purple-600',
      items: [
        { title: 'Note for Approval', type: 'Form', icon: '📝' },
        { title: 'Reimbursement Form', type: 'Form', icon: '💰' },
        { title: 'Status of Reimbursement (Docs Pending)', type: 'Status', icon: '⏳' },
        { title: 'RVU Policy', type: 'Policy', icon: '📋' },
        { title: 'Sponsorship List', type: 'List', icon: '📋' }
      ]
    },
    'innovation': {
      title: 'Centre for Innovation and Entrepreneurship',
      subtitle: 'Innovation Hub',
      icon: '💡',
      color: 'from-yellow-500 to-yellow-600',
      items: [
        { title: 'Startup Proposals', type: 'Proposal', icon: '🚀' },
        { title: 'Entrepreneurship Projects', type: 'Project', icon: '💼' },
        { title: 'Incubation Applications', type: 'Application', icon: '📝' },
        { title: 'Prototype Development', type: 'Development', icon: '🔧' },
        { title: 'Funding Support', type: 'Support', icon: '💰' },
        { title: 'RVU IPR Policy', type: 'Policy', icon: '📋' }
      ]
    },
    'equity-cell': {
      title: 'Equity Cell',
      subtitle: 'Equity & Inclusion',
      icon: '⚖️',
      color: 'from-pink-500 to-pink-600',
      items: [
        { title: 'Awareness Campaigns', type: 'Campaign', icon: '📢' },
        { title: 'Counseling Support', type: 'Support', icon: '🤝' },
        { title: 'UGC Notifications', type: 'Notification', icon: '📢' },
        { title: 'Anti-Discrimination Rules', type: 'Rules', icon: '📋' }
      ]
    },
    'anti-ragging': {
      title: 'Anti-Ragging Committee',
      subtitle: 'Anti-Ragging',
      icon: '🛡️',
      color: 'from-orange-500 to-orange-600',
      items: [
        { title: 'UGC Notification', type: 'Notification', icon: '📢' },
        { title: 'Mandatory Declaration Form', type: 'Form', icon: '📝' },
        { title: 'ARC Meeting Reports', type: 'Report', icon: '📊' },
        { title: 'Anonymous Complaint Form', type: 'Form', icon: '📝' },
        { title: 'Monitoring Form', type: 'Form', icon: '📝' }
      ]
    },
    'mentor-mentee': {
      title: 'Mentor-Mentee',
      subtitle: 'Mentorship Program',
      icon: '👥',
      color: 'from-teal-500 to-teal-600',
      items: [
        { title: 'Monthly Meeting Reports', type: 'Report', icon: '📊' },
        { title: 'Attendance Records', type: 'Record', icon: '📋' },
        { title: 'Mentee Feedback', type: 'Feedback', icon: '💬' },
        { title: 'Faculty Feedback', type: 'Feedback', icon: '💬' },
        { title: 'Student Progress Reports', type: 'Report', icon: '📊' }
      ]
    },
    'not-for-approval': {
  title: 'Note For Approval',
  subtitle: 'Approval Process',
  icon: '📝',
  color: 'from-yellow-500 to-yellow-600',
  items: [
    { title: 'NFA Details Form', type: 'Form', icon: '🧾' },
    { title: 'Budget Requirements', type: 'Table', icon: '💰' },
    { title: 'Financial Impact Analysis', type: 'Report', icon: '📊' },
    { title: 'AI-Generated NFA Content', type: 'Document', icon: '🤖' },
    { title: 'Download Final NFA', type: 'Action', icon: '⬇️' }
  ]
},
  };

  const section = sectionData[sectionId];

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Section Not Found</h1>
          <button
            onClick={() => navigate('/home')}
            className="bg-rvu-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleItemClick = (item) => {
    // Placeholder for future API integration
    console.log(`Clicked on ${item.title} - ${item.type}`);
    // Here you would typically make an API call or navigate to a form/document
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{section.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
                  <p className="text-gray-600">{section.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Resources</h2>
          <p className="text-gray-600">Click on any item below to access forms, documents, or information</p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover-lift fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'Form' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'Template' ? 'bg-green-100 text-green-800' :
                      item.type === 'Policy' ? 'bg-purple-100 text-purple-800' :
                      item.type === 'Notification' ? 'bg-yellow-100 text-yellow-800' :
                      item.type === 'Report' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-gray-400 text-sm">Click to access</span>
                  </div>
                  {item.note && (
                    <p className="text-sm text-gray-500 mt-2">{item.note}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact the {section.title} for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionPage;
