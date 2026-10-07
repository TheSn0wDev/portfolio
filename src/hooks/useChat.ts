'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fallbackAnswer } from '@/content/chat'
import { ChatRequestError, requestChatReply, type ChatHistoryMessage, type ChatReply } from '@/lib/chat/client'

export type ChatMessage = {
  role: 'user' | 'bot'
  text: string
  shown: number
  sources?: ChatReply['sources']
}

export type ChatStatus = 'idle' | 'thinking' | 'speaking'

export function useChat(motionEnabled: boolean) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [draft, setDraft] = useState('')
  const busyRef = useRef(false)
  const motionRef = useRef(motionEnabled)
  const requestIdRef = useRef(0)
  const requestRef = useRef<AbortController | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const historyRef = useRef<ChatHistoryMessage[]>([])

  useEffect(() => { motionRef.current = motionEnabled }, [motionEnabled])
  useEffect(() => () => {
    requestIdRef.current += 1
    requestRef.current?.abort()
    if (typingTimerRef.current) clearInterval(typingTimerRef.current)
  }, [])

  const reveal = useCallback((reply: ChatReply, id: number) => {
    if (requestIdRef.current !== id) return
    const animate = motionRef.current
    setMsgs(previous => [...previous, { role: 'bot', text: reply.answer, shown: animate ? 0 : reply.answer.length, sources: reply.sources }])
    setStatus(animate ? 'speaking' : 'idle')
    if (!animate) { busyRef.current = false; return }
    let shown = 0
    typingTimerRef.current = setInterval(() => {
      if (requestIdRef.current !== id) return
      shown = Math.min(reply.answer.length, shown + 3)
      const visible = shown
      setMsgs(previous => {
        const last = previous[previous.length - 1]
        return last?.role === 'bot' ? previous.slice(0, -1).concat({ ...last, shown: visible }) : previous
      })
      if (shown >= reply.answer.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current)
        typingTimerRef.current = null
        busyRef.current = false
        setStatus('idle')
      }
    }, 20)
  }, [])

  const ask = useCallback((rawQuestion: string) => {
    const question = rawQuestion.trim()
    if (!question || busyRef.current) return
    busyRef.current = true
    const id = ++requestIdRef.current
    const controller = new AbortController()
    requestRef.current = controller
    setMsgs(previous => [...previous, { role: 'user', text: question, shown: question.length }])
    setStatus('thinking')

    // Use the JSON contract to preserve the widget's existing typing animation.
    // Suggested questions follow the exact same backend path as typed messages.
    void requestChatReply(question, historyRef.current, AbortSignal.any([controller.signal, AbortSignal.timeout(65_000)]))
      .then(reply => {
        if (requestIdRef.current !== id) return
        historyRef.current = [...historyRef.current,
          { role: 'user' as const, content: question },
          { role: 'assistant' as const, content: reply.answer },
        ].slice(-4)
        reveal(reply, id)
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== id || controller.signal.aborted) return
        // Failed requests are displayed using the same message bubble, but never
        // become factual conversation history for subsequent RAG questions.
        reveal({ answer: error instanceof ChatRequestError ? error.message : fallbackAnswer, sources: [] }, id)
      })
      .finally(() => { if (requestIdRef.current === id) requestRef.current = null })
  }, [reveal])

  const send = useCallback(() => {
    const question = draft.trim()
    if (!question || busyRef.current) return
    setDraft('')
    ask(question)
  }, [draft, ask])

  const reset = useCallback(() => {
    requestIdRef.current += 1
    requestRef.current?.abort()
    requestRef.current = null
    if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    typingTimerRef.current = null
    historyRef.current = []
    busyRef.current = false
    setMsgs([])
    setStatus('idle')
  }, [])

  return { msgs, status, busy: status !== 'idle', draft, setDraft, ask, send, reset }
}
