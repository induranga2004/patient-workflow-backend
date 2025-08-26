export function setAuth(token,user){
    localStorage.setItem('token',token)
    localStorage.setItem('user',JSON.stringify(user))

}

export function getUser(){
    try{

        return JSON.parse(localStorage.getItem('user')|| 'null')
    }
    catch{
        return null
    }
}

export function logout(){
    try{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }catch{
        // no-op
    }
}