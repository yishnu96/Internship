const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const keys = require('./keys');
const crypto = require('crypto')

// ------- Confrigation of Passport FacebookStrategy ---//
passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret: keys.FACEBOOK_APP_SECRET,
    callbackURL: keys.FACEBOOK_CALLBACK_URL,

    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name']
  },
  function (accessToken, refreshToken, profile, done) {

    User.findOne({
      email: profile.emails[0].value
    }).exec( function (err, user) {
      if (err) {
        return done(err);
      }
      console.log(profile);

      if (user) {
        done(null, user);
      } else {
        User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            facebookId : profile.id,
            password: crypto.randomBytes(20).toString('hex')
          }),
          function (err, user) {
            if (err) {
              console.error('ERROR: FB_Passport ', err);
            }
            return done(null, user);
          }
      }

    });
  }
));

module.exports = passport;