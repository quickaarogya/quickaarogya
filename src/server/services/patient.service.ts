import { AarogyaStorage } from '@/lib/storage';
import { UserProfile, FamilyMember } from '@/types';

export class PatientService {
  static async getProfile(): Promise<UserProfile> {
    return AarogyaStorage.getUserProfile();
  }

  static async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return AarogyaStorage.updateUserProfile(data);
  }

  static async getFamilyMembers(): Promise<FamilyMember[]> {
    return AarogyaStorage.getFamilyMembers();
  }

  static async addFamilyMember(data: Omit<FamilyMember, 'id' | 'primaryUserProfileId'>): Promise<FamilyMember> {
    return AarogyaStorage.addFamilyMember(data);
  }

  static async deleteFamilyMember(id: string): Promise<void> {
    AarogyaStorage.deleteFamilyMember(id);
  }
}
