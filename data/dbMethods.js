const db = require('../data/dbConfig.js');


const add = user => {
    return db('users').insert(user)
}

const login = filter => {
    return db('users').where(filter)
}

const get = () => {
    return db('users')
}

module.exports = {
    login,
    add,
    get
}