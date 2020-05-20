const {mongoose,conn} = require('./../dbConnection')

var postSchema = mongoose.Schema({
userId : {     
    type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default : null
    },    
post:{
    type:String,
    require:true,
    default:""
},
tagedUser:[
    {type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            default : null
    }
],
},{
    strict:true,
    versionKey: false,
    timestamps: true,
    colletion:'post'
})
exports.PostModel = conn.model('post',postSchema)