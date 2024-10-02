import { globalUrl } from '../../config/constants';

export const fetchData = async <T>(
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const url = `${globalUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// const fetchFromApi = async (apiFunction, params = {}) => {
//   try {
//     let url = new URL(`${globalUrl}${apiFunction}`);
//     Object.keys(params).forEach((key) =>
//       url.searchParams.append(key, params[key]),
//     );
//     console.log(url);
//     const response = await fetch(url);
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.error(error);
//   }
// };

export default fetchData;