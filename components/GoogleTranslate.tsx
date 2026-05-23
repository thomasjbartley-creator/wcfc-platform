'use client'

import { useEffect } from 'react'
import Script from 'next/script'

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
  useEffect(() => {
    // Define the callback that Google Translate calls after loading
    window.googleTranslateElementInit = () => {
      if (
        typeof window.google !== 'undefined' &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            // Priority order: pt first, es second, then the rest
            includedLanguages: 'pt,es,en,fr,de,ar,ja,ko,nl,it,zh-CN,tr,ru',
            layout: 0, // SIMPLE layout (dropdown only, no banner)
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }

    // If the script already loaded (e.g. navigating between pages),
    // re-init the widget
    if (
      typeof window.google !== 'undefined' &&
      window.google.translate &&
      window.google.translate.TranslateElement
    ) {
      // Clear previous widget instance if any
      const el = document.getElementById('google_translate_element')
      if (el) el.innerHTML = ''
      window.googleTranslateElementInit()
    }
  }, [])

  return (
    <>
      <div
        id="google_translate_element"
        suppressHydrationWarning
        style={{ display: 'inline-block' }}
      />

      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* Style overrides to match the WCFC dark nav with green/gold accents */}
      <style jsx global>{`
        /* Hide the Google Translate top-bar iframe that shifts the page */
        .skiptranslate {
          display: none !important;
        }
        body {
          top: 0px !important;
        }

        /* But show our widget container */
        #google_translate_element .skiptranslate {
          display: inline-block !important;
        }

        /* Style the dropdown select */
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

        .goog-te-combo:hover {
          border-color: rgba(0, 200, 83, 0.5);
          color: #00C853;
        }

        .goog-te-combo option {
          background: #0a1410;
          color: #d0ead8;
          font-family: 'Barlow Condensed', sans-serif;
          padding: 6px;
        }

        /* Hide the "Powered by" Google Translate branding */
        .goog-te-gadget > span {
          display: none !important;
        }
        .goog-te-gadget {
          font-size: 0 !important;
          color: transparent !important;
        }

        /* Hide the Google Translate attribution link */
        #google_translate_element a {
          display: none !important;
        }

        /* Fix Google's injected banner iframe from pushing down content */
        iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>
    </>
  )
}
