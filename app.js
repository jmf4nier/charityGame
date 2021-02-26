const app = require('express')()
const http = require('http').createServer(app)
const path = require('path');
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
      winner = name
      console.log(`winner is ${winner}`)
      io.emit('ring', winner)
    }else{
      console.log('theres already a winner')
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
    console.log(players, `player ${name} added`)
    io.emit('players', players)
    }
  })

  socket.on('newGame', (payload)=> {
    console.log(payload, 'player queue erased')
    players = []
    ids = []
    winner = ''
    console.log(ids,players)
    io.emit('newGame', players)
  })
 
 
})

http.listen(PORT, function(){
  console.log(`listening on port ${PORT}`)
})