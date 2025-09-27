import React from 'react';

const NfaPreview = ({ content, tableData = [] }) => {
  // Parse the content to extract different sections
  const parseContent = (content) => {
    if (!content) return { subject: '', body: '', conclusion: '' };
    
    const lines = content.split('\n').filter(line => line.trim());
    let subject = '';
    let body = '';
    let conclusion = '';
    
    // Find subject (usually first line or after "Subject:")
    const subjectIndex = lines.findIndex(line => 
      line.toLowerCase().includes('subject:') || 
      (lines.indexOf(line) === 0 && !line.toLowerCase().includes('request for approval'))
    );
    
    if (subjectIndex !== -1) {
      subject = lines[subjectIndex].replace(/^Subject:\s*/i, '').trim();
    }
    
    // Find conclusion (usually contains "proposal is submitted")
    const conclusionIndex = lines.findIndex(line => 
      line.toLowerCase().includes('proposal is submitted') ||
      line.toLowerCase().includes('kindly be released') ||
      line.toLowerCase().includes('kindly be reimbursed')
    );
    
    if (conclusionIndex !== -1) {
      conclusion = lines[conclusionIndex];
    }
    
    // Body is everything between subject and conclusion
    const bodyStart = subjectIndex + 1;
    const bodyEnd = conclusionIndex !== -1 ? conclusionIndex : lines.length;
    body = lines.slice(bodyStart, bodyEnd).join('\n');
    
    return { subject, body, conclusion };
  };

  const { subject, body, conclusion } = parseContent(content);
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Parse body content to separate request paragraph and bullet points
  const parseBodyContent = (body) => {
    if (!body) return { requestParagraph: '', bulletPoints: [] };
    
    const lines = body.split('\n').filter(line => line.trim());
    const requestParagraph = lines.find(line => 
      line.toLowerCase().includes('request for approval')
    ) || '';
    
    const bulletPoints = lines.filter(line => 
      line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')
    ).map(line => line.replace(/^[•\-*]\s*/, '').trim());
    
    return { requestParagraph, bulletPoints };
  };

  const { requestParagraph, bulletPoints } = parseBodyContent(body);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <img 
                src="/rv logo.jpeg" 
                alt="RV University Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RV UNIVERSITY</h1>
              <p className="text-blue-100 text-sm">Go, change the world</p>
              <p className="text-blue-100 text-xs">an initiative of RV EDUCATIONAL INSTITUTIONS</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>RV Vidyaniketan, 8th Mile, Mysuru Road</p>
            <p>Bengaluru, 560059, India</p>
            <p>Ph: +91 80 68199900 | www.rvu.edu.in</p>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="p-8 space-y-6">
        {/* Date - Right Aligned */}
        <div className="text-right">
          <p className="text-gray-700 font-medium">Date: {currentDate}</p>
        </div>

        {/* Title - Centered */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Note For Approval (NFA)</h2>
        </div>

        {/* Subject - Left Aligned with proper formatting */}
        <div className="text-left">
          <p className="text-gray-700">
            <span className="font-semibold">Subject:</span> {subject}
          </p>
        </div>

        {/* Request Paragraph */}
        {requestParagraph && (
          <div className="text-justify">
            <p className="text-gray-700 leading-relaxed">{requestParagraph}</p>
          </div>
        )}

        {/* Bullet Points */}
        {bulletPoints.length > 0 && (
          <div className="text-justify">
            <ul className="space-y-2">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 font-bold mr-2 mt-1">•</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Table Section */}
        {tableData && tableData.length > 0 && (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    {tableData[0]?.map((header, index) => (
                      <th 
                        key={index}
                        className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex}
                          className="border border-gray-300 px-4 py-3 text-gray-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Conclusion - After Table */}
        {conclusion && (
          <div className="text-justify mt-6">
            <p className="text-gray-700 leading-relaxed">{conclusion}</p>
          </div>
        )}

        {/* Signature Section */}
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-8">
            {/* Top Row Signatures */}
            <div className="space-y-4">
              <div className="border-b border-gray-300 pb-2">
                <div className="h-8"></div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">Dr Phani Kumar Pullela</p>
                <p className="text-sm text-gray-600">Dean, Student Affairs</p>
                <p className="text-xs text-gray-500 mt-1">(Prepared by)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-300 pb-2">
                <div className="h-8"></div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">Mr Chandrasekhar KN</p>
                <p className="text-sm text-gray-600">Head Finance</p>
                <p className="text-xs text-gray-500 mt-1">(Approved by)</p>
              </div>
            </div>

            {/* Bottom Row Signatures */}
            <div className="space-y-4">
              <div className="border-b border-gray-300 pb-2">
                <div className="h-8"></div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">Dr Sahana D Gowda</p>
                <p className="text-sm text-gray-600">Registrar - RV University</p>
                <p className="text-xs text-gray-500 mt-1">(Recommended by)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-gray-300 pb-2">
                <div className="h-8"></div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-700">Prof (Dr) Dwarika Prasad Uniyal</p>
                <p className="text-sm text-gray-600">Vice Chancellor (i/c)</p>
                <p className="text-xs text-gray-500 mt-1">(Approved by)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfaPreview;
