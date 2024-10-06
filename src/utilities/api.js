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
  } = options;

  try {
    const url = new URL(apiFunction, globalUrl);
    console.log('Full URL:', url.toString());

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    console.log('Request options:', {
      ...fetchOptions,
      body: body, // Log the original body object
    });

    const fetchPromise = fetch(url.toString(), fetchOptions).then(
      async (response) => {
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

export default fetchFromApi;
