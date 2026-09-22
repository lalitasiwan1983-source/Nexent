export interface DecisionPolicy {
  maxRetries: number;
  riskLevel: 'low' | 'medium' | 'high';
  allowEscalation: boolean;
}

export interface DecisionRequest {
  goal: string;
  state: string;
  actions: string[];
  policy: DecisionPolicy;
}

export interface DecisionContract {
  decision: string;
  allowed: boolean;
  confidence: number; // 0.00 - 1.00
  verification: {
    condition: string;
  };
  fallback: string;
  attempt: number;
  maxAttempts?: number;
}

export interface DecisionEvaluationProgress {
  stage: 1 | 2 | 3 | 4;
  title: string;
  description: string;
}

export const EXAMPLE_DECISION_REQUEST: DecisionRequest = {
  goal: 'Complete payment',
  state: 'Payment request timed out after 8 seconds.\nCustomer has not been charged.',
  actions: ['retry', 'use_backup', 'ask_user', 'stop'],
  policy: {
    maxRetries: 2,
    riskLevel: 'medium',
    allowEscalation: true,
  },
};

/**
 * Service abstraction for evaluating an agent decision.
 * Ready to connect to POST /v1/decisions.
 * Uses an isolated, deterministic decision logic runner in development.
 */
export async function evaluateDecision(
  request: DecisionRequest,
  simulateError = false
): Promise<DecisionContract> {
  // Simulate network/engine evaluation latency
  await new Promise((resolve) => setTimeout(resolve, 650));

  if (simulateError) {
    throw new Error('Nexent evaluation engine error: upstream policy check failed');
  }

  const { goal, state, actions, policy } = request;
  const lowerGoal = goal.toLowerCase();
  const lowerState = state.toLowerCase();

  // Determine optimal decision based on state, actions, and policy
  let decision = actions[0] || 'stop';
  let fallback = actions.length > 1 ? actions[actions.length - 1] : 'ask_user';
  let verificationCondition = 'Action completes with 200 OK and valid status state.';
  let confidence = 0.94;
  let allowed = true;
  const attempt = Math.min(policy.maxRetries, 2);

  if (actions.includes('retry') && (lowerState.includes('timeout') || lowerState.includes('timed out') || lowerState.includes('network'))) {
    decision = 'retry';
    fallback = actions.includes('ask_user') ? 'ask_user' : actions.includes('use_backup') ? 'use_backup' : 'stop';
    verificationCondition = lowerGoal.includes('payment')
      ? 'Payment request succeeds and returns a successful transaction state.'
      : 'Target service returns a successful HTTP 200/201 response.';
    confidence = policy.riskLevel === 'high' ? 0.81 : 0.94;
    allowed = policy.maxRetries > 0;
  } else if (lowerState.includes('unauthorized') || lowerState.includes('forbidden') || lowerState.includes('invalid credentials')) {
    decision = actions.includes('ask_user') ? 'ask_user' : actions.includes('stop') ? 'stop' : actions[0];
    fallback = 'stop';
    verificationCondition = 'User provides updated verification credentials.';
    confidence = 0.98;
    allowed = true;
  } else if (lowerState.includes('not charged') || lowerState.includes('idempotent')) {
    decision = actions.includes('retry') ? 'retry' : actions[0];
    fallback = actions.includes('use_backup') ? 'use_backup' : 'ask_user';
    verificationCondition = 'Transaction state transitions to confirmed without duplicate charge.';
    confidence = 0.92;
    allowed = true;
  } else if (actions.includes('use_backup') && policy.riskLevel === 'high') {
    decision = 'use_backup';
    fallback = actions.includes('stop') ? 'stop' : 'ask_user';
    verificationCondition = 'Secondary failover node confirms telemetry heartbeat and health check.';
    confidence = 0.89;
    allowed = true;
  } else {
    // Default sensible selection
    decision = actions[0];
    fallback = actions[1] || 'ask_user';
    verificationCondition = `Execution of "${decision}" satisfies post-condition for goal "${goal.slice(0, 40)}".`;
    confidence = 0.91;
    allowed = true;
  }

  return {
    decision,
    allowed,
    confidence,
    verification: {
      condition: verificationCondition,
    },
    fallback,
    attempt,
    maxAttempts: policy.maxRetries,
  };
}
