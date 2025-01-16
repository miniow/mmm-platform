// src/types.ts
export interface DataPipeline {
  id: string;
  name: string;
  lastExecutedAt: string;
  createdDateTime:string;
  status: number;
  userId: string;
  dataFlowId: any[];
}
export interface ModelResult {
  model_id: string;
  workspace_id: string;
  model_type: ModelType;
  target_column?: string;
  coefficients: { [key: string]: number };
  intercept: number;
  score: number;
  mse: number;
  adstock_params?: { [key: string]: [number, number] };
}
export interface AddDataFlowDto {
  id: string;
  dataFlowJson: string;
}
export interface FlowData {
  nodes: any[];
  edges: any[];
}
export interface PredictionResponse {
  predictions: number[];
  actual: number[];
  target: string;
  mean_squared_error: number;
}
export type ModelType = "regular" | "adstock";

export interface TrainingData {
  workspace_id: string;
  X: number[][];
  y: number[];
  model_type: ModelType;
  adstock_params?: {
    feature: string;
    alpha: number;
    beta: number;
  }[];
}

export interface Workspace {
    id: string;
    name: string;
    userId: string;
    date: string;
    isFavorite: boolean;
    createdAt: string;
    pipelineId: string; 
}
export interface UserProfile {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
}