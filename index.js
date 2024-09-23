// import * as http from 'http'
// import * as https from 'https'
// import express from 'express'
// import * as path from 'path'
// import * as fs from 'fs';
// import cors from 'cors'
// import * as mysql from 'mysql2'
// import {parse} from 'csv-parse'
// import * as cowsay from 'cowsay'
const http = require('http');
const cowsay = require('cowsay')
const https = require('https')
const express = require('express')
const app = express()
// const Joi = require('joi');
const path = require('path')
// const os = require('os')
const fs = require('fs')
// const EventEmitter = require('events')
const cors = require("cors")
// const { spawn } = require('child_process');
const { exec } = require('child_process')
// const mysql = require('mysql2')
// const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const bcrypt = require("bcryptjs")
// const jwt = require('jsonwebtoken')
// const csv = require('csv-parser')
const {parse} = require('csv-parse');
const readline = require('readline')
const alphaTab = require("@coderline/alphatab")
// const { readXls } = require('read-excel-file/node');
// const authRoutes = require('./routes/authRoutes')
// const commentRoutes = require('./routes/commentRoutes')
// const projectRoutes = require('./routes/projectRoutes')
// const libraryRoutes = require('./routes/libraryRoutes')
// const trRoutes = require('./routes/trRoutes');
// const { default: createTRPage } = require('./public/js/tr');
// const cookieParser = require('cookie-parser')
// const { requireAuth, checkUser, checkConnection } = require('./middleware/authMW')
// const connection = require('./controllers/mySQL')
// const stream = require('node-rtsp-stream')
// const multer = require('multer')

// @01               ESTABLISH ARCHITECTURES AND CONNECTIONS
// @02               Commands for the terminal room layout
// @03               Commands for the eWo database
// @04               Commands for the comments database
// @05               Commands for handling user accounts
// @06                     Project Management

// @0X TEST CODE AND COMMUNICATION FRAMEWORKS

//////////////////////////////////////////
// @01 ESTABLISH ARCHITECTURES AND CONNECTIONS
//////////////////////////////////////////
const jwtSecret = '28d1a301afccb72337f6f4d5b3270495869bae3690a2b3f4b0bc61674e9a0da01ad99d'
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
// app.use(authRoutes)
// app.use(commentRoutes)
// app.use(projectRoutes)
// app.use(libraryRoutes)
// app.use(trRoutes)
app.use(express.static(path.join(__dirname, 'public/')))
// app.use(cookieParser());

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').__express)



// Page Routes
// app.get('*', checkUser);
// app.get('/veex', requireAuth, checkConnection, (req, res) => res.render('veex'))

app.get('/', (req, res) => res.render('main'))
// app.get('/', (req, res) => {
//     // const homepageContent = createTRPage();
//     res.send(createTRPage);
// });

app.get('/songs', (req, res) => res.render('songs'))
app.get('/apps', (req, res) => res.render('apps'))
app.get('/news', (req, res) => res.render('news'))
app.get('/jazz', (req, res) => res.render('jazz'))
app.get('/player', (req, res) => res.render('player'))
// DATA STORAGE
app.get('/data/songs', (req, res) => {
    const fold = 'C:/Users/creat/Documents/Code/Music App/data/'
    let data = JSON.parse(fs.readFileSync(fold + 'songs.json'))
    console.log(data);
    res.send(data)
})
// app.get('/data/pics/:id', (req, res) => {
//     id = req.params.id;
//     const fold = 'C:/Users/creat/Documents/Code/Music App/data/pics/'
//     let data = JSON.parse(fs.readFileSync(fold + id + '.png'))
//     console.log(data);
//     res.send(data)
// })
app.get('/tabs/:pdf', (req, res) => {
    const fold = 'C:/Users/creat/Documents/Code/Music App/data/tabs/'
    const pdf = req.params.pdf
    const filePath = fold + pdf + '.pdf'
    res.sendFile(filePath)
})
// Setup Storages
// let imageName = 'donkey.jpg'
// app.get('/comments/image-name/:name', (req, res) => {
//     console.log(imageName)
//     imageName = req.params.name + '.jpg'
//     console.log(imageName)
//     res.json('imageName')
//     return imageName
// })
app.get('/player/:gp', (req, res) => {
    const fold = 'C:/Users/creat/Documents/Code/Music App/data/player/'
    const gp = req.params.gp
    const filePath = fold + gp
    res.sendFile(filePath)
})

/////// SET UP MUSIC PLAYER \\\\\\\\\
app.post('/playme', (req, res) => {
    const { path, name } = req.body
    const fileData = fs.readFileSync(path + name)
    const settings = new alphaTab.Settings()
    const score = alphaTab.importer.ScoreLoader.loadScoreFromBytes(
        new Uint8Array(fileData),
        settings
    )
    console.log(score.title)

    // Setup Renderer
    settings.core.engine = 'svg'
    const renderer = new alphaTab.rendering.ScoreRenderer(settings)
    renderer.width = 1200

    // Listen to Events
    let svgChunks = [];
    renderer.preRender.on((r) => {
        svgChunks.push({
            svg: r.renderResults,
            width: r.width,
            height: r.height,
        })
    })
    renderer.renderFinished.on((r) => {
        displayResult(svgChunks, r.totalWidth, r.totalHeight)
    })

    // Fire off rendering
    renderer.renderScore(score, [0])

    // Log chunks
    console.log(svgChunks.map((c) => c.svg).join("\n"))
})

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/images')
//     },
//     filename: function (req, file, cb) {
//         cb(null, imageName)  //file.originalname
//     }
// })
// console.log(storage)
// const upload = multer({ storage: storage })
 
// app.post('/comments/image', upload.single('veex_image1'), (req, res) => {
//     console.log('Mission complete')
//     res.json('Mission complete')
// })

// app.get('/auth/user', (req, res) => {
//     console.log(req.cookies)
//     res.send(req.cookies)
// })
// cookies
// app.get('/set-cookies', (req, res) => {
//     // res.setHeader('Set-Cookie', 'newUser=true')
//     res.cookie('newUser', false)
//     res.cookie('isHired', true, { maxAge: 1000 * 3600 * 24})
//     res.send('you got the cookies')
// })

// app.get('/read-cookies', (req, res) => {
//     const cookies = req.cookies
//     console.log(cookies)
//     res.json(cookies)
// })

// stream = new stream({
//     name: 'cam1',
//     streamURL: 'rtsp://10.80.129.131:554/ch01',
// })

///////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// @02                          Commands for the terminal room layout
///////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get('/api/tr/veex/das1', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //let testJson = JSON.parse(fs.readFileSync('./VEExDAS1.json'))
    let testJson = JSON.parse(fs.readFileSync('C:/SVN/Configs_and_Batches/Test_Stand_Configs/VEEx/system_configs/DAS/VEExDAS1.json'))
    res.send(testJson);
})

app.get('/api/tr/veex/das2', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //let testJson = JSON.parse(fs.readFileSync('./VEExDAS2.json'))
    let testJson = JSON.parse(fs.readFileSync('C:/SVN/Configs_and_Batches/Test_Stand_Configs/VEEx/system_configs/DAS/VEExDAS2.json'))
    res.send(testJson);
})

app.get('/api/courses/geex', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let geexJson = JSON.parse(fs.readFileSync('./GEExDAS5.json'))
    res.send(geexJson);
})

app.get('/api/tr/veex/fvc1', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let results = [];
    fs.createReadStream('C:/SVN/Configs_and_Batches/Test_Stand_Configs/VEEx/system_configs/valve_controllers/VEEx_FVC1_Valve_Configuration.csv')
    .pipe(parse({ delimiter: ",", from_line: 104}))
    .on('data', function(row) {
       results.push(row)
    })
    .on("end", function () {
        res.send(results)
    })
})

app.get('/api/tr/veex/fvc2', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let results = [];
    fs.createReadStream('C:/SVN/Configs_and_Batches/Test_Stand_Configs/VEEx/system_configs/valve_controllers/VEEx_FVC2_Valve_Configuration.csv')
    .pipe(parse({ delimiter: ",", from_line: 77}))
    .on('data', function(row) {
       results.push(row)
    })
    .on("end", function () {
        res.send(results)
    })
})

app.get('/api/tr/veex/fvc1di', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let results = [];
    fs.createReadStream('C:/SVN/Configs_and_Batches/Test_Stand_Configs/VEEx/system_configs/valve_controllers/VEEx_FVC1_DI.csv')
    .pipe(parse({ delimiter: ",", from_line: 2}))
    .on('data', function(row) {
       results.push(row)
    })
    .on("end", function () {
        res.send(results)
    })
})

app.get('/api/tr/veex/fvc2di', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let results = [];
    fs.createReadStream('C:/SVN/Configs_and_Batches/Test_Stand_Configs/VEEx/system_configs/valve_controllers/VEEx_FVC2_DI.csv')
    .pipe(parse({ delimiter: ",", from_line: 2}))
    .on('data', function(row) {
       results.push(row)
    })
    .on("end", function () {
        res.send(results)
    })
})


// ///////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// // @05                          User authentication  This is ported to MVC approach
// ///////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// // Log user in
// // app.post('/api/users/auth', (req, res) => {
// //     const { username, password } = req.body
// //     if (!username || !password) {
// //         console.log('No username or password')
// //         return res.status(400).json({
// //             msg: "Username or Password not provided",
// //         })
// //     }
// //      // Retrieve users database
// //     connection.query('SELECT * FROM users', (error, results, fields) => {
// //     if (error) {
// //         console.error('Error finding table', error);
// //     } else {
// //     const allUsers = results;
// //     const loc = getIndex(username, allUsers)
// //         if (typeof loc === 'number') {
// //             bcrypt.compare(password, allUsers[loc].password).then(function (result) {
// //                 console.log(result)
// //                 if (result) {
// //                     res.status(200).json({
// //                         user: allUsers[loc].username,
// //                         msg: "Login Successful",
// //                     })
// //                  } else res.status(200).json({ 
// //                     user: 'Guest',
// //                     msg: "Password incorrect" 
// //                 })
// //                 })
// //             } else res.status(200).json({ 
// //                 user: 'Guest',
// //                 msg: "User does not exist" 
// //             })
// //         }
// //     })
// // })

// //  // Elevate user to admin
// //  app.post('/api/users/elevate', (req, res) =>{

// //  })

// //  // Delete user
// //  app.get('/api/users/delete/:username', (req, res) => {
// //     connection.query('DELETE FROM users WHERE username = ?', req.params.username, (error, results, fields) => {
// //         if (error) {
// //             console.error('Error deleting entry:', error)
// //         }
// //         else {
// //             console.log('Entry deleted successfully')
// //         } 
// //     })
// //  })

// //  function getIndex(username, allUsers) {
// //     for (let i = 0; i < allUsers.length; i++) {
// //         if (allUsers[i].username === username) {
// //             return index = i
// //         }
// //     }
// //     return null; // Return null if user is not found
// // }

// // environment variable
const port = process.env.PORT || 4000 // use the chosen variable if available, if not use 3000
app.listen(port, () => console.log(`Listening on port ${port}`))

