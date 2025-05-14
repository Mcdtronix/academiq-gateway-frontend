
// This file handles all API calls to the backend

const API_URL = 'https://api.academia-school.com'; // Replace with your actual API URL

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
      // Try to get error message from response
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

// Auth endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  register: async (userData: any) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
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

// Student endpoints
export const studentApi = {
  getCourses: async () => {
    return fetchApi('/students/courses');
  },
  
  getResults: async () => {
    return fetchApi('/students/results');
  },
  
  getLibraryBooks: async () => {
    return fetchApi('/library/books');
  },
  
  getFeeStatus: async () => {
    return fetchApi('/students/fees');
  },
  
  getProfile: async () => {
    return fetchApi('/students/profile');
  },
  
  updateProfile: async (profileData: any) => {
    return fetchApi('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

// Teacher endpoints
export const teacherApi = {
  getCourses: async () => {
    return fetchApi('/teachers/courses');
  },
  
  getStudents: async (courseId?: string) => {
    return fetchApi(courseId ? `/teachers/courses/${courseId}/students` : '/teachers/students');
  },
  
  recordAttendance: async (attendanceData: any) => {
    return fetchApi('/teachers/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData)
    });
  },
  
  submitResults: async (resultsData: any) => {
    return fetchApi('/teachers/results', {
      method: 'POST',
      body: JSON.stringify(resultsData)
    });
  }
};

// Admin endpoints
export const adminApi = {
  getAllStudents: async () => {
    return fetchApi('/admin/students');
  },
  
  addStudent: async (studentData: any) => {
    return fetchApi('/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },
  
  getAllTeachers: async () => {
    return fetchApi('/admin/teachers');
  },
  
  addTeacher: async (teacherData: any) => {
    return fetchApi('/admin/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData)
    });
  },
  
  getCourses: async () => {
    return fetchApi('/admin/courses');
  },
  
  addCourse: async (courseData: any) => {
    return fetchApi('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  },
  
  getLibraryBooks: async () => {
    return fetchApi('/admin/library/books');
  },
  
  addBook: async (bookData: any) => {
    return fetchApi('/admin/library/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  },
  
  getFeeRecords: async () => {
    return fetchApi('/admin/fees');
  },
  
  recordFeePayment: async (paymentData: any) => {
    return fetchApi('/admin/fees/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },
  
  getSystemSettings: async () => {
    return fetchApi('/admin/settings');
  },
  
  updateSystemSettings: async (settingsData: any) => {
    return fetchApi('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    });
  }
};

// Library endpoints
export const libraryApi = {
  getAllBooks: async () => {
    return fetchApi('/library/books');
  },
  
  searchBooks: async (query: string) => {
    return fetchApi(`/library/books/search?q=${encodeURIComponent(query)}`);
  },
  
  borrowBook: async (bookId: string) => {
    return fetchApi(`/library/books/${bookId}/borrow`, {
      method: 'POST'
    });
  },
  
  returnBook: async (bookId: string) => {
    return fetchApi(`/library/books/${bookId}/return`, {
      method: 'POST'
    });
  }
};
