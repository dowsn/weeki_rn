import SecurityService from 'src/contexts/SecurityService';
import { globalUrl } from '../constants/constants';

// Add retry utility
const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    console.log(`Retrying... ${retries - 1} attempts left`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 1.5); // Exponential backoff
  }
};

// Extract the refreshTokens function from fetchFromApi to be used elsewhere
export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    console.error('No refresh token provided');
    throw new Error('No refresh token available');
  }

  const performRefresh = async () => {
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

      // Read response body once
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response format');
      }

      console.log('Response data:', {
        status: response.status,
        hasAccess: !!data.access,
        hasRefresh: !!data.refresh,
        error: data.detail || data.error || data.code,
      });

      // Handle specific error cases from Django REST Framework
      if (response.status === 401) {
        // DRF Simple JWT returns this format for invalid tokens
        if (
          data.detail &&
          (data.detail.includes('Token is invalid or expired') ||
            data.detail.includes('Token is blacklisted') ||
            data.code === 'token_not_valid')
        ) {
          console.error('Refresh token is invalid or expired');
          throw new Error('REFRESH_TOKEN_INVALID');
        }
      }

      if (!response.ok) {
        console.error('Token refresh failed:', {
          status: response.status,
          data: data,
        });

        // Extract error message from various possible formats
        const errorMessage =
          data.detail || data.error || 'Token refresh failed';

        throw new Error(errorMessage);
      }

      if (!data.access) {
        console.error('Invalid response from refresh endpoint:', data);
        throw new Error('Invalid token response - no access token');
      }

      // Log successful refresh
      console.log('Token refresh successful. New access token received.');

      return {
        access: data.access,
        refresh: data.refresh || refreshToken, // Keep old refresh if new one not provided
      };
    } catch (error) {
      // If it's a network error, add more context
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network error during token refresh');
        throw new Error('Network error - please check your connection');
      }

      console.error('Token refresh error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  };

  // Try to refresh with retry logic
  try {
    return await retry(performRefresh, 3, 1000);
  } catch (error) {
    // If error is specifically about invalid refresh token, don't retry
    if (error.message === 'REFRESH_TOKEN_INVALID') {
      throw error;
    }
    // For other errors (network, server errors), throw after retries
    throw error;
  }
};

// Check if the token is expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const { exp } = JSON.parse(jsonPayload);

    // Add 30 second buffer to refresh slightly before expiry
    return exp * 1000 < Date.now() + 30000;
  } catch (e) {
    console.error('Token validation error:', e);
    return true; // Assume expired if we can't validate
  }
};

// Track ongoing refresh to prevent multiple simultaneous refreshes
let refreshPromise = null;

export const fetchFromApi = async (
  endpoint,
  options = {},
  authenticationRequired = true,
) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = authenticationRequired,
    skipAutoLogout = false, // New option to prevent auto-logout for specific calls
  } = options;

  console.log('Starting fetchFromApi with requiresAuth:', requiresAuth);

  try {
    // Initialize tokens to null explicitly
    let tokens = null;
    console.log('Initial tokens value:', tokens);

    if (requiresAuth) {
      console.log('Authentication required, fetching tokens');
      tokens = await SecurityService.getTokens();
      console.log(
        'Got tokens from SecurityService, access token exists:',
        !!tokens?.access,
      );

      // Proactively refresh token if it's expired or will expire soon
      if (tokens?.refresh && isTokenExpired(tokens.access)) {
        try {
          console.log('Token expired, refreshing before request');

          // Prevent multiple simultaneous refresh attempts
          if (!refreshPromise) {
            refreshPromise = refreshTokens(tokens.refresh);
          }

          const newTokens = await refreshPromise;
          await SecurityService.setTokens(newTokens);
          tokens.access = newTokens.access;
          console.log('Token refreshed successfully');

          refreshPromise = null;
        } catch (error) {
          refreshPromise = null;
          console.error('Failed to refresh token:', error);

          // Only clear tokens if refresh token is invalid
          if (error.message === 'REFRESH_TOKEN_INVALID') {
            await SecurityService.clearAll();
            throw new Error('Authentication failed - please login again');
          }

          // For other errors, throw but don't clear tokens yet
          throw new Error('Token refresh failed - please try again');
        }
      }
    } else {
      console.log('Authentication not required, tokens will remain null');
    }

    // Build headers
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

    // Remove any user ID injection from the body
    let requestBody = body;
    if (body && typeof body === 'object') {
      const { userId, ...restBody } = body;
      requestBody = restBody;
    }

    // For GET requests, append query parameters to URL
    if (method === 'GET' && requestBody) {
      const queryParams = new URLSearchParams();
      Object.entries(requestBody).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    } else if (requestBody && method !== 'GET') {
      // For non-GET requests, add body to fetchOptions
      fetchOptions.body = JSON.stringify(requestBody);
    }

    console.log(`Making ${method} request to: ${url}`);
    let response = await fetch(url, fetchOptions);

    // Handle 401 responses by attempting token refresh
    if (response.status === 401 && requiresAuth && tokens?.refresh) {
      console.log('Got 401, attempting to refresh token and retry');

      try {
        // Try to refresh token
        if (!refreshPromise) {
          refreshPromise = refreshTokens(tokens.refresh);
        }

        const newTokens = await refreshPromise;
        await SecurityService.setTokens(newTokens);

        // Update headers with new token
        fetchOptions.headers.Authorization = `Bearer ${newTokens.access}`;

        // Retry the original request
        response = await fetch(url, fetchOptions);

        refreshPromise = null;
      } catch (refreshError) {
        refreshPromise = null;
        console.error('Token refresh on 401 failed:', refreshError);

        // Only logout if refresh token is definitively invalid
        if (refreshError.message === 'REFRESH_TOKEN_INVALID') {
          await SecurityService.clearAll();
        }
        throw refreshError;
      }
    }

    const responseData = await response.json();

    if (!response.ok) {
      // Only logout on 401/403 if skipAutoLogout is false
      if (
        (response.status === 401 || response.status === 403) &&
        !skipAutoLogout
      ) {
        console.log('Authentication error occurred, logging out');
        await SecurityService.clearAll();
      }

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
