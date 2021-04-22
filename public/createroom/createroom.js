
const htmlTitleInput = document.getElementById('title');
const htmlCreateButton = document.getElementById('create');
const htmlBackButton = document.getElementById('back');

checkLogin();

const createHandler = async () => {
    if(htmlTitleInput.value === '') return;

    const room = {
        userId: sessionStorage.getItem('userId'),
        title: htmlTitleInput.value,
        description: ''
    }

    const reqOptions = {
        method: 'POST',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(room),
        redirect: 'follow'
    };

    const res = await (await fetch("/api/rooms/create", reqOptions)).json();
    
    if(res.success) {
        window.location.pathname = '';
    } else {
        
    }

}

htmlCreateButton.addEventListener('click', createHandler);
htmlBackButton.addEventListener('click', () => window.location.pathname = '/');
