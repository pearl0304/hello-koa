;(()=>{
    const socket = new WebSocket (`ws://${window.location.host}/ws`)
    const formEl = document.getElementById('form')
    const inputEl = document.getElementById('input')
    const chatsEl = document.getElementById('chats')

    if(!formEl || !inputEl || !chatsEl) throw new Error ('Init failed')

    const chats =[]

    const adjectives = ['멋진', '훌륭한', '친절한', '새침한']
    const animal = ['물범', '사자', '토끼', '강아지', '돌고래']

    function pickRandomNickname(array){
        const randomIdex = Math.floor(Math.random()*(array.length))
        const result = array[randomIdex]
        if(!result) {
            throw new Error('array lenth is 0')
        }
        return result
    }

    const usernickname = `${pickRandomNickname(adjectives)} ${pickRandomNickname(animal)}` 

    formEl.addEventListener('submit',(e)=>{
        e.preventDefault() // 폼 제출 안되게 막기
        socket.send(
            JSON.stringify(
                {
                    nickname : usernickname,
                    message : inputEl.value
            }
            )
        )
        inputEl.value=''
        

    })

    const drawChats = ()=>{
        chatsEl.innerHTML=''
        chats.forEach(({message,nickname})=>{
            const div = document.createElement('div')
            div.innerText = `${nickname}:${message}`
            chatsEl.appendChild(div)  
        })
    }

    // [Recive]
    socket.addEventListener('message',(e)=>{
        const {type, payload} = JSON.parse(e.data)

        if(type ==='sync'){
            const {chats : syncedChats} =payload
            chats.push(...syncedChats)
            
        }else if (type ==='chat'){
            const chat = payload
            chats.push(chat)
        }

     
        drawChats()
        





        
    })
})()




