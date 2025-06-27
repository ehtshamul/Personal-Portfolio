const express = require('express');
const router = express.Router();

// Controllers
const { adminreg, login, profile } = require('../../controller/admin/roles'); ///admin 



// Middleware
const middleware = require('../../middleware/usermiddle');


// 🔹 Admin Routes
router.post('/register', adminreg);
router.post('/login', login);
router.get('/profile', middleware, profile);


///admin blog routers


module.exports = router;
