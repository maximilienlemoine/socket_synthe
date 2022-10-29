const express = require('express')
const app = express();
const server = require('http').createServer(app);
const favicon = require('serve-favicon')
const path = require('path')
const io = require('socket.io')(server, { cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, "node_modules/jquery/dist/")));
app.use(express.static(path.join(__dirname, "node_modules/jquery-ui/dist/")));
app.use(express.static(path.join(__dirname, "public/asset/")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/', (req, res) => {
    res.sendFile(__dirname+`/public/`)
});

app.get('/back', (req, res) => {
    res.sendFile(__dirname+`/public/back/`)
});


io.on('connection', (socket) =>{ //Récupération des connexions des interfaces front et back
    socket.on('connexion', (loca) => {
        let datetime = new Date()
        console.log(datetime.getHours() + ' : ' + datetime.getMinutes() + ' | Interface '+ loca + ' connecté.') //Connexion

        socket.on("disconnect", (reason) =>{ //Déconnexion
            console.log(datetime.getHours() + ' : ' + datetime.getMinutes() + ' | Interface '+ loca + ' déconnecté pour : ' + reason+'.')
        })

        socket.on('BackToServer', (info) => { //récupération des informaions par le serveur du back
            console.log('Back send : ' + info);

            socket.broadcast.emit('ServerToFront', info); //Envoie des informations au front par le serveur
            console.log('Server emit : ' + info)
        });
    })
});

server.listen(3000, ()=> {
    console.log('Démarré.')
})