'use client'

import { memo } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { remarkChatAnswer } from '@/lib/chat/markdown'
import styles from './portfolio.module.css'

export const ChatAnswer = memo(function ChatAnswer({ text, shown }: { text: string; shown: number }) {
  return (
    <div className={styles.chatMarkdown}>
      <Markdown skipHtml remarkPlugins={[remarkGfm, [remarkChatAnswer, { shown }]]}>
        {text}
      </Markdown>
    </div>
  )
})
