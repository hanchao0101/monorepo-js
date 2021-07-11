const fs = require('fs')
const execa = require('execa')

const base = `libs/${process.env.NODE_ENV}/packages`
const targets = fs.readdirSync(base).filter(f => {
    if (!fs.statSync(`${base}/${f}`).isDirectory()) {
        return false
    }
    return true
})

function runParallel(targets, interatorFn) {
    const res = []
    for (const item of targets) {
        const promise = interatorFn(item)
        res.push(promise)
    }
    return Promise.all(res)
}

async function build(target) {
    target = `${base}/${target}`
    await execa('rollup', ['-cW', '--environment', `TARGET:${target}`], {
        stdio: 'inherit'//子进程打包的信息共享给父进程
    })

}

runParallel(targets, build).then(() => {
    console.log('打包成功！')
})