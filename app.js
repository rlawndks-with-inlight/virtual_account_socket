const express = require('express');
const cors = require('cors');
const fs = require('fs')
const app = express();
require('dotenv').config();
app.use(cors());

const https = require('https');
const http = require('http');

const PORT = 5000;

const HTTP_PORT = 2000;
const HTTPS_PORT = 3000;

let server = undefined
if (process.env.NODE_ENV == 'development') {
    server = http.createServer(app)
} else {
    const options = { // letsencrypt로 받은 인증서 경로를 입력해 줍니다.
        ca: fs.readFileSync("/etc/letsencrypt/live/api.tikitaka.kr/fullchain.pem"),
        key: fs.readFileSync("/etc/letsencrypt/live/api.tikitaka.kr/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/api.tikitaka.kr/cert.pem")
    };
    server = https.createServer(options, app)
}
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        console.log(msg)
        const {
            method, data, brand_id
        } = msg;
        if (method == 'deposit') {
            io.emit('message', {
                method, data, brand_id
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
if (process.env.NODE_ENV == 'development') {
    server.listen(HTTP_PORT, function () {
        console.log("Server on " + HTTP_PORT)
    });
} else {
    server.listen(HTTPS_PORT, function () {
        console.log("Server on " + HTTPS_PORT)
    });
}

