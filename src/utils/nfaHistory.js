// NFA History Management Utility

export const addNfaToHistory = (nfaData) => {
  try {
    const savedNfas = localStorage.getItem('nfaHistory');
    let nfaHistory = [];
    
    if (savedNfas) {
      nfaHistory = JSON.parse(savedNfas);
    }
    
    const newNfa = {
      ...nfaData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
      status: 'pending' // Default status
    };
    
    // Add to beginning of array (most recent first)
    const updatedHistory = [newNfa, ...nfaHistory];
    
    // Save to localStorage
    localStorage.setItem('nfaHistory', JSON.stringify(updatedHistory));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'nfaHistory',
      newValue: JSON.stringify(updatedHistory)
    }));
    
    return newNfa;
  } catch (error) {
    console.error('Error adding NFA to history:', error);
    return null;
  }
};

export const getNfaHistory = () => {
  try {
    const savedNfas = localStorage.getItem('nfaHistory');
    return savedNfas ? JSON.parse(savedNfas) : [];
  } catch (error) {
    console.error('Error getting NFA history:', error);
    return [];
  }
};

export const updateNfaStatus = (id, newStatus) => {
  try {
    const savedNfas = localStorage.getItem('nfaHistory');
    if (!savedNfas) return false;
    
    const nfaHistory = JSON.parse(savedNfas);
    const updatedHistory = nfaHistory.map(nfa => 
      nfa.id === id ? { ...nfa, status: newStatus } : nfa
    );
    
    localStorage.setItem('nfaHistory', JSON.stringify(updatedHistory));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'nfaHistory',
      newValue: JSON.stringify(updatedHistory)
    }));
    
    return true;
  } catch (error) {
    console.error('Error updating NFA status:', error);
    return false;
  }
};

export const deleteNfaFromHistory = (id) => {
  try {
    const savedNfas = localStorage.getItem('nfaHistory');
    if (!savedNfas) return false;
    
    const nfaHistory = JSON.parse(savedNfas);
    const updatedHistory = nfaHistory.filter(nfa => nfa.id !== id);
    
    localStorage.setItem('nfaHistory', JSON.stringify(updatedHistory));
    
    // Trigger storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'nfaHistory',
      newValue: JSON.stringify(updatedHistory)
    }));
    
    return true;
  } catch (error) {
    console.error('Error deleting NFA from history:', error);
    return false;
  }
};
