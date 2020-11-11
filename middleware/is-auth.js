const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{

    const authHeader = req.get('Authorization');
    console.log(authHeader);
    if(!authHeader) {
        
        const error =new Error('NOT AUTHENTICATED');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    const userid = authHeader.split(' ')[2];
    console.log(typeof(token));
    if(token === 'null') {
        
        
        const error =new Error('NOT AUTHENTICATED');
        error.statusCode = 401;
        throw error;
    }
    let decodedToken;
    try{
        decodedToken=jwt.verify(token,'somesupersecretsecre');
    }catch (err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.userid = userid;
    console.log(req.userid);
    next();

};