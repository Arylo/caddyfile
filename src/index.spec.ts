import test from 'ava'

const functionMacro = test.macro((t, funName: string) => {
    const m = require('./index')

    t.true(typeof m[funName] === 'function')
    t.true(typeof m.default[funName] === 'function')
    t.is(m[funName], m.default[funName])
})

test('export parse', functionMacro, 'parse')
