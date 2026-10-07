type MarkdownNode = {
  type: string
  value?: string
  children?: MarkdownNode[]
}

// Transform the parsed Markdown rather than the raw string: citations inside
// code and numeric link labels remain intact, and typing never exposes ** markers.
export function remarkChatAnswer({ shown }: { shown: number }) {
  return (tree: unknown) => {
    let remaining = Math.max(0, shown)
    function visit(node: MarkdownNode): boolean {
      if (node.type === 'footnoteReference' || node.type === 'footnoteDefinition') return false
      if (node.type === 'definition') return true
      if (remaining <= 0 && node.type !== 'root') return false
      if (node.value !== undefined) {
        const value = node.type === 'text'
          ? node.value.replace(/[ \t]*\[\d+(?:\s*[,;–-]\s*\d+)*\]/g, '')
          : node.value
        node.value = value.slice(0, remaining)
        remaining -= node.value.length
        return node.value.length > 0
      }
      if (node.children) {
        node.children = node.children.filter(visit)
        return node.children.length > 0
      }
      return true
    }
    visit(tree as MarkdownNode)
  }
}
