import {diary,setToken} from '@utils/request/request.js'

export function Login(data){   
    return diary.post(`/user/login`,data)
        .then(response=>{
            setToken(response.data.token);
            return response;
        })
}

