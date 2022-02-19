const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn, isNotLoggedOut} = require('../lib/auth')

router.get('/signup', isNotLoggedOut, (req, res) => {
    res.render('auth/signup');
})

router.post('/signup', isNotLoggedOut, passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/signin', isNotLoggedOut, (req,res) => {
    res.render('auth/signin');
});

 router.post('/signin', isNotLoggedOut, (req,res, next)=> {
     passport.authenticate('local.signin', {
         successRedirect: '/profile',
         failureRedirect: '/signin',
         failureFlash: true
     })(req,res,next)
});


router.get('/profile', isLoggedIn, (req,res) => {
    res.render('./profile')
});

router.get('/logout', isLoggedIn, (req,res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;