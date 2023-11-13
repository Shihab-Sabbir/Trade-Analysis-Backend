import { Schema, Types, model } from 'mongoose';
import { IProfile } from './profile.interface';

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    bloodGroups: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    hireDate: {
      type: Date,
    },
    employmentStatus: {
      type: String,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'Mentor',
    },
    salary: {
      type: Number,
    },
    benefits: [
      {
        type: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    emergencyContact: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
      },
      contactNumber: {
        type: String,
      },
    },
    documents: [
      {
        type: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    leaveBalances: {
      vacation: {
        type: Number,
      },
      sick: {
        type: Number,
      },
      personal: {
        type: Number,
      },
    },
    performanceReviews: [
      {
        date: {
          type: Date,
        },
        rating: {
          type: Number,
        },
        comments: {
          type: String,
        },
      },
    ],
    trainingHistory: [
      {
        courseName: {
          type: String,
        },
        dateCompleted: {
          type: Date,
        },
        duration: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Profile = model<IProfile>('Profile', ProfileSchema);
