const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ParkingSession {
  id: string;
  vehicleNumber: string;
  slotNumber: number;
  entryTime: string;
  exitTime?: string;
  duration?: {
    hours: number;
    minutes: number;
  };
  charge?: number;
  status: 'active' | 'completed';
  vehicleType?: 'car' | 'bike';
  vehicleCategory?: '4-wheeler' | '2-wheeler';
  classificationConfidence?: number;
}

export interface FreeSlotResponse {
  slotNumber: number;
  totalSlots: number;
  availableSlots: number;
}

export interface RecordsResponse {
  data: ParkingSession[];
  meta: {
    total: number;
    returned: number;
    skip: number;
    limit: number;
  };
}

export interface SystemRestartResponse {
  component: string;
  status: string;
}

export interface PredictionResponse {
  predicted_free_in_minutes: number;
  confidence: number;
  slot_id: number;
  current_status: 'occupied' | 'free';
}

export interface SlotPrediction {
  slot_id: number;
  availability_probability: number;
  predicted_status: 'free' | 'occupied';
  current_status: 'free' | 'occupied';
}

export interface OverallPredictionData {
  predicted_available: number;
  predicted_occupied: number;
  occupancy_percentage: number;
  total_slots: number;
  slots: SlotPrediction[];
}

export interface OverallPredictionResponse {
  success: boolean;
  prediction: OverallPredictionData;
  timestamp: string;
}

export interface AIInsightRequest {
  query: string;
}

export interface AIInsightResponse {
  success?: boolean;
  response?: string;
  insight?: string;
  timestamp?: string;
  error?: string;
  message?: string;
}

export interface ChatbotRequest {
  query: string;
  top_k?: number;
}

export interface ChatbotResponse {
  query: string;
  response: string;
  error?: string;
}

export interface VehicleClassificationResponse {
  success: boolean;
  vehicleType: 'car' | 'bike';
  vehicleCategory: '4-wheeler' | '2-wheeler';
  classificationConfidence: number;
  timestamp?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code?: string,
    message?: string
  ) {
    super(message || 'API request failed');
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Invalid response format');
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseData.error || responseData.code,
      responseData.message || 'Request failed'
    );
  }

  return responseData.data || responseData;
}

async function handlePaginatedResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Invalid response format');
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      responseData.error || responseData.code,
      responseData.message || 'Request failed'
    );
  }

  if (responseData.success !== undefined && responseData.data !== undefined) {
    return {
      data: responseData.data,
      meta: responseData.meta || { total: 0, returned: 0, skip: 0, limit: 0 }
    } as T;
  }
  
  return responseData as T;
}

// API Functions

/**
 * GET /api/check-session
 * Check for active parking session
 */
export async function checkSession(): Promise<ParkingSession | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/check-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null; // No active session
    }

    const data = await handleResponse<ParkingSession>(response);
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * GET /api/free-slot
 * Get next available parking slot
 */
export async function getFreeSlot(): Promise<FreeSlotResponse> {
  const response = await fetch(`${API_BASE_URL}/free-slot`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<FreeSlotResponse>(response);
}

/**
 * POST /api/entry
 * Register vehicle entry using base64 image with optional car details
 * Note: vehicleType is automatically detected by the backend, no need to send it
 */
export async function registerEntry(
  imageBase64: string,
  carDetails?: {
    vehicleType?: 'sedan' | 'suv' | 'bike' | 'truck' | 'van' | 'other';
    ownerName?: string;
    ownerPhone?: string;
    vehicleColor?: string;
    vehicleModel?: string;
  }
): Promise<ParkingSession> {
  const requestBody: any = {
    image: imageBase64,
  };

  // Add optional car details if provided
  // Note: vehicleType is NOT sent - backend auto-detects car vs bike
  if (carDetails) {
    if (carDetails.ownerName) requestBody.ownerName = carDetails.ownerName;
    if (carDetails.ownerPhone) requestBody.ownerPhone = carDetails.ownerPhone;
    if (carDetails.vehicleColor) requestBody.vehicleColor = carDetails.vehicleColor;
    if (carDetails.vehicleModel) requestBody.vehicleModel = carDetails.vehicleModel;
  }

  const response = await fetch(`${API_BASE_URL}/entry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return handleResponse<ParkingSession>(response);
}

/**
 * POST /api/exit
 * Complete parking session by tokenId or vehicleNumber with optional payment info
 */
export async function registerExit(
  params: { 
    tokenId?: string; 
    vehicleNumber?: string;
    paymentMethod?: 'cash' | 'card' | 'upi' | 'wallet';
    paymentStatus?: 'pending' | 'completed';
    image?: string;
  }
): Promise<ParkingSession> {
  if (!params.tokenId && !params.vehicleNumber) {
    throw new ApiError(400, 'INVALID_REQUEST', 'Either tokenId or vehicleNumber is required');
  }

  const requestBody: any = {};
  
  if (params.tokenId) requestBody.tokenId = params.tokenId;
  if (params.vehicleNumber) requestBody.vehicleNumber = params.vehicleNumber;
  if (params.paymentMethod) requestBody.paymentMethod = params.paymentMethod;
  if (params.paymentStatus) requestBody.paymentStatus = params.paymentStatus;
  if (params.image) requestBody.image = params.image;

  const response = await fetch(`${API_BASE_URL}/exit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  return handleResponse<ParkingSession>(response);
}

/**
 * GET /api/records
 * Get parking records with optional filters
 */
export async function getRecords(params?: {
  status?: 'active' | 'completed';
  vehicleNumber?: string;
  limit?: number;
  skip?: number;
}): Promise<RecordsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.vehicleNumber) queryParams.append('vehicleNumber', params.vehicleNumber);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.skip) queryParams.append('skip', params.skip.toString());

  const url = `${API_BASE_URL}/records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handlePaginatedResponse<RecordsResponse>(response);
}

/**
 * GET /api/record
 * Get single parking record by tokenId or vehicleNumber with all details
 */
export async function getSingleRecord(params: {
  tokenId?: string;
  vehicleNumber?: string;
}): Promise<ParkingSession> {
  if (!params.tokenId && !params.vehicleNumber) {
    throw new ApiError(400, 'INVALID_REQUEST', 'Either tokenId or vehicleNumber is required');
  }

  const queryParams = new URLSearchParams();
  if (params.tokenId) queryParams.append('tokenId', params.tokenId);
  if (params.vehicleNumber) queryParams.append('vehicleNumber', params.vehicleNumber);

  const url = `${API_BASE_URL}/record?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<ParkingSession>(response);
}

/**
 * POST /api/system/restart
 * Initiate system restart
 */
export async function restartSystem(component: string = 'all'): Promise<SystemRestartResponse> {
  const response = await fetch(`${API_BASE_URL}/system/restart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ component }),
  });

  return handleResponse<SystemRestartResponse>(response);
}

/**
 * GET /api/predict-availability
 * Predict when a parking slot will become available
 * @param slotId - The slot number to predict availability for
 */
export async function getPredictAvailability(slotId: number): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict-availability?slot_id=${slotId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<PredictionResponse>(response);
}

/**
 * GET /api/predict-availability
 * Get overall parking lot prediction (without slot_id parameter)
 * Returns occupancy percentage and predictions for all slots
 */
export async function getOverallPrediction(): Promise<OverallPredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict-availability`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || data.code,
      data.message || 'Failed to get overall prediction'
    );
  }

  return data as OverallPredictionResponse;
}

/**
 * POST /api/parking-insight
 * Get AI-powered insights about parking patterns and predictions
 * @param query - Natural language query from the user
 */
export async function getParkingInsight(query: string): Promise<AIInsightResponse> {
  const response = await fetch(`${API_BASE_URL}/parking-insight`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || data.code,
      data.message || 'Failed to get parking insight'
    );
  }

  // Check if response is wrapped in a 'data' field
  const actualData = data.data || data;

  // Normalize the response - backend may send 'insight' or 'response' field
  // Also keep the original structure in case component needs it
  const normalizedData: AIInsightResponse = {
    success: data.success !== false,
    response: actualData.response || actualData.insight || actualData.message || data.response || data.insight || data.message || 'No response available',
    timestamp: actualData.timestamp || data.timestamp || new Date().toISOString(),
    insight: actualData.insight || data.insight,
    error: actualData.error || data.error,
    message: actualData.message || data.message,
    // Keep original data structure for component to access if needed
    ...(data.data && { data: data.data })
  };

  console.log('[API] Normalized response:', normalizedData);

  return normalizedData;
}

/**
 * POST /api/chatbot
 * Get RAG-powered responses from the chatbot
 * @param query - User's question
 */
export async function getChatbotResponse(query: string): Promise<ChatbotResponse> {
  const response = await fetch(`${API_BASE_URL}/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new ApiError(
      response.status,
      data.error || 'CHATBOT_ERROR',
      data.error || 'Failed to get chatbot response'
    );
  }

  return data;
}

/**
 * POST /api/classify-vehicle
 * Classify vehicle type before entry (optional standalone classification)
 * @param imageBase64 - Base64 encoded image of the vehicle
 */
export async function classifyVehicle(imageBase64: string): Promise<VehicleClassificationResponse> {
  const response = await fetch(`${API_BASE_URL}/classify-vehicle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageBase64 }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || data.code,
      data.message || 'Failed to classify vehicle'
    );
  }

  return data;
}

/**
 * POST /api/enhance-prompt
 * Enhance user prompt using Gemini AI
 * @param prompt - The user's original prompt
 */
export async function enhancePrompt(prompt: string): Promise<{ enhancedPrompt: string }> {
  const response = await fetch(`${API_BASE_URL}/enhance-prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error || 'ENHANCE_ERROR',
      data.message || 'Failed to enhance prompt'
    );
  }

  return data;
}
