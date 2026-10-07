'use client'

import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import styles from './portfolio.module.css'
import { Orb } from './Orb'
import { ChatAnswer } from './ChatAnswer'
import { SendIcon, UndoIcon } from './icons'
import { suggestedQuestions } from '@/content/chat'
import { useChat } from '@/hooks/useChat'

type ChatWidgetProps = {
  motionEnabled: boolean
}

export function ChatWidget({ motionEnabled }: ChatWidgetProps) {
  const { msgs, status, busy, draft, setDraft, ask, send, reset } = useChat(motionEnabled)
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs])

  const hasMsgs = msgs.length > 0
  const statusText = status === 'thinking' ? 'Réfléchit…' : status === 'speaking' ? 'Répond…' : 'En ligne'

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <figure
      className={`${styles.rise} ${styles.chatfig}`}
      style={{
        margin: 0,
        position: 'relative',
        height: 'clamp(600px, 48vw, 680px)',
        borderRadius: 32,
        background: 'linear-gradient(180deg, #ffffff, #F5F8FE)',
        border: '1px solid var(--line)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animationDelay: '.5s',
      }}
    >
      {hasMsgs ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px 14px 20px',
              borderBottom: '1px solid var(--line)',
              background: 'rgba(255,255,255,.75)',
            }}
          >
            <Orb size="sm" status={status} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
              <span className={styles.disp} style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>
                Clément · assistant IA
              </span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{statusText}</span>
            </div>
            <button type="button" className={styles.ib} onClick={reset} aria-label="Nouvelle conversation">
              <UndoIcon />
            </button>
          </div>
          <div
            ref={threadRef}
            aria-live="polite"
            style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {msgs.map((m, i) => {
              const bot = m.role === 'bot'
              const showCaret = bot && m.shown < m.text.length
              return (
                <div key={i} className={`${styles.msg} ${bot ? styles.msgBot : styles.msgUsr}`}>
                  {bot ? <ChatAnswer text={m.text} shown={m.shown} /> : m.text.slice(0, m.shown)}
                  <span className={showCaret ? styles.caret : styles.caretDone} />
                </div>
              )
            })}
            {status === 'thinking' && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <span className={styles.typing} aria-label="Réflexion en cours">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div className={styles.orbFloat}>
            <Orb size="lg" status={status} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 380 }}>
            <p
              className={styles.disp}
              style={{ margin: 0, fontSize: 'clamp(24px, 2.2vw, 30px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em' }}
            >
              Posez-moi une question
            </p>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--muted)' }}>
              Je réponds à partir de mon parcours, de mes projets et de ma stack.
            </p>
          </div>
        </div>
      )}
      <div style={{ borderTop: '1px solid var(--line)', background: '#fff', padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className={styles.qrow} role="group" aria-label="Questions suggérées" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {suggestedQuestions.map((q) => (
            <button key={q.question} type="button" className={styles.qb} disabled={busy} onClick={() => ask(q.question)}>
              {q.question}
            </button>
          ))}
        </div>
        <div className={styles.inbox}>
          <label className={styles.sro} htmlFor="ask-input">
            Votre question
          </label>
          <input
            id="ask-input"
            type="text"
            placeholder="Écrivez votre question…"
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="button" className={styles.send} onClick={send} disabled={busy} aria-label="Envoyer la question">
            <SendIcon />
          </button>
        </div>
      </div>
    </figure>
  )
}
