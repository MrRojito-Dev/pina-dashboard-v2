const path = require('path');
const express = require('express');
const passport = require('passport');
const bodyParser = require("body-parser");
const { Strategy } = require('passport-discord');
const session = require('express-session');

const app = express();
const server = require('http').createServer(app);
const MemoryStore = require("memorystore")(session);

module.exports = async (client) => {
    passport.serializeUser((user, done) => {
      done(null, user);
    });
  
    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });
  
    passport.use(new Strategy({
      clientID: client.config.id,
      clientSecret: client.config.clientSecret,
      callbackURL: `${client.config.domain}/login`,
      scope: ['identify', 'guilds'],
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(async () => {
        const webLogs = await client.channels.fetch("990376060279484486");
        webLogs.send(`**${profile.username}#${profile.discriminator} (${profile.id})** ha iniciado sesión`);

        return done(null, profile);
      });
    }));

    app.use(session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
      resave: false,
      saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use((req, res, next) => {
      req.client = client;
      next();
    });

    app.use(express.static(path.join(__dirname, 'public')));

    const routers = {
      index: require('./routes/index'),
      dashboard: require('./routes/dashboard'),
    };

    app.use('/', routers.index);
    app.use('/dashboard', routers.dashboard);

    // 404 error page
    app.get('*', (req, res) => {
      res.status(404).render('partials/404', {
        title: "Piña Bot"
      });
    });

    const port = client.config.port || 8080;

    process.on('uncaughtException', (err) => {
      console.log(err);
    }); 

    server.listen(port, () => console.log(`Server listen on port ${port}`));
}