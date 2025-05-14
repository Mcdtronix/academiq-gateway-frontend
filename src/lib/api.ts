
// Prison Management System API Service

const API_URL = 'https://api.prisonmanagement.com'; // Replace with your actual API URL

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        return { error: errorData.message || `HTTP error! Status: ${response.status}` };
      } catch (e) {
        return { error: `HTTP error! Status: ${response.status}` };
      }
    }

    // For endpoints that don't return JSON
    if (response.status === 204) {
      return { data: undefined as unknown as T };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Failed to connect to the server. Please try again later.' };
  }
}

// Auth API endpoints
export const authApi = {
  login: async (username: string, password: string) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    return { data: true };
  },
  
  getCurrentUser: async () => {
    return fetchApi('/auth/me');
  }
};

// Admin API endpoints
export const adminApi = {
  // Officer management
  getOfficers: async () => {
    return fetchApi('/admin/officers');
  },
  
  createOfficer: async (officerData: any) => {
    return fetchApi('/admin/officers', {
      method: 'POST',
      body: JSON.stringify(officerData)
    });
  },
  
  updateOfficer: async (id: string, officerData: any) => {
    return fetchApi(`/admin/officers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(officerData)
    });
  },
  
  deleteOfficer: async (id: string) => {
    return fetchApi(`/admin/officers/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Inmate management
  getAllInmates: async () => {
    return fetchApi('/admin/inmates');
  },
  
  approveInmate: async (id: string) => {
    return fetchApi(`/admin/inmates/${id}/approve`, {
      method: 'POST'
    });
  },
  
  dischargeInmate: async (id: string, reason: string) => {
    return fetchApi(`/admin/inmates/${id}/discharge`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  },
  
  transferInmate: async (id: string, destination: string) => {
    return fetchApi(`/admin/inmates/${id}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ destination })
    });
  },
  
  classifyInmate: async (id: string, classification: string) => {
    return fetchApi(`/admin/inmates/${id}/classify`, {
      method: 'POST',
      body: JSON.stringify({ classification })
    });
  }
};

// Reception API endpoints
export const receptionApi = {
  registerInmate: async (inmateData: any) => {
    return fetchApi('/reception/inmates', {
      method: 'POST',
      body: JSON.stringify(inmateData)
    });
  },
  
  getPendingInmates: async () => {
    return fetchApi('/reception/inmates/pending');
  },
  
  getInmate: async (id: string) => {
    return fetchApi(`/reception/inmates/${id}`);
  },
  
  registerValuables: async (id: string, valuablesData: any) => {
    return fetchApi(`/reception/inmates/${id}/valuables`, {
      method: 'POST',
      body: JSON.stringify(valuablesData)
    });
  },
  
  updateInmate: async (id: string, inmateData: any) => {
    return fetchApi(`/reception/inmates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(inmateData)
    });
  }
};

// Health API endpoints
export const healthApi = {
  getInmateHealthRecord: async (id: string) => {
    return fetchApi(`/health/inmates/${id}`);
  },
  
  createHealthRecord: async (id: string, healthData: any) => {
    return fetchApi(`/health/inmates/${id}`, {
      method: 'POST',
      body: JSON.stringify(healthData)
    });
  },
  
  updateHealthRecord: async (id: string, healthData: any) => {
    return fetchApi(`/health/inmates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(healthData)
    });
  },
  
  registerOPDVisit: async (id: string, visitData: any) => {
    return fetchApi(`/health/inmates/${id}/opd`, {
      method: 'POST',
      body: JSON.stringify(visitData)
    });
  },
  
  getOPDRecords: async (id: string) => {
    return fetchApi(`/health/inmates/${id}/opd`);
  },
  
  getHealthStatistics: async () => {
    return fetchApi('/health/statistics');
  }
};

// Shared inmate API endpoints
export const inmateApi = {
  searchInmates: async (query: string) => {
    return fetchApi(`/inmates/search?q=${encodeURIComponent(query)}`);
  },
  
  getInmateDetails: async (id: string) => {
    return fetchApi(`/inmates/${id}`);
  },
  
  getInmateOffenses: async (id: string) => {
    return fetchApi(`/inmates/${id}/offenses`);
  },
  
  getInmateTimeline: async (id: string) => {
    return fetchApi(`/inmates/${id}/timeline`);
  }
};
