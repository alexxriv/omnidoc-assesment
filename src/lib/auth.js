module.exports = {
    isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    },

    isNotLoggedOut(req,res,next){
        if(req.isAuthenticated()){
            return res.redirect('/profile');
        }
        return next();
    },

    enoughBalance(req,res,next){
        if(req.body.debit<1000){
            return res.redirect('/signup');
        }
        return next();
    }

    
}