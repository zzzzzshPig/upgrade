class User {
    constructor (info) {
        this.name = info.name
        this.age = info.age
        this.career = info.career
        this.work = info.work
    }
}

function UserFactory (name, age, career) {
    // 需要根据不同的职业 加一段描述
    const tags = {
        前端开发工程师: ['搬砖', '代码搬运工', 'CV工程师'],
        PHP开发工程师: ['年薪50万', '世界上最好的语言', '日本人用的最多的语言']
    }

    return new User({
        name,
        age,
        career,
        work: tags[career]
    })
}

const zsh = UserFactory('zzh', 22, '前端开发工程师')
const zsh1 = UserFactory('zzh1', 23, 'PHP开发工程师')

console.log(zsh, zsh1)
