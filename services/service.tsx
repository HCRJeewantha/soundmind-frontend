
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
}

export default Services;

