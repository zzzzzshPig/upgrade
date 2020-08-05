import axios from './index'

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        a: 1,
        c: 2
    }
})
