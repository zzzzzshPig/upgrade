import axios from '@/index'

export default function start () {
    const instance = axios.create({
        baseURL: 'https://img.mukewang.com/'
    })

    instance.get('5cc01a7b0001a33718720632.jpg')

    instance.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')
}
