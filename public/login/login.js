
const htmlUsername = document.getElementById('username');
const htmlPassword = document.getElementById('password');
const htmlButton = document.getElementById('button');
const htmlRegisterButton = document.getElementById('registerButton');

const loginHander = async () => {
    const user = {
        username: htmlUsername.value,
        password: htmlPassword.value
    }

    const reqOptions = {
        method: 'POST',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(user),
        redirect: 'follow'
    };

    const res = await (await fetch("/api/users/login", reqOptions)).json();

    if(res.success) {
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('userId', res.userId);
        sessionStorage.setItem('userToken', res.token);
        window.location.pathname = '';
    } else {
        htmlPassword.value = '';
    }

}

htmlButton.addEventListener('click', loginHander);
htmlRegisterButton.addEventListener('click', () => window.location.pathname = '/signup');

htmlUsername.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        if(htmlPassword.value === '') htmlPassword.focus();
        else if(htmlUsername.value !== '') loginHander();
    }
});
htmlPassword.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        if(htmlUsername.value === '') htmlUsername.focus();
        else if(htmlPassword.value !== '') loginHander();
    }
});
