;(function () {
  'use strict'

  /* ——— Scroll reveals ——— */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

  /* ——— Mobile nav ——— */
  const toggle = document.querySelector('.nav-toggle')
  const links = document.querySelector('.nav-links')
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = !links.classList.contains('open')
      links.classList.toggle('open', open)
      toggle.classList.toggle('open', open)
      toggle.setAttribute('aria-expanded', open)
    })
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false')
      }
    })
  }

  /* ——— Sidebar collapse (desktop) / overlay (mobile) ——— */
  const sidebarToggle = document.querySelector('.sidebar-toggle')
  const sidebar = document.querySelector('.sidebar')
  const scrim = document.querySelector('.sidebar-scrim')
  const mqMobile = window.matchMedia('(max-width: 980px)')

  function closeSidebar () {
    if (sidebar) sidebar.classList.remove('open')
    if (sidebarToggle) sidebarToggle.classList.remove('open')
    if (scrim) scrim.classList.remove('show')
    document.body.style.overflow = ''
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      if (mqMobile.matches) {
        const open = !sidebar.classList.contains('open')
        sidebar.classList.toggle('open', open)
        sidebarToggle.classList.toggle('open', open)
        sidebarToggle.setAttribute('aria-expanded', open)
        if (scrim) scrim.classList.toggle('show', open)
        document.body.style.overflow = open ? 'hidden' : ''
      } else {
        document.body.classList.toggle('sidebar-collapsed')
        localStorage.setItem('panelpro-sidebar', document.body.classList.contains('sidebar-collapsed') ? '1' : '0')
      }
    })
    if (scrim) scrim.addEventListener('click', closeSidebar)
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar() })
    mqMobile.addEventListener('change', (e) => { if (!e.matches) closeSidebar() })
  }

  /* ——— Active nav ——— */
  const page = location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === page)
  })

  /* ——— Footer year ——— */
  const yearEl = document.querySelector('[data-year]')
  if (yearEl) yearEl.textContent = new Date().getFullYear()

  /* ——— Back to top ——— */
  const btt = document.querySelector('.back-to-top')
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400), { passive: true })
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  /* ——— Smooth scroll ——— */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')
      if (id === '#') return
      const t = document.querySelector(id)
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }) }
    })
  })

  /* ——— Hero crossfade ——— */
  const heroImgs = document.querySelectorAll('.hero-bg img')
  if (heroImgs.length > 1) {
    let i = 0
    setInterval(() => {
      heroImgs[i].classList.remove('active')
      i = (i + 1) % heroImgs.length
      heroImgs[i].classList.add('active')
    }, 6000)
  }

  /* ——— Form validation ——— */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    const ok = form.querySelector('.form-ok')
    const err = form.querySelector('.form-err')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      let valid = true
      form.querySelectorAll('[required]').forEach((el) => { if (!el.value.trim()) valid = false })
      if (ok) ok.classList.remove('show')
      if (err) err.classList.remove('show')
      if (valid) {
        if (ok) ok.classList.add('show')
        form.reset()
      } else {
        if (err) err.classList.add('show')
      }
    })
  })

  /* ——— Count-up animation (KPI values) ——— */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const counters = document.querySelectorAll('[data-count]')

  function formatNumber (el, value) {
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10)
    const prefix = el.getAttribute('data-prefix') || ''
    const suffix = el.getAttribute('data-suffix') || ''
    el.textContent = prefix + value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  }

  function runCounter (el) {
    const target = parseFloat(el.getAttribute('data-count'))
    if (reducedMotion) { formatNumber(el, target); return }
    const duration = 1200
    const start = performance.now()
    function tick (now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      formatNumber(el, target * eased)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { runCounter(e.target); counterObserver.unobserve(e.target) }
        })
      },
      { threshold: 0.4 }
    )
    counters.forEach((el) => counterObserver.observe(el))
  } else {
    counters.forEach((el) => { formatNumber(el, parseFloat(el.getAttribute('data-count'))) })
  }

  /* ——— prefers-reduced-motion ——— */
  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
  }
})()