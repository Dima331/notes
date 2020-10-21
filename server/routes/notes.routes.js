const express = require("express");
const router = express.Router();

const notesController = require('../controllers/notes.controllers');

router.get('/', notesController.getNotes);

module.exports = router;

