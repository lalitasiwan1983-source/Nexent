export interface DecisionPolicy {
  maxRetries?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  allowEscalation?: boolean;
}

export interface DecisionRequest {
  goal: string;
  state: string;
  actions: string[];
  policy?: DecisionPolicy;
  projectId?: string;
}

export interface DecisionContract {
  decisionId?: string;
  decision: string;
  allowed: boolean;
  confidence: number; // 0.00 - 1.00
  verification: {
    condition: string;
  };
  fallback: string;
  policy: {
    status: 'allowed' | 'blocked' | 'unconstrained';
    reason?: string;
  };
  attempt: number;
  createdAt?: string;
  executionTimeMs?: number;
  provider?: string;
}

/**
 * Executes a real decision request to the Nexent backend endpoint POST /api/decisions.
 * Never simulates or generates fake decision data.
 */
export async function evaluateDecision(
  request: DecisionRequest
): Promise<DecisionContract> {
  const response = await fetch('/api/decisions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Nexent couldn't evaluate this request.";
    throw new Error(message);
  }

  const data: DecisionContract = await response.json();
  return data;
}
