const express = require('express');
const router = express.Router();
const CheckAuth = require('../utils/auth');
const utils = require('../utils/utils');
const fetch = require("node-fetch");

router.use(CheckAuth, async (req, res, next) => next());

router.get("/", async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);
    const userProfile = await fetch(`${process.env.FETCH}/perfil/${req.user.id}`, {
        method: "GET",
        headers: {
          "pass": `${process.env.ACCESS}`
        }
      });

    res.render('perfiles/index', {
        title: "Piña Bot",
        user,
        profile: await userProfile.json(),
        humanize: utils.humanize
    });
});

router.get("/:userID", async (req, res) => {
    const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);
    const userProfile = await fetch(`${process.env.FETCH}/perfil/${req.params.userID}`, {
        method: "GET",
        headers: {
          "pass": `${process.env.ACCESS}`
        }
    });

    res.render('perfiles/index', {
        title: "Piña Bot",
        user,
        profile: userProfile.ok ? await userProfile.json() : null,
        humanize: utils.humanize
    });
});

module.exports = router;
