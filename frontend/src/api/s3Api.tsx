import api from './axios';

export const listFiles = async (bucket: string): Promise<string[]> => {
  try {
    const response = await api.get<string[]>(`/s3/${bucket}/files`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch files from bucket');
  }
};