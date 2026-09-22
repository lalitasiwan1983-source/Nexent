import { GoogleGenAI } from '@google/genai';
import {
  DecisionProvider,
  DecisionProviderRequest,
  DecisionProviderResponse,
} from './types';

let genAiClient: GoogleGenAI | null = null;

function getGenAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.JEV_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({ apiKey });
  }
  return genAiClient;
}

export class JevProvider implements DecisionProvider {
  async evaluate(request: DecisionProviderRequest): Promise<DecisionProviderResponse> {
    const startTime = Date.now();
    const { goal, state, actions, policy } = request;

    const ai = getGenAiClient();

    if (ai) {
      try {
        const prompt = `You are the core decision engine for Nexent, the control layer for AI agents.
Your role: Evaluate an agent's current situation against its goal, available actions, and policy constraints.
Choose the single safest, most effective next action strictly from the provided available actions.
Formulate a strict verification condition to confirm success after the agent executes this action.
Formulate a safe fallback action (from the remaining actions or a standard recovery action).

Context:
Goal: "${goal}"
Current State: "${state}"
Available Actions: ${JSON.stringify(actions)}
Policy Constraints: ${JSON.stringify(policy || {})}

Return a JSON object conforming strictly to this format:
{
  "decision": "<one action from available actions>",
  "allowed": <true or false based on policy>,
  "confidence": <float between 0.50 and 0.99>,
  "verification": {
    "condition": "<precise criteria to verify the action succeeded>"
  },
  "fallback": "<alternative action or recovery procedure if verification fails>",
  "policy": {
    "status": "<allowed | blocked | unconstrained>",
    "reason": "<explanation for policy evaluation>"
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText);

        const executionTimeMs = Date.now() - startTime;

        // Ensure returned decision is one of the available actions if possible
        const validDecision = actions.includes(parsed.decision)
          ? parsed.decision
          : actions[0] || 'stop';

        return {
          decision: validDecision,
          allowed: typeof parsed.allowed === 'boolean' ? parsed.allowed : true,
          confidence:
            typeof parsed.confidence === 'number'
              ? Math.max(0.1, Math.min(1.0, parsed.confidence))
              : 0.92,
          verification: {
            condition:
              parsed.verification?.condition ||
              `Verify execution of ${validDecision} transitions agent state toward: ${goal.slice(0, 40)}.`,
          },
          fallback:
            parsed.fallback ||
            (actions.find((a) => a !== validDecision) || 'escalate_to_human'),
          policy: {
            status: parsed.policy?.status || (policy ? 'allowed' : 'unconstrained'),
            reason: parsed.policy?.reason || 'Evaluated against policy constraints.',
          },
          attempt: 1,
          executionTimeMs,
          provider: 'jev-engine',
        };
      } catch (err) {
        console.warn('JevProvider AI call encountered an error, falling back to deterministic engine:', err);
      }
    }

    // Deterministic fallback evaluation engine if AI key is absent or unreachable
    const executionTimeMs = Date.now() - startTime;
    const selectedDecision = actions[0] || 'halt';
    const fallbackAction = actions.length > 1 ? actions[1] : 'halt';

    let isAllowed = true;
    let policyStatus: 'allowed' | 'blocked' | 'unconstrained' = 'unconstrained';
    let policyReason = 'No restrictive constraints defined.';

    if (policy) {
      policyStatus = 'allowed';
      if (policy.riskLevel === 'high' && selectedDecision.toLowerCase().includes('delete')) {
        isAllowed = false;
        policyStatus = 'blocked';
        policyReason = 'Destructive actions blocked under high risk constraint policy.';
      } else {
        policyReason = `Passed policy checks with risk profile: ${policy.riskLevel || 'standard'}.`;
      }
    }

    return {
      decision: selectedDecision,
      allowed: isAllowed,
      confidence: 0.94,
      verification: {
        condition: `System telemetry confirms "${selectedDecision}" returns status code 200/204 without exception.`,
      },
      fallback: fallbackAction,
      policy: {
        status: policyStatus,
        reason: policyReason,
      },
      attempt: 1,
      executionTimeMs,
      provider: 'jev-engine-core',
    };
  }
}
