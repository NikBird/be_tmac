const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const axios = require('axios')
const router = express.Router();

router.use(cookieParser());

router.get('', async (req, res) => {res.render('index')})

router.get('/verify', async (req, res) => {res.render('verify')})
router.get('/accounts', async (req, res) => {res.render('accounts')})
router.get('/spam', async (req, res) => {res.render('spam')})
module.exports = router;