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
    // Note: The backend expects 'documents' as FormData with files, but here we are sending JSON.
    // The current implementation in backend/routes/verification.js handles body params via Multer or JSON?
    // Backend uses 'upload.array', which expects multipart/form-data.
    // BUT the Mock implementation in backend (which we saw earlier) read from req.body directly!
    // Since we didn't implement real Multer logic in the backend (we stuck with the mock array for simplicity/stability),
    // sending JSON is actually CORRECT for the *current* backend state.
    // However, for a "real" app, this should be FormData.

    // Given the previous backend state (memory store), it read req.body.
    // So this client code matches the backend implementation.

    const response = await apiClient.post('/verification/documents', {
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
