
const state = {
    username: localStorage.getItem('username') ? localStorage.getItem('username') : 'user',
    room: null
}

const updateRoom = async () => {
    document.querySelector('#chat-container > div > h1').innerHTML = state.room.title;
    const messages = await (await fetch('/api/messages/getAll/' + state.room._id)).json();
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    for(let i in messages) {
        chatList.innerHTML += '<div><p> - <b>' + messages[i].username + ':</b></p><p>' + messages[i].message + '</p></div>'
    }
}

const loadGroups = async () => {
    const groupContainer = document.getElementById('group-container');
    const groups = await (await fetch('/api/rooms/getAll')).json();
    for(let i in groups) {
        const button = document.createElement('button');
        button.className = "group";
        button.innerHTML = '<h2>' + groups[i].title + '</h2>'
        groupContainer.appendChild(button);
        button.addEventListener('click', () => {
            state.room = groups[i]; updateRoom()
        });
    }
}

const loadSetting = () => {
    const username = document.getElementById('loginUsername');
    document.getElementById('upload').addEventListener('click', () => {
        document.getElementById('loginBox').style.visibility = 'visible';
        username.value = state.username;
    });
    document.getElementById('loginButton').addEventListener('click', () => {
        if(username.value !== '') {
            state.username = username.value;
            localStorage.setItem('username', state.username);
            document.getElementById('loginBox').style.visibility = 'hidden';
        }
    });
}

const loadSubmit = () => {
    const htmlInput = document.getElementById('message-input');
    const htmlButton = document.getElementById('message-button');
    htmlButton.addEventListener('click', async () => {
        if(state.room === null) return;
        if(htmlButton.value === null) return;
        const message = {
            username: state.username,
            message: htmlInput.value,
            roomId: state.room._id
        }

        htmlInput.value = '';

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(message),
            redirect: 'follow'
        };

        fetch("/api/messages/send", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        updateRoom();
    });
}

loadGroups();
loadSetting();
loadSubmit();




