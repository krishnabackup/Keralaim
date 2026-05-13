import mongoose, { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  district?: string;
  askedFields? : string[], 
  eligibilityFields?: {
    category?: string;
    region?: string;
    gender?: string;
    occupation?: string;
    income?: string;
    disability?: string;
    religion?: string;
  };
  dob?: Date;
  bookMarkedSchemes?: Types.ObjectId[];
  lastLoggedIn?: Date;
  age: number | null;    
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  district: String,
  eligibilityFields: {
    type : Object,
    default : {}
  },
  askedFields : {
    type : [String],
    default : []
  },
  eligibilityCached : {
    schemId : {type :mongoose.Schema.Types.ObjectId , ref : "schemes"},
    score : Number,
    computedAt : Date
  },
  dob: Date,
  bookMarkedSchemes: [mongoose.Schema.ObjectId],
  lastLoggedIn: Date,
}, { timestamps: true });

userSchema.virtual('age').get(function () {
  if (!this.dob) return null;
  const birth = new Date(this.dob);
  let age = new Date().getFullYear() - birth.getFullYear();
  const m = new Date().getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && new Date().getDate() < birth.getDate())) age--;
  return age;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const Users = mongoose.model<IUser>('users', userSchema);