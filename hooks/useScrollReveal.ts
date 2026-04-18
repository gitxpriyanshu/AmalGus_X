'use client'
import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
          // Once it's revealed, we don't need to watch it anymore
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Initial scan
    const elements = document.querySelectorAll('.reveal')
    elements.forEach(el => observer.observe(el))

    // SMART RE-SCAN: Watch for new elements being added to the DOM (like products)
    const mutationObserver = new MutationObserver(() => {
      const currentElements = document.querySelectorAll('.reveal:not(.active)')
      currentElements.forEach(el => observer.observe(el))
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}
