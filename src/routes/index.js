const express = require('express');
const router = express.Router();

const passport = require('passport');
const CheckAuth = require('../utils/auth.js');
const fetch = require("node-fetch");

// Home page
router.get('/', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('index', {
    title: 'Piña Bot',
    user
  });
});

// Premium
router.get('/premium', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('premium', {
    title: "Piña Bot",
    user
  })
});

// Comandos
router.get("/comandos", async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  let allCommands;
  const commandsFetch = await fetch(`${process.env.FETCH}/commands`, {
    method: "GET",
    headers: {
      "pass": `${process.env.ACCESS}`
    }
  })

  if (commandsFetch.ok) allCommands = await commandsFetch.json();

  res.render("comandos", {
    title: "Piña Bot",
    user,
    allCommands: allCommands.filter(c => c.category !== "developer")
  });
});

/* Dev test */
router.get('/dev', CheckAuth, async (req, res) => {
  if (req.user.id !== "883720498272403516") {
    return res.status(403).send(`¡No puedes estar aquí!<br><a href="/">Ir al inicio </a>`)
  }

  const user = await req.client.users.fetch(req.user.id).catch(() => false);

  if (user) {
    res.json({
      user: user,
      reqUser: req.user
    });

  } else {
    return res.send(`No se pudo obtener tus datos...<br><a href="/">Ir al inicio </a>`);
  }

});

// Privacidad
router.get('/privacy', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('privacidad', {
    title: "Piña Bot | Privacidad",
    user
  })
});

// Términos
router.get('/tos', async (req, res) => {
  const user = await req.client.users.fetch(req.user ? req.user.id : null).catch(() => false);

  res.render('terminos', {
    title: "Piña Bot | Términos",
    user
  })
});

// Login
router.get('/login', (req, res, next) => {
  if (req.query.error === 'access_denied') {
    return res.status(401).send(`¡Debes iniciar sesión en Discord!<br> <a href="/">Ir al inicio</a>`);
  } else {
    passport.authenticate('discord', {
      failureMessage: true,
    })(req, res, next);
  }
}, (req, res) => {
  res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.redirect('/');
  } else {
    res.redirect('/')
  }
});

module.exports = router;
