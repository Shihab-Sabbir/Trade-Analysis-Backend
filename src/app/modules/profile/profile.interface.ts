import { Types } from 'mongoose';

export type IProfile = {
  id?: string;
  user: Types.ObjectId;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  bloodGroups?: string;
  jobTitle?: string;
  hireDate?: Date;
  employmentStatus?: string;
  mentor?: Types.ObjectId;
  salary?: number;
  benefits?: {
    type: string;
    description: string;
  }[];
  emergencyContact?: {
    name: string;
    relationship: string;
    contactNumber: string;
  };
  documents?: {
    type: string;
    url: string;
  }[];
  leaveBalances?: {
    vacation: number;
    sick: number;
    personal: number;
  };
  performanceReviews?: {
    date: Date;
    rating: number;
    comments: string;
  }[];
  trainingHistory?: {
    courseName: string;
    dateCompleted: Date;
    duration: string;
  }[];
};
