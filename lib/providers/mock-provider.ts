import {
  DecisionProvider,
  DecisionProviderRequest,
  DecisionProviderResponse,
} from './types';

/**
 * Isolated development-only adapter.
 * Disabled in production builds.
 */
export class MockDecisionProvider implements DecisionProvider {
  async evaluate(request: DecisionProviderRequest): Promise<DecisionProviderResponse> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MockDecisionProvider is forbidden in production environment.');
    }

    const { actions, goal, policy } = request;
    const decision = actions[0] || 'noop';

    return {
      decision,
      allowed: true,
      confidence: 0.9,
      verification: {
        condition: `Development-mock verification for action "${decision}" towards goal "${goal}".`,
      },
      fallback: actions[1] || 'abort',
      policy: {
        status: policy ? 'allowed' : 'unconstrained',
        reason: 'Development mock pass-through.',
      },
      attempt: 1,
      executionTimeMs: 15,
      provider: 'mock-dev-adapter',
    };
  }
}
