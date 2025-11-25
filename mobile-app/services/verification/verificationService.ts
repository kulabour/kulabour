import { apiClient } from '../api/client';

interface VerificationDocuments {
    aadharFront: string;
    aadharBack: string;
    laborCard: string;
    bankDetails: string;
    selfie: string;
}

export const submitVerification = async (
    workerId: string,
    workerName: string,
    documents: VerificationDocuments
) => {
    const response = await apiClient.post('/api/verification/documents', {
        workerId,
        workerName,
        documents,
    });

    return response;
};

export const getVerificationStatus = async (workerId: string) => {
    const response = await apiClient.get(`/api/verification/status/${workerId}`);
    return response;
};
