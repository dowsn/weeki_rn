import { globalUrl } from '../../config/constants';

const fetchFromApi = async (apiFunction, params = {}) => {
  try {
    let url = new URL(`${globalUrl}${apiFunction}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key]),
    );
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
  }
};

export default fetchFromApi;