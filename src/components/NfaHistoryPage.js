import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const NfaHistoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [nfaData, setNfaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewNfa, setViewNfa] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Load NFA data from localStorage on component mount
  useEffect(() => {
    loadNfaData();
  }, []);

  const loadNfaData = () => {
    try {
      const savedNfas = localStorage.getItem('nfaHistory');
      if (savedNfas) {
        const parsedData = JSON.parse(savedNfas);
        setNfaData(parsedData);
      } else {
        // Initialize with mock data if no saved data exists
        const mockNfaData = [
          {
            id: 1,
            subject: 'Alumni Meet 2024',
            type: 'Reimbursement',
            status: 'approved',
            date: '2024-09-26',
            amount: '₹15,000',
            createdBy: 'Dr. Phani Kumar',
            description: 'Annual alumni gathering event',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            subject: 'Chess Tournament',
            type: 'Advance',
            status: 'pending',
            date: '2024-09-25',
            amount: '₹8,500',
            createdBy: 'Mr. Chandrasekhar',
            description: 'Inter-college chess championship',
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            subject: 'Engineer\'s Day Celebration',
            type: 'Reimbursement',
            status: 'rejected',
            date: '2024-09-24',
            amount: '₹12,000',
            createdBy: 'Dr. Sahana Gowda',
            description: 'Annual Engineer\'s Day celebration event',
            createdAt: new Date().toISOString()
          },
          {
            id: 4,
            subject: 'Workshop on AI',
            type: 'Advance',
            status: 'approved',
            date: '2024-09-23',
            amount: '₹25,000',
            createdBy: 'Prof. Dwarika Prasad',
            description: 'Technical workshop on Artificial Intelligence',
            createdAt: new Date().toISOString()
          },
          {
            id: 5,
            subject: 'Teacher\'s Day Celebration',
            type: 'Reimbursement',
            status: 'pending',
            date: '2024-09-22',
            amount: '₹5,000',
            createdBy: 'Dr. Phani Kumar',
            description: 'Teacher\'s Day celebration and awards ceremony',
            createdAt: new Date().toISOString()
          },
          {
            id: 6,
            subject: 'Sports Meet 2024',
            type: 'Advance',
            status: 'approved',
            date: '2024-09-21',
            amount: '₹30,000',
            createdBy: 'Mr. Chandrasekhar',
            description: 'Annual sports meet and competitions',
            createdAt: new Date().toISOString()
          }
        ];
        setNfaData(mockNfaData);
        localStorage.setItem('nfaHistory', JSON.stringify(mockNfaData));
      }
    } catch (error) {
      console.error('Error loading NFA data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save NFA data to localStorage
  const saveNfaData = useCallback((data) => {
    try {
      localStorage.setItem('nfaHistory', JSON.stringify(data));
      setNfaData(data);
    } catch (error) {
      console.error('Error saving NFA data:', error);
    }
  }, []);

  // Add new NFA to history
  const addNfaToHistory = useCallback((nfaData) => {
    const newNfa = {
      ...nfaData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
      status: 'pending' // Default status
    };
    
    const updatedData = [newNfa, ...nfaData];
    saveNfaData(updatedData);
  }, [saveNfaData]);

  // Delete NFA from history
  const deleteNfa = useCallback((id) => {
    const updatedData = nfaData.filter(nfa => nfa.id !== id);
    saveNfaData(updatedData);
    setDeleteConfirm(null);
  }, [nfaData, saveNfaData]);

  // Update NFA status
  const updateNfaStatus = useCallback((id, newStatus) => {
    const updatedData = nfaData.map(nfa => 
      nfa.id === id ? { ...nfa, status: newStatus } : nfa
    );
    saveNfaData(updatedData);
  }, [nfaData, saveNfaData]);

  // Listen for new NFA creation from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'nfaHistory') {
        loadNfaData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-refresh data every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadNfaData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // View NFA function
  const handleViewNfa = (nfa) => {
    setViewNfa(nfa);
  };

  // Download NFA function
  const handleDownloadNfa = async (nfa) => {
    setDownloadLoading(nfa.id);
    try {
      console.log('Starting download for NFA:', nfa);
      
      if (nfa.filePath) {
        console.log('Attempting to download existing file:', nfa.filePath);
        // If we have a file path, try to download the existing file
        const response = await fetch(`http://localhost:5000${nfa.filePath}`);
        console.log('File response status:', response.status);
        
        if (response.ok) {
          const blob = await response.blob();
          console.log('Blob size:', blob.size);
          
          if (blob.size > 0) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${nfa.subject.replace(/[^a-zA-Z0-9]/g, '_')}_NFA.docx`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 100);
            
            console.log('Download initiated successfully');
            setDownloadSuccess(nfa.id);
            setTimeout(() => setDownloadSuccess(null), 3000);
            return;
          } else {
            console.log('File is empty, regenerating...');
            await regenerateAndDownloadNfa(nfa);
          }
        } else {
          console.log('File not found, regenerating...');
          // If file doesn't exist, regenerate it
          await regenerateAndDownloadNfa(nfa);
        }
      } else {
        console.log('No file path, regenerating...');
        // If no file path, regenerate the NFA
        await regenerateAndDownloadNfa(nfa);
      }
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: try to regenerate
      await regenerateAndDownloadNfa(nfa);
    } finally {
      setDownloadLoading(null);
    }
  };

  // Regenerate and download NFA
  const regenerateAndDownloadNfa = async (nfa) => {
    try {
      console.log('Regenerating NFA:', nfa);
      
      const response = await fetch('http://localhost:5000/api/generate-nfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: nfa.subject,
          summary: nfa.description,
          bulletsRequired: true,
          nfaType: nfa.type.toLowerCase(),
          proposalWordLimit: 100,
          backgroundWordLimit: 50,
          recommendationWordLimit: 50,
          tableData: [['slno', 'item', 'unit', 'total'], ['1', 'Sample Item', '1', '1000']] // Default table
        }),
      });

      console.log('Regeneration response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Regeneration result:', result);
        
        if (result.success && result.file) {
          console.log('Generated file path:', result.file);
          
          // Download the generated file
          const fileResponse = await fetch(`http://localhost:5000${result.file}`);
          console.log('File download response status:', fileResponse.status);
          
          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            console.log('Generated blob size:', blob.size);
            
            if (blob.size > 0) {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${nfa.subject.replace(/[^a-zA-Z0-9]/g, '_')}_NFA.docx`;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              
              // Clean up
              setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }, 100);
              
              console.log('Regenerated file download initiated successfully');
              setDownloadSuccess(nfa.id);
              setTimeout(() => setDownloadSuccess(null), 3000);
            } else {
              throw new Error('Generated file is empty');
            }
          } else {
            throw new Error('Failed to download generated file');
          }
        } else {
          throw new Error('Failed to generate NFA');
        }
      } else {
        throw new Error('Server error during regeneration');
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      alert(`Failed to download NFA: ${error.message}. Please try again.`);
    }
  };

  // Filter and search functionality
  const filteredData = useMemo(() => {
    return nfaData.filter(item => {
      const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, nfaData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'rejected':
        return '✗';
      case 'pending':
        return '⏳';
      default:
        return '?';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg p-2">
                <img 
                  src="/rv logo.jpeg" 
                  alt="RV University Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NFA History</h1>
                <p className="text-sm text-gray-600">Track your Note For Approval requests</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/nfa-landing')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search NFAs
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by subject, description, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {nfaData.length} NFAs
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((nfa) => (
                  <tr key={nfa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{nfa.subject}</div>
                        <div className="text-sm text-gray-500">{nfa.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {nfa.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(nfa.status)}`}>
                        <span className="mr-1">{getStatusIcon(nfa.status)}</span>
                        {nfa.status.charAt(0).toUpperCase() + nfa.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {nfa.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(nfa.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {nfa.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          onClick={() => handleViewNfa(nfa)}
                        >
                          View
                        </button>
                        <button 
                          className={`transition-colors disabled:opacity-50 ${
                            downloadSuccess === nfa.id 
                              ? 'text-green-700 font-semibold' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          onClick={() => handleDownloadNfa(nfa)}
                          disabled={downloadLoading === nfa.id}
                        >
                          {downloadLoading === nfa.id ? (
                            <div className="flex items-center space-x-1">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-green-600"></div>
                              <span>Downloading...</span>
                            </div>
                          ) : downloadSuccess === nfa.id ? (
                            <div className="flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>Downloaded!</span>
                            </div>
                          ) : (
                            'Download'
                          )}
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 transition-colors"
                          onClick={() => setDeleteConfirm(nfa.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No NFAs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 RV University. All rights reserved.
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete NFA</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this NFA? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteNfa(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View NFA Modal */}
      {viewNfa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">NFA Details</h3>
              <button
                onClick={() => setViewNfa(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{viewNfa.subject}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      viewNfa.type === 'Reimbursement' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {viewNfa.type}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(viewNfa.status)}`}>
                      <span className="mr-1">{getStatusIcon(viewNfa.status)}</span>
                      {viewNfa.status.charAt(0).toUpperCase() + viewNfa.status.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{viewNfa.amount}</p>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{formatDate(viewNfa.date)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{viewNfa.createdBy}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{viewNfa.description}</p>
                  </div>
                  
                  {viewNfa.filePath && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">File Path</label>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md break-all">{viewNfa.filePath}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* NFA Content Preview */}
              {viewNfa.nfaText && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">NFA Content Preview</label>
                  <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                      {viewNfa.nfaText}
                    </pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setViewNfa(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewNfa(null);
                  handleDownloadNfa(viewNfa);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading NFA history...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NfaHistoryPage;
