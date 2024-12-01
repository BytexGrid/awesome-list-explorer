import axios from 'axios';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://awesome.ecosyste.ms/api/v1';

export interface AwesomeList {
  name: string;
  full_name: string;
  description: string;
  stars: number;
  language: string;
  topics: string[];
  homepage: string;
  repository_url: string;
}

export const fetchAwesomeLists = async (page = 1, perPage = 50): Promise<AwesomeList[]> => {
  try {
    const response = await axios.get(`${CORS_PROXY}${BASE_URL}/lists`, {
      params: { 
        page, 
        per_page: perPage 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching awesome lists:', error);
    return [];
  }
};

export const searchAwesomeLists = async (query: string, page = 1, perPage = 50): Promise<AwesomeList[]> => {
  try {
    const response = await axios.get(`${CORS_PROXY}${BASE_URL}/lists/search`, {
      params: { 
        q: query,
        page,
        per_page: perPage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching awesome lists:', error);
    return [];
  }
};

export const getListDetails = async (fullName: string): Promise<AwesomeList | null> => {
  try {
    const response = await axios.get(`${CORS_PROXY}${BASE_URL}/lists/${fullName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for list ${fullName}:`, error);
    return null;
  }
};
