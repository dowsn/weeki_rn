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

export const fetchFromApi = async (apiFunction, options = {}) => {
  const {
    method = 'POST',
    body = null,
    headers = {},
    timeout = 20000,
    queryParams = {},
    user,
  } = options;

  try {
    const url = new URL(apiFunction, globalUrl);

    // For GET requests, convert body to query parameters
    if (method === 'GET' && body) {
      Object.entries(body).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            url.searchParams.append(key, item);
          });
        } else if (value !== null && value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Add any additional query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          url.searchParams.append(key, item);
        });
      } else if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });

    console.log('Full URL:', url.toString());

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(user?.tokens?.access
          ? { Authorization: `Bearer ${user.tokens.access}` }
          : {}),
        ...headers,
      },
    };

    // Only add body for non-GET requests
    if (body && method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(body);
    }

    console.log('Request options:', {
      ...fetchOptions,
      body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
      queryParams: url.search,
    });

    const fetchPromise = fetch(url.toString(), fetchOptions).then(
      async (response) => {


         if (response.status === 401 && user?.tokens?.refresh) {
           // Handle token refresh
           const newTokens = await refreshTokens(user.tokens.refresh);
           if (newTokens) {
             // Update user context with new tokens
             options.setUser(user, newTokens);

             // Retry original request with new token
             return fetchFromApi(apiFunction, {
               ...options,
               headers: {
                 ...headers,
                 Authorization: `Bearer ${newTokens.access}`,
               },
             });
           }
         }

        console.log('Response status:', response.status);
        console.log(
          'Response headers:',
          Object.fromEntries(response.headers.entries()),
        );




        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        console.log('Response data:', responseData);

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

    const data = await withTimeout(fetchPromise, timeout);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error.message.startsWith('{')) {
      const errorData = JSON.parse(error.message);
      console.error('Detailed error:', errorData);
    }
    throw error;
  }
};

const refreshTokens = async (refreshToken) => {
  try {
    const response = await fetchFromApi('refresh-token', {
      method: 'POST',
      body: { refresh: refreshToken },
      requiresAuth: false,
    });

    if (response.access) {
      return {
        access: response.access,
        refresh: refreshToken,
      };
    }
    throw new Error('Invalid refresh token response');
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export default fetchFromApi;
