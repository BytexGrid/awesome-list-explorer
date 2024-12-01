import axios from 'axios';

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

export const fetchAwesomeLists = async (): Promise<AwesomeList[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching awesome lists:', error);
    return [];
  }
};

export const searchAwesomeLists = async (query: string): Promise<AwesomeList[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/lists/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching awesome lists:', error);
    return [];
  }
};
