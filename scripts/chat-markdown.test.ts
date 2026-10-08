import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkChatAnswer } from '../src/lib/chat/markdown'
import { fallbackAnswer } from '../src/content/chat'
import { ABSTENTION } from '../src/lib/rag/core'
import { heroCtas } from '../src/content/profile'

function render(text: string, shown = text.length) {
  return renderToStaticMarkup(createElement(Markdown, {
    skipHtml: true, remarkPlugins: [remarkGfm, [remarkChatAnswer, { shown }]],
  }, text))
}
test('renders bold and paragraphs while hiding source references', () => {
  const html = render('Clément a réalisé **Personal RAG**. [3]\n\nProjet **MMA Scan**. [1]')
  assert.match(html, /<strong>Personal RAG<\/strong>/)
  assert.match(html, /<strong>MMA Scan<\/strong>/)
  assert.ok(!html.includes('[3]') && !html.includes('[1]'))
  assert.ok(!html.includes('**'))
})
test('typing preserves Markdown formatting before the full answer is revealed', () => {
  assert.equal(render('**Personal RAG** est un projet. [1]', 4), '<p><strong>Pers</strong></p>')
  assert.equal(render('**Personal RAG** [1]', 0), '')
})
test('preserves code brackets and real links; supports lists and tables', () => {
  const html = render('`items[1]` et [1](https://example.com). [2]\n\n- **Go**\n- Python\n\n| Stack | Type |\n| --- | --- |\n| Go | Backend |')
  assert.match(html, /<code>items\[1\]<\/code>/)
  assert.match(html, /href="https:\/\/example.com">1<\/a>/)
  assert.match(html, /<ul>/)
  assert.match(html, /<table>/)
  assert.ok(!html.includes('[2]'))
})
test('does not render raw HTML, unsafe link protocols or source footnotes', () => {
  const html = render('<script>alert(1)</script>\n\n[lien](javascript:alert)\n\nTexte[^1].\n\n[^1]: source privée')
  assert.ok(!html.includes('<script>') && !html.includes('javascript:'))
  assert.ok(!html.includes('source privée') && !html.includes('footnote'))
})

test('error and abstention links target the same footer as the contact button', () => {
  for (const message of [fallbackAnswer, ABSTENTION]) {
    const html = render(message)
    assert.ok(html.includes(`href="${heroCtas.contact.href}">Tu peux contacter Clément</a>`))
  }
})
