const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database')
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username, password, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log(rows[0]);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            console.log('login success')
            return done(null, user);
        } else {
            console.log('login failure pass')

            return done(null, false, req.flash('message', 'invalid password'));
        } 
    } else {
        console.log('login failure user')

        return done(null, false, req.flash('message', 'invalid username'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req,username,password, done)=>{

    const { fullname, debit } = req.body;
    const newUser = {
        username,
        password,
        fullname,
        debit,
        credit: debit,
        credit_debt: 0,
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId;
    return done(null, newUser);    

}) );


passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=> {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);

})
