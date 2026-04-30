import mongoose,{Types} from "mongoose";


const userDetailsSchema = new mongoose.Schema({
    occupation : String,
    income : Number,
    educationQualification : String,
    disabilty : {type : Boolean , required : true , default : false},
    disablityPercentage : {type : Number , required : function() { !!this.disabilty} }
})
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin : {
        type : Boolean,
        required : true,
        default : false,
    },
    district : String,
eligibilityFields : {
        category : String,
        region : String,
        gender : String,
        occupation : String,
        income : String,
        disability : String,
        religion : String,
    },
    dob : Date,
    userDetails : { type : userDetailsSchema},
    bookMarkedSchemes : [mongoose.Schema.ObjectId],
    lastLoggedIn : Date,
}, {timestamps : true});

export type UsersType = mongoose.InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export const Users = mongoose.model('users', userSchema);