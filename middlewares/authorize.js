function primaryAuthorization(req,res,next){
    let user = req.loggedInUser;
    if(user && user.role === 'ADMIN_P'){
        req.pAuthorized = true;    
        next()
        }
        else{
            return next({
                msg: 'You are not authorized to do this action'
            })   
          }
}
function secondaryAuthorization(req,res,next){
    let user = req.loggedInUser;
    if(user && user.role &&user.role.substring(0,5).toLowerCase() === 'admin'){
    req.sAuthorized = true;    
    next()
    }
    else{
        return next({
            msg: 'You are not authorized to do this action'
        }) 
    }

}

module.exports = {
    primaryAuthorization, 
    secondaryAuthorization
}