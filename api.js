const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const router = express.Router();

const generateId = (length) => {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) id += characters.charAt(Math.floor(Math.random() * characters.length));
    return id;
}

const activeUsers = [];

const api = async () => {

    const mongoURI = process.env.MONGODB;
    const client = new mongodb.MongoClient(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    console.log('Connected to MongoDB Cloud');
    const database = client.db('swiftAppMessenger');

    const Rooms = database.collection('rooms');
    const Messages = database.collection('messages');
    const Users = database.collection('users');

    router.get('/rooms/getAll', async (req, res) => {
        try {
            const cursor = Rooms.find();
            const rooms = await cursor.toArray();
            res.status(200).json(rooms);
        } catch {
            res.status(500).json({success: false});
            console.error('error on /rooms/getAll');
        }
    });
    
    router.post('/rooms/create', async (req, res) => {
        try {
            const newRoom = {
                title: req.body.title,
                description: req.body.description,
                userId: req.body.userId
            }
            const room = await Rooms.insertOne(newRoom);
            res.status(200).json({success: true, ...room.ops[0]});
        } catch {
            res.status(500).json({success: false});
            console.error('error on /rooms/create');
        }
    });
    
    router.get('/messages/getAll/:roomId', async (req, res) => {
        try {
            const cursor = await Messages.find({roomId: req.params.roomId}, {sort: {timeStamp: 1}});
            const messages = await cursor.toArray();
            res.status(200).json(messages);
        } catch {
            res.status(500).json({success: false});
            console.error('error on /messages/getAll');
        }
    });
    
    router.post('/messages/send', async (req, res) => {
        try {
            const message = {
                roomId: req.body.roomId,
                username: req.body.username,
                userId: req.body.userId,
                message: req.body.message,
                createdAt: Date()
            }
            const newMsg = await Messages.insertOne(message);
            res.status(200).json({success: true, ...newMsg.ops[0]});
        } catch {
            res.status(500).json({success: false});
            console.error('error on /messages/send');
        }
    });

    router.post('/users/create', async (req, res) => {
        try {
            const user = {
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 10),
                description: '',
                createdAt: Date()
            }
            const existingUser = await Users.findOne({username: user.username});
            if(existingUser) {
                res.status(400).json({success: false, status: 'username taken'});
                return;
            }
            const newUser = await Users.insertOne(user);
            res.status(200).json({success: true, username: newUser.ops[0].username, userId: newUser.ops[0]._id});
        } catch {
            res.status(500).json({success: false});
            console.error('error on /users/create');
        }
    });

    router.post('/users/login', async (req, res) => {
        try {
            const user = await Users.findOne({username: req.body.username});
            if(user === null) {
                res.status(400).json({success: false, status: 'not found'});
                return;
            }
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if(!passwordMatch) {
                res.status(400).json({success: false, status: 'notFound'});
                return;
            }
            const token = generateId(32);
            activeUsers.push({userId: user._id, token: token, username: user.username});
            res.status(200).json({success: true, token: token, userId: user._id, username: user.username});
        } catch {
            res.status(500).json({success: false});
            console.error('error on /users/login');
        }
    });

    router.post('/users/check', async (req, res) => {
        try {
            const token = req.body.token;
            for(let i in activeUsers) {
                if(activeUsers[i].token === token) {
                    res.json({success: true, token: token}).status(200);
                    return;
                }
            }
            res.status(400).json({success: false});
        } catch {
            res.status(500).json({success: false});
            console.error('error on /users/check');
        }
    });

    router.post('/users/logout', async (req, res) => {
        try {
            const token = req.body.token;
            for(let i in activeUsers) if(activeUsers[i].token === token) activeUsers[i] = null;
            res.json({success: true}).status(200);
        } catch {
            res.json({success: false}).status(500);
            console.error('error on /users/logout');
        }
    });

}


api();
module.exports = router;
