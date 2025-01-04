import SecurityService from 'src/contexts/SecurityService';
import { globalUrl } from '../constants/constants';

const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    console.error('No refresh token provided');
    throw new Error('No refresh token available');
  }

  try {
    console.log(
      'Refresh token being used:',
      refreshToken.substring(0, 10) + '...',
    );
    console.log('Full URL being called:', `${globalUrl}token/refresh/`);

    const response = await fetch(`${globalUrl}token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', {
      hasAccess: !!data.access,
      hasRefresh: !!data.refresh,
      error: data.detail || data.error,
    });

    if (!response.ok) {
      console.error('Token refresh failed:', {
        status: response.status,
        data: data,
      });
      throw new Error(data.detail || 'Token refresh failed');
    }

    if (!data.access) {
      console.error('Invalid response from refresh endpoint:', data);
      throw new Error('Invalid token response');
    }

    // Log successful refresh
    console.log('Token refresh successful. New access token received.');

    return {
      access: data.access,
      refresh: data.refresh || refreshToken, // Keep old refresh if new one not provided
    };
  } catch (error) {
    console.error('Token refresh error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export const fetchFromApi = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = true,
  } = options;

  try {
    let tokens = requiresAuth ? await SecurityService.getTokens() : null;

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
        ...headers,
      },
    };

    // Handle URL and query parameters
    let url = `${globalUrl}${endpoint}`;

    // For GET requests, append query parameters to URL
    if (method === 'GET' && body) {
      const queryParams = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    } else if (body && method !== 'GET') {
      // For non-GET requests, add body to fetchOptions
      fetchOptions.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to: ${url}`);
    // console.log('Request headers:', fetchOptions.headers);
    let response = await fetch(url, fetchOptions);

    console.log(response);
    // Handle 401 with token refresh
    if (response.status === 401 && tokens?.refresh) {
      console.log('Token refresh failed:', response.status);
      try {
        console.log('Attempting token refresh due to 401');
        const newTokens = await refreshTokens(tokens.refresh);
        await SecurityService.setTokens(newTokens);

        // Retry original request with new token
        fetchOptions.headers.Authorization = `Bearer ${newTokens.access}`;
        console.log('Retrying original request with new token');
        response = await fetch(url, fetchOptions);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await SecurityService.clearAll();
        throw new Error('Authentication failed');
      }
    }

    const responseData = await response.json();

     if (!response.ok) {
       // Enhanced error handling to capture API error messages
       const errorMessage =
         responseData.detail ||
         responseData.message ||
         responseData.error ||
         `Request failed with status ${response.status}`;
       throw new Error(errorMessage);
     }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default fetchFromApi;
