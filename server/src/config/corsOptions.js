const allowedOrigin = [ "https://typique.onrender.com"];

const corsOptions = {
    origin : (origin, callback) => {
        if(allowedOrigin.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error(`Blocked by CORS Policy`))
        }
    },
    credentials : true,
    optionSuccessStatus : 200
}

module.exports = corsOptions;