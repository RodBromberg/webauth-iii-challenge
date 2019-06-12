const router = require('express').Router();
const restricted = require('../auth/restricted-middleware')
const Users = require('../data/dbMethods');

router.get('/', (req, res) => {
    Users.get()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = router;