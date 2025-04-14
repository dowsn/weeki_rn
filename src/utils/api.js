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
  } = options;

  console.log('Starting fetchFromApi with requiresAuth:', requiresAuth);

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

      // Return true if token is expired
      return exp * 1000 < Date.now();
    } catch (e) {
      console.error('Token validation error:', e);
      return true; // Assume expired if we can't validate
    }
  };

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
          const newTokens = await refreshTokens(tokens.refresh);
          await SecurityService.setTokens(newTokens);
          tokens.access = newTokens.access;
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Failed to refresh token:', error);
          await SecurityService.clearAll();
          throw new Error('Authentication failed');
        }
      }
    } else {
      console.log('Authentication not required, tokens will remain null');
    }

    console.log('Tokensllll2');
    console.log(
      'Tokens before constructing fetchOptions:',
      tokens === null
        ? 'null'
        : tokens === undefined
          ? 'undefined'
          : 'object with access: ' + !!tokens?.access,
    );

    // Step by step construction of headers to identify exactly where it fails
    try {
      console.log('Building content-type header');
      const contentTypeHeader = { 'Content-Type': 'application/json' };

      console.log('Building auth header part');
      const authPart = tokens?.access
        ? { Authorization: `Bearer ${tokens.access}` }
        : {};
      console.log(
        'Auth part:',
        Object.keys(authPart).length > 0 ? 'Has auth header' : 'No auth header',
      );

      console.log('Building combined headers');
      const combinedHeaders = {
        ...contentTypeHeader,
        ...authPart,
        ...headers,
      };
      console.log('Headers built successfully');

      const fetchOptions = {
        method,
        headers: combinedHeaders,
      };

      console.log('Fetch options:', fetchOptions);

      // Continue with the rest of your function
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

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.detail ||
          responseData.message ||
          responseData.error ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return responseData;
    } catch (innerError) {
      console.error(
        'Error during fetchOptions construction or request:',
        innerError,
      );
      throw innerError;
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default fetchFromApi;
