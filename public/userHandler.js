
const checkLogin = async () => {
    if(!sessionStorage.getItem('username') || !sessionStorage.getItem('userId') || !sessionStorage.getItem('userToken')) {
        window.location.pathname = '/login';
    }
    const reqOptions = {
        method: 'POST',
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({token: sessionStorage.getItem('userToken')}),
        redirect: 'follow'
    };
    const res = await (await fetch('/api/users/check', reqOptions)).json();
    if(!res.success) window.location.pathname = '/login';
}
