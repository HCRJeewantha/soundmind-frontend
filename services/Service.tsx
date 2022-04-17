import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/';


axios.get(baseUrl+ '/get-calm-songs').then((data) => {
    console.log(data)
}).catch((error) => {
    console.log(error)
})

