import SecurityService from 'src/contexts/SecurityService';
import { globalUrl } from '../constants/constants';

const refreshTokens = async (refreshToken) => {
  try {
    console.log('Attempting to refresh token');
    const response = await fetch(`${globalUrl}token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', response.status);
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    console.log('Token refresh successful');

    return {
      access: data.access,
      refresh: data.refresh || refreshToken,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
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
    } else if (body) {
      // For non-GET requests, add body to fetchOptions
      fetchOptions.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to: ${url}`);

    let response = await fetch(url, fetchOptions);

    // Handle 401 with token refresh
    if (response.status === 401 && tokens?.refresh) {
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
      throw new Error(responseData.message || 'API request failed');
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default fetchFromApi;
