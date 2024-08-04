import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"],
    },
    ProfilePic:{
        type:String,
        required:true,
        default:"",
    },
},{timestamps: true}//createdAt, updatedAt
);


const User = mongoose.model("User",userschema);
export default User;