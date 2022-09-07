import test from 'ava'
import { getTestCaddyfile } from '../../test/utils'
import AstType from '../AstType'
import parse from './index'

test('#1', (t) => {
    const content = getTestCaddyfile('comment1.Caddyfile')
    const result = parse(content)
    t.is(result.length, 1)
    t.is(result[0].type, AstType.COMMENT)
    t.true(result[0].comment.length > 0)
})

test('#2', (t) => {
    const content = getTestCaddyfile('comment2.Caddyfile')
    const result = parse(content)
    t.is(result.length, 1)
    t.is(result[0].children.length, 1)
    t.is(result[0].children[0].type, AstType.COMMENT)
    t.true(result[0].children[0].comment.length > 0)
})

test('#3', (t) => {
    const content = getTestCaddyfile('comment3.Caddyfile')
    const result = parse(content)
    t.is(result.length, 1)
    t.is(result[0].children.length, 1)
    t.is(result[0].children[0].type, AstType.COMMENT)
    t.true(result[0].children[0].comment.length > 0)
})

test('#4', (t) => {
    const content = getTestCaddyfile('comment4.Caddyfile')
    const result = parse(content)
    t.is(result.length, 1)
    t.is(result[0].children.length, 1)
    t.not(result[0].children[0].type, AstType.COMMENT)
    t.true(result[0].children[0].comment.length > 0)
})