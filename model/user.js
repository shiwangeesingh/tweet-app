const {mongoose,conn} = require('./../dbConnection')

var userSchema = mongoose.Schema({

name:{
    type:String,
    require:true,
    default:""
},
tagName:{
    type:String,
    require:true,
    default:""
},
password:{
    type:String,
    require:true,
    default:""  
},
},{
    strict:true,
    versionKey: false,
    timestamps: true,
    colletion:'user'
})
exports.UserModel = conn.model('user',userSchema)