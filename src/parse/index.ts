import debug from 'debug'
import AstType from '../AstType'
import { IBlock, IAST } from '../type'

const log = debug('caddyfile')

const isEnd = (c: string) => c === '\n'

const parseToLines = (content: string) => {
    const filelines = []
    let str = ''
    for (const c of content) {
        if (isEnd(c)) {
            filelines.push(str)
            str = ''
        } else {
            str += c
        }
    }
    if (str.length) filelines.push(str)
    log.extend('lines')(JSON.stringify(filelines, null, 2))
    return filelines
}

const parseBlocksByLines = (lines: string[]) => {
    const blocks = []
    let level = -1
    let block: string[] = []
    for (const line of lines) {
        for (const c of line) {
            if (c === '{') {
                if (level < 0) level = 0
                level += 1
            } else if (c === '}') {
                level -= 1
            }
        }
        line && block.push(line)
        if ((block.length > 0 && level === -1) || level === 0) {
            blocks.push(block)
            block = []
        }
        if (level === 0) {
            level = -1
        }
    }
    log.extend('blocks')(JSON.stringify(blocks, null, 2))
    return blocks
}

const parseBlock = (block: string[]): IBlock => {
    if (!block[0].includes('{')) {
        const matches = /^(?<content>[^#]*?)#(?<comment>.*)$/.exec(block[0].trim())
        const content = (matches?.groups?.content ?? block[0]) as string
        const comment = matches?.groups?.comment.trim() ?? undefined
        return {
            content: content.trim(),
            comment,
            children: [],
        }
    }
    const firstIndex = block[0].indexOf('{')
    const lastIndex = block[block.length - 1].lastIndexOf('}')
    const [
        content,
        newFirst,
    ] = [
        block[0].substring(0, firstIndex),
        block[0].substring(firstIndex + 1),
    ]
    const newLast = block[block.length - 1].substring(0, lastIndex)
    block[0] = newFirst
    block[block.length - 1] = newLast
    block = block.map(b => b.trim()).filter(Boolean)
    return {
        content: content.trim(),
        children: parseBlocksByLines(block).map((b) => parseBlock(b)),
    }
}

const transformAstByBlocks = (blocks: IBlock[], index = 0): IAST[] => {
    const getType = (block: IBlock) => {
        const { content, children, comment } = block
        if (!content && comment && children.length === 0) {
            return AstType.COMMENT
        }
        if (index === 0) {
            if (content && /^\(.+\)$/.test(content)) {
                return AstType.SNIPPET
            }
            if (!content && children.length > 0) {
                return AstType.GLOBAL
            }
            if (content && children.length > 0) {
                return AstType.SITE
            }
            return AstType.ROOT
        } else if (index === 1) {
            if (/^@/.test(content)) {
                return AstType.MATCHER
            }
        }
        return AstType.DIRECTIVE
    }
    return blocks.map((block) => {
        const { content } = block
        const [command, ...args] = content.split(/\s+/)
        const type = getType(block)
        return {
            ...block,
            comment: block.comment || '',
            command: type === AstType.DIRECTIVE ? command : '',
            args: type === AstType.DIRECTIVE ? args : [],
            type,
            deep: index,
            children: transformAstByBlocks(block.children, index + 1),
        }
    })
}
const parseAstByBlock = (blocks: string[][]) => {
    const tree = blocks.map(b => parseBlock(b))
    log.extend('tree')(JSON.stringify(tree, null, 2))
    return transformAstByBlocks(tree)
}

export const parse = (content: string) => {
    const lines = parseToLines(content.trim())
    const blocks = parseBlocksByLines(lines)
    return parseAstByBlock(blocks)
}

export default parse
