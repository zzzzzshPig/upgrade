import axios from '@/index'
import config from '@/examples/config'

export default function start () {
    interface User {
        name: string
        age: number
    }

    function getUser<T> () {
        return axios<User>(`${config.baseUrl}/extend/user`)
            .then(res => res.data)
    }

    async function test () {
        const user = await getUser<User>()
        if (user) {
            console.log(user.name)
        }
    }

    test()
}
