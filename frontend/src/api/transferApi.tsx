import api from './axios';

interface TransferRequest {
  sourceBucket: string;
  destinationBucket: string;
  fileKey: string;
}

interface TransferResponse {
  transferId: string;
  status: string;
}

export const startTransfer = async (data: TransferRequest): Promise<TransferResponse> => {
  try {
    const response = await api.post<TransferResponse>('/transfer', data);
    return response.data;
  } catch (error) {
    throw new Error('Transfer failed to start');
  }
};