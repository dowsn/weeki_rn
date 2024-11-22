import SecurityService from 'src/contexts/SecurityService';
import { globalUrl } from '../constants/constants';

const withTimeout = (promise, timeout) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const refreshTokens = async (refreshToken) => {
  try {
    const response = await fetch(`${globalUrl}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    return {
      access: data.access,
      refresh: refreshToken, // Keep the same refresh token
    };
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const fetchFromApi = async (apiFunction, options = {}) => {
  const {
    method = 'POST',
    body = null,
    headers = {},
    timeout = 20000,
    queryParams = {},
    user,
    setUser,
  } = options;

  try {
    const url = new URL(apiFunction, globalUrl);

    // Add query parameters for GET requests
    if (method === 'GET' && body) {
      Object.entries(body).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Add additional query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });

    const tokens = await SecurityService.getTokens();
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
        ...headers,
      },
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const fetchPromise = fetch(url.toString(), fetchOptions).then(
      async (response) => {
        if (response.status === 401 && tokens?.refresh) {
          try {
            const newTokens = await refreshTokens(tokens.refresh);
            await SecurityService.setTokens(newTokens);
            if (setUser && user) {
              setUser({ ...user, tokens: newTokens });
            }

            // Retry original request with new token
            return fetchFromApi(apiFunction, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${newTokens.access}`,
              },
            });
          } catch (refreshError) {
            await SecurityService.removeTokens();
            throw new Error('Authentication failed');
          }
        }

        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        if (!response.ok) {
          throw new Error(
            JSON.stringify({
              status: response.status,
              statusText: response.statusText,
              data: responseData,
            }),
          );
        }

        return responseData;
      },
    );

    return await withTimeout(fetchPromise, timeout);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default fetchFromApi;
