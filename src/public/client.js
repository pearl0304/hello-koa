
// IIFE
;(()=>{
    const socket = new WebSocket(`ws://${window.location.host}/ws`)


    socket.addEventListener('open',()=>{
        socket.send('server connection!')
    })

    socket.addEventListener('message',event=>{
        alert(event.data)
    })
})()



