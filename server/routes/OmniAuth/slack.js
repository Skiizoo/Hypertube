const express = require('express');
const router = express.Router();
const user = require('../../models/user');
const SlackStrategy = require('passport-slack').Strategy
const passport = require('passport');

const cors = require('cors');
router.use(cors());

const utils = require('../../models/utils')

const SLACK_APP_ID = '179072718960.603364952754';
const SLACK_APP_SECRET = 'a8d8c3ca89608d149fa9751df80e01c7';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(new SlackStrategy({
        clientID: SLACK_APP_ID,
        clientSecret: SLACK_APP_SECRET,
        scope: 'identity.basic identity.email identity.avatar',
        callbackURL: "http://localhost:4000/auth/slack/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile.user)
        mongodb.collection('user').findOne({
            $or: [{
                login: profile.user.displayName
            }, {
                email: profile.user.email
            }, {
                authSlackId: profile.user.id
            }]
        }).then(user => {
            if (user) {
                if (user.authslackId == profile.id) {
                    return done(null, user);
                } else{
                    console.log("user youpi");
                    return done(null, null);
                }
            } else {
                mongodb.collection('user').insertOne({
                    login: 'Slack_' + profile.user.name,
                    email: profile.user.email,
                    password: '',
                    salt: '',
                    lastname: '',
                    firstname: '',
                    lang: 'en',
                    tokenVerif: '',
                    authSlackId: profile.user.id
                }, (err, result) => {
                    if (err) {
                        //console.log(err);
                        return (null, null);
                    }
                    //console.log(result.ops[0]);
                    return done(null, result.ops[0]);
                })
            }
        })
    }));

router.get('/', passport.authenticate('slack'));

router.get('/redirect', passport.authenticate('slack', {
    failureRedirect: 'http://localhost:8080/login?error=1'
}), (req, res) => {
 //   console.log("redirect")
    return new Promise((fullfil, reject) => {
        //     console.log(req.user);
        const data = {};
        data.params = req.user;
        fullfil(data);
    })
    .then(utils.generateKey)
    .then(user.updateAuthenticatedToken)
    .then(data => { /*res.send({ success: true, data: data.params })*/
                    res.redirect('http://localhost:8080/login?loggin='+data.params.login+'&key='+data.params.key)
})
  //      res.status(200).redirect('http://localhost:8080/login?logged');
});
module.exports = router;