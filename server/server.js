const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const fs = require('fs')

app.use(express.static(__dirname + '/client'))

// Espera conexão
io.on('connection', (socket) => {
  // Escuta o evento 'ls files'
  socket.on('ls files', () => {
    const files = lsFiles()
    // Retorna a lista de arquivos pro cliente, pelo evento 'ls return'
    io.emit('ls return', files)
  })

  // Escuta o evento 'download', recebe o arquivo requisitado
  socket.on('download', (file) => {
    // Retorna o arquivo requisitado, em base64
    const fileBase64 = getFile(file).toString('base64')
    io.emit('downloaded', { nome: file, base64: fileBase64 })
  })
})

// Inicia o servidor
http.listen(3000, () => {
  console.log('listening on *:3000')
})

// Lê o diretório de arquivos e retorna
const lsFiles = () => fs.readdirSync(__dirname + '/files')
const getFile = (file) => fs.readFileSync(__dirname + '/files/' + file)