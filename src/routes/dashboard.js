const express = require('express');
const router = express.Router();

const passport = require('passport');
const CheckAuth = require('../utils/auth');
const utils = require('../utils/utils');

router.use(CheckAuth, async (req, res, next) => {
  try {
    const bot_thing = await utils.getBotGuilds(req.user.guilds);
    const toshow = utils.getGuilds(bot_thing, req.user.guilds);
    req.user.toShowGuilds = toshow;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/");
  }
});

router.get('/', async (req, res) => {
  const user = await req.client.users.fetch(req.user.id);

  const adminguilds = req.user.guilds.filter(e => utils.getPermissions(e.permissions).get("ADMINISTRATOR"));
  const guildsBotIn = req.user.toShowGuilds;
  const guildsBotNotIn = adminguilds.filter(x => !guildsBotIn.map(g => g.id).includes(x.id));

  res.render('dashboard/dashboard', {
    user: user,
    guildsBotIn,
    guildsBotNotIn,
    title: "Piña Bot",
    load: false
  });

});

router.get('/admin', CheckAuth, async (req, res) => {
  if (req.user.id !== "648654138929840164") {
    return res.status(403).send(`¡No puedes estar aquí!<br><a href="/">Ir al inicio </a>`)
  }

  const user = await req.client.users.fetch(req.user.id).catch(() => false);

  if (user) {
    res.json({
      user: user,
      guilds: req.user.guilds
    });

  } else {
    return res.send(`No se pudo obtener tus datos...<br><a href="/">Ir al inicio </a>`);
  }

});

module.exports = router;
