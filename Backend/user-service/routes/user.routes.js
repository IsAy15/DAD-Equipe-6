const router = require('express').Router();

router.post('/', (req, res) => {
    res.status(200).json({
        message: 'User Service is running',
        status: 'success'
    });
});

module.exports = router;