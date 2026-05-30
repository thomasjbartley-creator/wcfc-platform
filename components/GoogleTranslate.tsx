'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState, useCallback } from 'react'

declare global {
  interface Window {
    googleTranslateElementInit: () => void
    google: {
      translate: {
        TranslateElement: new (
          config: {
            pageLanguage: string
            includedLanguages: string
            layout: number
            autoDisplay: boolean
          },
          elementId: string
        ) => void
      }
    }
  }
}

export default function GoogleTranslate() {
  const [mounted, setMounted] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [initialized, setInitialized] = useState(false)

  const initWidget = useCallback(() => {
    if (window.google?.translate?.TranslateElement) {
      const el = document.getElementById('google_translate_element')
      if (el && !el.hasChildNodes()) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'pt,es,en,fr,de,ar,ja,ko,nl,it,zh-CN,tr,ru',
              layout: 0,
              autoDisplay: false,
            },
            'google_translate_element'
          )
          setInitialized(true)
        } catch (err) {
          console.warn('GoogleTranslate init failed:', err)
        }
      }
    }
  }, [])

  useEffect(() => {
    setMounted(true)

    // Define the global callback for the GT script's initial load
    window.googleTranslateElementInit = () => {
      initWidget()
    }

    // Watch for the translate-widget-slot appearing/reappearing in the DOM
    // (Nav remounts on each page navigation, creating a new slot div)
    const observer = new MutationObserver(() => {
      const slot = document.getElementById('translate-widget-slot')
      if (slot && slot !== target) {
        setTarget(slot)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Initial find
    const slot = document.getElementById('translate-widget-slot')
    if (slot) setTarget(slot)

    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // When target changes (new Nav mounted), re-init widget after portal renders
  useEffect(() => {
    if (target && mounted) {
      // Wait a tick for the portal to render the container div into the new slot
      requestAnimationFrame(() => {
        initWidget()
      })
    }
  }, [target, mounted, initWidget])

  if (!mounted || !target) return null

  return createPortal(
    <>
      <div id="google_translate_element" suppressHydrationWarning style={{ display: 'inline-block' }} />

      <style>{`
        .skiptranslate { display: none !important; }
        body { top: 0px !important; }
        #google_translate_element .skiptranslate { display: inline-block !important; }
        #google_translate_element select,
        .goog-te-combo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.06);
          color: #8ab898;
          border: 1px solid rgba(0, 200, 83, 0.25);
          border-radius: 5px;
          padding: 6px 10px;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2300C853'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          padding-right: 24px;
        }
        .goog-te-combo:hover { border-color: rgba(0, 200, 83, 0.5); color: #00C853; }
        .goog-te-combo option { background: #0a1410; color: #d0ead8; font-family: 'Barlow Condensed', sans-serif; padding: 6px; }
        .goog-te-gadget > span { display: none !important; }
        .goog-te-gadget { font-size: 0 !important; color: transparent !important; }
        #google_translate_element a { display: none !important; }
        iframe.skiptranslate { display: none !important; visibility: hidden !important; }
      `}</style>
    </>,
    target
  )
}
