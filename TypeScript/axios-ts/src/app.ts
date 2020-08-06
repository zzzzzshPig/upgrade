import axios from './index'

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        a: 1,
        c: 2
    }
})

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        foo: ['bar', 'baz']
    }
})

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        foo: {
            bar: 'baz'
        }
    }
})

const date = new Date()

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        date
    }
})

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        foo: '@:$, '
    }
})

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer',
    params: {
        foo: 'bar',
        baz: null
    }
})

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer#hash',
    params: {
        foo: 'bar'
    }
})

axios({
    method: 'get',
    url: 'http://localhost:3000/getCustomer?foo=bar',
    params: {
        bar: 'baz'
    }
})
