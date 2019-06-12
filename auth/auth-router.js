const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../data/dbMethods')
const restriced = require('./restricted-middleware')
const secrets = require('../config/secrets.js')

// generateToken = user => {
//     jwt.sign({
//         userId: user.id,
//     }, 'super secret', {
//         expiresIn: '1h',
//     } (err, token))
// }


generateToken = user => {
    const payload = {
        subject: user.id, // sub
        username: user.username
            // ...other data

    }
    const options = {
        expiresIn: '8h',
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}

router.post('/register', (req, res) => {
    let user = req.body;
    if (!user.username || !user.password || !user.department) {
        res.status(404).json({ message: 'Missing pass and or name' })
    } else {
        const hash = bcrypt.hashSync(user.password, 14)
        user.password = hash;
        Users.add(user)
            .then(saved => {
                res.status(201).json(saved)
            })
            .catch(err => {
                res.status(500).json({ message: 'Some type of error', err })
            })
    }
})


router.post('/login', (req, res) => {
    let { username, password } = req.body

    Users.login({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                jwt.sign({
                    userId: user.id,

                }, 'super secret', {
                    expiresIn: '5h',
                }, (err, token) => {
                    if (err) {
                        res.status(401).json({ message: 'Could not generate token' })
                    } else {
                        res.status(200).json({
                            message: `Welcome ${user.username}`,
                            authToken: token,
                        })
                    }
                })

            } else {
                res.status(401).json({ message: 'Invalid Credentials' })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})


generateToken = user => {
    const payload = {
        subject: user.id, // sub
        username: user.username
            // ...other data
    }
    const options = {
        expiresIn: '8h',
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}



module.exports = router;