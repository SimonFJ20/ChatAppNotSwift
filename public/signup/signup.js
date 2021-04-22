
const htmlUsername = document.getElementById('username');
const htmlPassword = document.getElementById('password');
const htmlButton = document.getElementById('button');


const signupHandler = async () => {
    const user = {
        username: htmlUsername.value,
        password: htmlPassword.value
    }

    const requestOptions = {
        method: 'POST',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(user),
        redirect: 'follow'
    };

    const res = await (await fetch("/api/users/create", requestOptions)).json();

    if(res.success) {
        window.location.pathname = '/login';
    } else {
        htmlUsername.value = '';
        htmlPassword.value = '';
    }

}

htmlButton.addEventListener('click', signupHandler);

htmlUsername.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        if(htmlPassword.value === '') htmlPassword.focus();
        else if(htmlUsername.value !== '') signupHandler();
    }
});
htmlPassword.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        if(htmlUsername.value === '') htmlUsername.focus();
        else if(htmlPassword.value !== '') signupHandler();
    }
});

