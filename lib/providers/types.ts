export interface DecisionPolicyInput {
  maxRetries?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  allowEscalation?: boolean;
}

export interface DecisionProviderRequest {
  goal: string;
  state: string;
  actions: string[];
  policy?: DecisionPolicyInput;
  projectId?: string;
  userId?: string;
}

export interface DecisionProviderResponse {
  decision: string;
  allowed: boolean;
  confidence: number; // 0.00 to 1.00
  verification: {
    condition: string;
  };
  fallback: string;
  policy: {
    status: 'allowed' | 'blocked' | 'unconstrained';
    reason?: string;
  };
  attempt: number;
  executionTimeMs?: number;
  provider?: string;
}

export interface DecisionProvider {
  evaluate(request: DecisionProviderRequest): Promise<DecisionProviderResponse>;
}
