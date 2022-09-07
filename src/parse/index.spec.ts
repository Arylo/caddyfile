import test from 'ava'
import { getTestCaddyfile } from '../../test/utils'
import parse from './index'

test('typeof Object', (t) => {
    const content = getTestCaddyfile('default.Caddyfile')
    t.is(typeof parse(content), 'object')
})

test('Empty #0', (t) => {
    const content = getTestCaddyfile('empty1.Caddyfile')
    t.is(parse(content).length, 0)
})

test('Empty #1', (t) => {
    const content = getTestCaddyfile('empty2.Caddyfile')
    t.is(parse(content).length, 0)
})
