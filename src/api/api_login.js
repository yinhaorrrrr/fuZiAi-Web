import {httpClient,setToken} from '@utils/request/request.js'

export function Login(data){   
    return httpClient.post(`/user/login`,data)
        .then(response=>{
            setToken(response.data.data.token);
            return response;
        })
}

export function Register(data){
    return httpClient.post(`/user/register`,data)
        .then(response=>{
            setToken(response.data.token);
            return response;
        })
}

export  function emailCode(data){
    return httpClient.post(`/user/emailCode`,data)
        .then(response=>{
            return response;
        })
}

export function logout(){

}

