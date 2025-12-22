export interface Recovery {
  recoveryId: string;
  claimId: string;
  treatyId: string;
  recoveryAmount: number;
  recoveryDate: string; // ISO date
  status: 'PENDING' | 'COMPLETED';
}
