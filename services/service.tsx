
import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000';

class Services {
     static signIn(mobile: any, password: any):any {
        const payload = {
            "mobile": mobile,
            "password": password
        }
    
        axios.post(
            baseUrl + '/sign-in',
            payload
        ).then((response) => {
            return response
        }).catch((error) => {
            if (error.response) {
                return error
            }
        });
    };

    static signUp(mobile: any, password: any,userName:any, confirmPassword:any):any {
        const payload = {
            "name": userName,
            "mobile": mobile,
            "password": password,
            "confirm_password": confirmPassword
        }
        axios.post(
            baseUrl + '/sign-up',
            payload
        ).then((response) => {
            localStorage.setItem("id", response.data.id)
            localStorage.setItem("name", response.data.name)
        }).catch((error) => {
            if(error.response){
                return error
            }
        });
    };
}

export default Services;

