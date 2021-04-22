
const dom = {
    userManagerUsername: document.getElementById('userManagerUsername'),
    userManagerLogout: document.getElementById('userManagerLogout'),
    roomContainer: document.getElementById('room-container'),
    chatListContainer: document.getElementById('chat-list-container'),
    createRoomButton: document.getElementById('createRoom'),
    chatFieldSubmit: document.getElementById('chat-field-submit'),
    chatField: document.getElementById('chat-field'),
}

const state = {
    room: null,
    roomUpdateInterval: null,
}

const setUserManager = () => {
    dom.userManagerUsername.innerHTML = sessionStorage.getItem('username');
    dom.userManagerLogout.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.pathname = '/login';
    });
}

const loadRoom = async () => {
    if(state.room === null) return;
    const messages = await (await fetch('/api/messages/getAll/' + state.room._id)).json();
    dom.chatListContainer.innerHTML = '';
    for(let i in messages) {
        const p = document.createElement('p');
        if(messages[i].username === sessionStorage.getItem('username')) p.className = 'chat right';
        else p.className = 'chat left';
        p.setAttribute('username', messages[i].username);
        p.innerHTML = messages[i].message;
        dom.chatListContainer.appendChild(p);
    }
}

const setRoomUpdater = async () => {
    clearInterval(state.roomUpdateInterval);
    state.roomUpdateInterval = setInterval(() => {
        loadRoom();
    }, 1000);
}

const setCreateRoom = async () => {
    dom.createRoomButton.addEventListener('click', () => {
        window.location.pathname = '/createroom';
    });
}

const setRoomsMenu = async () => {
    setCreateRoom();
    try {
        const rooms = await (await fetch('/api/rooms/getAll')).json();
        for(let i in rooms) {
            const button = document.createElement('button');
            button.className = 'room';
            button.innerHTML = rooms[i].title;
            dom.roomContainer.appendChild(button);
            button.addEventListener('click', () => {
                state.room = rooms[i];
                document.querySelectorAll('.room.active').forEach(i => i.className = i.className.replace('active', '')); 
                button.className += ' active';
                loadRoom();
                setRoomUpdater();
            });
        }
    } catch {
        console.error('1')
    }
}

const setMessageSubmitter = () => {
    dom.chatFieldSubmit.addEventListener('click', async () => {
        if(state.room === null) return;
        if(dom.chatField.value === '') return;

        const message = {
            roomId: state.room._id,
            username: sessionStorage.getItem('username'),
            userId: sessionStorage.getItem('userId'),
            message: dom.chatField.value
        }
    
        const reqOptions = {
            method: 'POST',
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify(message),
            redirect: 'follow'
        };
    
        const res = await (await fetch("/api/messages/send", reqOptions)).json();
    
        if(res.success) {
            dom.chatField.value = '';
        }

        loadRoom();
    });
}

checkLogin();
setUserManager();
setRoomsMenu();
setMessageSubmitter();



