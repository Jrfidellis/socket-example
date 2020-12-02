const socket = io()

// Solicita a lista de arquivos ao servidor
socket.emit('ls files')

// Espera o retorno da lista de arquivos
socket.on('ls return', (files) => {
    // Adiciona os arquivos em uma lista no HTML, junto com botão pra download
    const filesUl = document.getElementById('files')
    files.forEach(file => {
        const li = document.createElement('li')
        li.innerHTML = file

        const btn = document.createElement('button')
        btn.innerHTML = 'download'
        // Solicita o arquivo do servidor quando clicado no botão de download
        btn.onclick = () => socket.emit('download', file)
        li.append(btn)

        filesUl.append(li)
    });
})

// Espera retornos de arquivos baixados e exibe no HTML
socket.on('downloaded', (res) => {
    const output = document.getElementById('output')
    output.innerHTML = `
        <b>arquivo:</b> ${res.nome}
        <br><br>
        <b>base64:</b> <code>${res.base64}</code>
    `
})
