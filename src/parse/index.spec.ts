import test from 'ava'
import parse from './index'

// const contentPath = path.resolve(__dirname, '../../test/public/default.Caddyfile')
// const content = fs.readFileSync(contentPath, 'utf-8')

test('typeof Object', (t) => {
    const content = `
    # This is one default test file

    localhost # global
    {
        email you@yours.com
        acme_ca https://caddyserver.com/docs/caddyfile
    }
    (aSnippet) {
        # this is a reusable snippet
    }
    example.com {
        @post {
            method POST
        }
        reverse_proxy @post localhost:9001 localhost:9002 {
            lb_policy first
        }
        file_server /static
        import aSnippet
    }
    www.example.com {
        redir https://example.com{uri}
        import aSnippet
    }
    `
    t.is(typeof parse(content), 'object')
})

test('Empty #0', (t) => {
    const content = ''
    t.is(parse(content).length, 0)
})

test('Empty #1', (t) => {
    const content = `
    `
    t.is(parse(content).length, 0)
})
