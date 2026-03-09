const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');

// Submit help desk ticket
router.post(
  '/submit',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('issue').trim().notEmpty().isLength({ min: 10 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, issue } = req.body;

      const ticket = await Ticket.create({
        name,
        email,
        issue,
        status: 'open'
      });

      res.status(201).json({
        success: true,
        message: 'Support ticket submitted successfully',
        ticketId: ticket._id
      });
    } catch (error) {
      console.error('Ticket submission error:', error);
      res.status(500).json({ error: 'Failed to submit ticket' });
    }
  }
);

module.exports = router;