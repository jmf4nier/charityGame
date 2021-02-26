const app = require('express')()
const http = require('http').createServer(app)
const PORT = process.env.PORT || 4000
const io = require('socket.io')(http,{
  tranports: ["websocket", "polling"]
})
let winner = ''
let players = []
let ids = []
io.on('connection', socket => {

  socket.on('ring', (name) =>{
    if(winner === ''){
      console.log(name)
      winner = name
      io.emit('ring', winner)
    }  
     
  })
  socket.on('reset', socket => {
    console.log('winner reset')
    winner = ''
    io.emit('reset', "System Ready")
  })

  socket.on('players', name =>{
    if(ids.includes(socket.id)){
      console.log('player already exists')
    }else{
      ids.push(socket.id)
      players.push(name)
    console.log(players)
    io.emit('players', players)
    }
  })

  socket.on('newGame', (payload)=> {
    console.log(payload, 'player queue erased')
    players = []
    ids = []
    io.emit('newGame', players)
  })
 
})

http.listen(PORT | 4000, function(){
  console.log(`listening on port ${PORT}`)
})