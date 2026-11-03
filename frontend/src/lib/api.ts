// API Client with CSRF and Session Support

function getCookie(name: string): string | null {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export async function fetchWithCsrf<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  // Set JSON content-type if not multipart
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Include CSRF token for mutating requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    let csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      // Fetch fresh CSRF cookie from backend
      try {
        const csrfRes = await fetch('/api/auth/csrf/', { credentials: 'include' });
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.csrfToken || getCookie('csrftoken');
      } catch (e) {
        console.warn('Could not pre-fetch CSRF token', e);
      }
    }
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // essential for Django session cookies
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText || 'Request failed' };
    }
    const error: any = new Error(errorData.detail || 'An error occurred during request');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // For 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
