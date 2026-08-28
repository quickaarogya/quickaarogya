import { AarogyaStorage } from '@/lib/storage';
import { EmergencyProfile } from '@/types';

export class EmergencyService {
  static async getProfile(): Promise<EmergencyProfile> {
    return AarogyaStorage.getEmergencyProfile();
  }

  static async updateProfile(data: Partial<EmergencyProfile>): Promise<EmergencyProfile> {
    return AarogyaStorage.updateEmergencyProfile(data);
  }

  static async getPublicTriageByToken(token: string): Promise<Partial<EmergencyProfile> | null> {
    const p = AarogyaStorage.getEmergencyProfile();
    if (p.publicEmergencyToken === token) {
      return {
        fullName: p.fullName,
        bloodGroup: p.bloodGroup,
        allergies: p.allergies,
        chronicConditions: p.chronicConditions,
        currentMedicationsSummary: p.currentMedicationsSummary,
        emergencyContacts: p.emergencyContacts,
        organDonor: p.organDonor
      };
    }
    return null;
  }
}
