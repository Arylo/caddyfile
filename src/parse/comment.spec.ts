import test from 'ava'
import AstType from '../AstType'
import parse from './index'

test('#1', (t) => {
    const content = `
    # This is a test comment
    `
    const result = parse(content)
    t.is(result.length, 1)
    t.is(result[0].type, AstType.COMMENT)
})