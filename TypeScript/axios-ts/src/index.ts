const a = 123

function sleep (ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

sleep(1000).then(() => console.log(a))
