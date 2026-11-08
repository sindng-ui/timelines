/**
 * @file index.ts
 * @description Global registry of all DomainPacks conforming to the Oracle Contract.
 */

import type { DomainPack } from '../contracts/timeline.contract';
import { eastAsiaHistoryPack } from './east-asia-history';
import { physicsHistoryPack } from './physics-history';

export const DOMAIN_PACKS: DomainPack[] = [eastAsiaHistoryPack, physicsHistoryPack];

export function getDomainPackById(packId: string): DomainPack {
  return DOMAIN_PACKS.find((p) => p.id === packId) ?? eastAsiaHistoryPack;
}
