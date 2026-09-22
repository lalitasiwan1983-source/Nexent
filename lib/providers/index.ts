import { DecisionProvider } from './types';
import { JevProvider } from './jev-provider';

export * from './types';
export * from './jev-provider';
export * from './mock-provider';

let providerInstance: DecisionProvider | null = null;

export function getDecisionProvider(): DecisionProvider {
  if (!providerInstance) {
    providerInstance = new JevProvider();
  }
  return providerInstance;
}
