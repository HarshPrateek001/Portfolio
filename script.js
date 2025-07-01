// Theme Toggle Functionality
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle")
    this.sunIcon = document.getElementById("sun-icon")
    this.moonIcon = document.getElementById("moon-icon")
    this.particleAnimation = null // Will be set by ParticleAnimation
    this.init()
  }

  init() {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)

    this.setTheme(shouldBeDark)
    this.themeToggle.addEventListener("click", () => this.toggleTheme())
  }

  setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark")
      this.sunIcon.style.opacity = "0"
      this.moonIcon.style.opacity = "1"
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      this.sunIcon.style.opacity = "1"
      this.moonIcon.style.opacity = "0"
      localStorage.setItem("theme", "light")
    }
    
    // Update particle colors when theme changes
    this.updateParticleColors()
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark")
    this.setTheme(!isDark)
  }

  updateParticleColors() {
    if (this.particleAnimation) {
      this.particleAnimation.updateParticleColors()
    }
  }

  setParticleAnimation(particleAnimation) {
    this.particleAnimation = particleAnimation
  }
}

// Mobile Menu Functionality
class MobileMenu {
  constructor() {
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn")
    this.mobileMenu = document.getElementById("mobile-menu")
    this.mobileMenuClose = document.getElementById("mobile-menu-close")
    this.mobileMenuLinks = document.querySelectorAll(".mobile-menu-link")
    this.init()
  }

  init() {
    this.mobileMenuBtn.addEventListener("click", () => this.openMenu())
    this.mobileMenuClose.addEventListener("click", () => this.closeMenu())

    this.mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMenu())
    })
  }

  openMenu() {
    this.mobileMenu.classList.add("open")
  }

  closeMenu() {
    this.mobileMenu.classList.remove("open")
  }
}

// Performance monitoring and adaptive quality
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 60
    this.qualityLevel = 'high'
    this.performanceHistory = []
    this.maxHistoryLength = 10
    
    this.startMonitoring()
  }
  
  startMonitoring() {
    this.monitorFrame()
  }
  
  monitorFrame() {
    this.frameCount++
    const currentTime = performance.now()
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = currentTime
      
      this.performanceHistory.push(this.fps)
      if (this.performanceHistory.length > this.maxHistoryLength) {
        this.performanceHistory.shift()
      }
      
      this.adjustQuality()
    }
    
    requestAnimationFrame(() => this.monitorFrame())
  }
  
  adjustQuality() {
    const avgFps = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length
    
    if (avgFps < 30 && this.qualityLevel !== 'low') {
      this.qualityLevel = 'low'
      this.applyLowQualitySettings()
    } else if (avgFps < 45 && this.qualityLevel !== 'medium') {
      this.qualityLevel = 'medium'
      this.applyMediumQualitySettings()
    } else if (avgFps > 55 && this.qualityLevel !== 'high') {
      this.qualityLevel = 'high'
      this.applyHighQualitySettings()
    }
  }
  
  applyLowQualitySettings() {
    // Reduce particle count and effects
    if (window.particleAnimation) {
      window.particleAnimation.maxConnections = 30
      window.particleAnimation.maxEffects = 20
      window.particleAnimation.targetFPS = 30
    }
  }
  
  applyMediumQualitySettings() {
    if (window.particleAnimation) {
      window.particleAnimation.maxConnections = 60
      window.particleAnimation.maxEffects = 35
      window.particleAnimation.targetFPS = 45
    }
  }
  
  applyHighQualitySettings() {
    if (window.particleAnimation) {
      window.particleAnimation.maxConnections = 100
      window.particleAnimation.maxEffects = 50
      window.particleAnimation.targetFPS = 60
    }
  }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor()

// Skill Bar Animation System
class SkillBarAnimation {
  constructor() {
    this.skillItems = document.querySelectorAll('.skill-item')
    this.animatedSkills = new Set()
    this.init()
  }
  
  init() {
    this.setupIntersectionObserver()
    this.setupSkillBars()
  }
  
  setupSkillBars() {
    this.skillItems.forEach(skillItem => {
      const skillBar = skillItem.querySelector('.skill-bar')
      const percentageText = skillItem.querySelector('.text-sm')
      
      if (skillBar && percentageText) {
        const percentage = parseInt(percentageText.textContent.replace('%', ''))
        skillBar.style.setProperty('--skill-percentage', `${percentage}%`)
        
        // Add loading state initially
        skillItem.classList.add('loading')
      }
    })
  }
  
  setupIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSkills.has(entry.target)) {
          this.animateSkillBar(entry.target)
          this.animatedSkills.add(entry.target)
        }
      })
    }, options)
    
    this.skillItems.forEach(skillItem => {
      observer.observe(skillItem)
    })
  }
  
  animateSkillBar(skillItem) {
    const skillBar = skillItem.querySelector('.skill-bar')
    const percentageText = skillItem.querySelector('.text-sm')
    
    if (!skillBar || !percentageText) return
    
    // Remove loading state
    skillItem.classList.remove('loading')
    
    // Add animation class
    skillItem.classList.add('animate')
    
    // Animate the skill bar
    setTimeout(() => {
      skillBar.style.width = skillBar.style.getPropertyValue('--skill-percentage')
      
      // Add completion effect
      setTimeout(() => {
        skillItem.classList.add('completed')
        skillItem.classList.remove('animate')
        
        // Add success state for high percentages
        const percentage = parseInt(percentageText.textContent.replace('%', ''))
        if (percentage >= 90) {
          skillItem.classList.add('success')
        } else if (percentage >= 70) {
          skillItem.classList.add('warning')
        } else if (percentage < 50) {
          skillItem.classList.add('danger')
        }
      }, 2000)
    }, 100)
  }
  
  resetAnimations() {
    this.skillItems.forEach(skillItem => {
      const skillBar = skillItem.querySelector('.skill-bar')
      if (skillBar) {
        skillBar.style.width = '0%'
        skillItem.classList.remove('animate', 'completed', 'success', 'warning', 'danger')
        skillItem.classList.add('loading')
      }
    })
    this.animatedSkills.clear()
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(".fade-in")
    this.counters = document.querySelectorAll(".counter")
    this.skillBars = document.querySelectorAll(".skill-bar")
    this.init()
  }

  init() {
    this.observeElements()
    this.handleScroll()
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
          entry.target.classList.add("animate")

          // Animate counters if this is a counter element
          if (entry.target.classList.contains("counter")) {
              this.animateCounters(entry.target)
            }

          // Animate skill bars if this is a skill bar element
          if (entry.target.closest(".skill-item")) {
            this.animateSkillBars(entry.target.closest(".skill-item"))
          }
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    })

    this.elements.forEach((element) => observer.observe(element))
  }

  animateCounters(container) {
    const counter = container
    const target = parseInt(counter.getAttribute("data-target"))
      const duration = 2000
      const step = target / (duration / 16)

      let current = 0
      const updateCounter = () => {
        current += step
        if (current < target) {
          counter.textContent = Math.floor(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target
        }
      }
      updateCounter()
  }

  animateSkillBars(container) {
    const skillBar = container.querySelector(".skill-bar")
    if (skillBar) {
      const percentage = skillBar.style.getPropertyValue("--skill-percentage")
      skillBar.style.width = percentage
    }
  }

  handleScroll() {
    window.addEventListener("scroll", () => {
      // Additional scroll-based animations can be added here
    })
  }
}

// Contact Form
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.submitBtn = document.getElementById("submit-btn")
    this.submitText = document.getElementById("submit-text")
    this.submitIcon = document.getElementById("submit-icon")
    this.submitLoading = document.getElementById("submit-loading")
    this.formStatus = document.getElementById("form-status")
    this.init()
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
  }

  async handleSubmit(e) {
    e.preventDefault()
    
    this.setLoadingState(true)

    const formData = new FormData(this.form)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message")
    }

    try {
      await this.sendEmail(data)
      this.showStatus("success", "Message sent successfully! I'll get back to you soon.")
      this.form.reset()
    } catch (error) {
      console.error("Error sending email:", error)
      this.showStatus("error", "Failed to send message. Please try again.")
    } finally {
      this.setLoadingState(false)
    }
  }

  async sendEmail(data) {
    // Initialize EmailJS
    emailjs.init("4aMyp54RJUj0W88rW") // Replace with your EmailJS user ID

    const templateParams = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message
    }

    return emailjs.send("service_akxrrmq", "template_hpqgqky", templateParams)
  }

  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitText.textContent = "Sending..."
      this.submitIcon.classList.add("hidden")
      this.submitLoading.classList.remove("hidden")
      this.submitBtn.disabled = true
    } else {
      this.submitText.textContent = "Send Message"
      this.submitIcon.classList.remove("hidden")
      this.submitLoading.classList.add("hidden")
      this.submitBtn.disabled = false
    }
  }

  showStatus(type, message) {
    this.formStatus.className = `p-4 rounded-lg mb-6 ${
      type === "success"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`
    this.formStatus.textContent = message
    this.formStatus.classList.remove("hidden")

    setTimeout(() => {
      this.formStatus.classList.add("hidden")
    }, 5000)
  }
}

// Smooth Scroll
class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('a[href^="#"]')
    this.init()
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetElement = document.querySelector(targetId)
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })
        }
      })
    })
  }
}

// Remove ViewCounter class and UI logic
// Add this logic to track and log views:
(function() {
  const VIEW_KEY = 'portfolio_view_count';
  let count = parseInt(localStorage.getItem(VIEW_KEY) || '0', 10) + 1;
  localStorage.setItem(VIEW_KEY, count);
  console.log('Portfolio view count:', count);
})();

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skill bar animation
    const skillBarAnimation = new SkillBarAnimation()
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize theme toggle
    const themeToggle = document.getElementById('theme-toggle')
    const sunIcon = document.getElementById('sun-icon')
    const moonIcon = document.getElementById('moon-icon')
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', currentTheme === 'dark')
    updateThemeIcons(currentTheme === 'dark')
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
        updateThemeIcons(isDark)
    })
    
    function updateThemeIcons(isDark) {
        if (isDark) {
            sunIcon.style.opacity = '0'
            moonIcon.style.opacity = '1'
        } else {
            sunIcon.style.opacity = '1'
            moonIcon.style.opacity = '0'
        }
    }
    
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn')
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuClose = document.getElementById('mobile-menu-close')
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link')
    
    function toggleMobileMenu() {
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open')
        mobileMenu.style.display = 'none'
      } else {
        mobileMenu.classList.add('open')
        mobileMenu.style.display = 'flex'
      }
    }
    function closeMobileMenu() {
      mobileMenu.classList.remove('open')
      mobileMenu.style.display = 'none'
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu)
    mobileMenuClose.addEventListener('click', closeMobileMenu)
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu)
    })
    
    // Hide menu by default
    closeMobileMenu()
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        })
    })
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter')
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target
                const target = parseInt(counter.getAttribute('data-target'))
                const duration = 2000 // 2 seconds
                const increment = target / (duration / 16) // 60fps
                let current = 0
                
                const updateCounter = () => {
                    current += increment
                    if (current < target) {
                        counter.textContent = Math.floor(current)
                        requestAnimationFrame(updateCounter)
                    } else {
                        counter.textContent = target
                    }
                }
                
                updateCounter()
                counterObserver.unobserve(counter)
            }
        })
    }, { threshold: 0.5 })
    
    counters.forEach(counter => {
        counterObserver.observe(counter)
    })
    
    // Fade-in animation for sections
    const fadeElements = document.querySelectorAll('.fade-in')
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1'
                entry.target.style.transform = 'translateY(0)'
            }
        })
    }, { threshold: 0.1 })
    
    fadeElements.forEach(element => {
        element.style.opacity = '0'
        element.style.transform = 'translateY(20px)'
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
        fadeObserver.observe(element)
    })
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card')
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)'
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)'
        })
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)'
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
        })
    })
    
    // Contact form functionality
    const contactForm = document.getElementById('contact-form')
    const submitBtn = document.getElementById('submit-btn')
    const submitText = document.getElementById('submit-text')
    const submitIcon = document.getElementById('submit-icon')
    const submitLoading = document.getElementById('submit-loading')
    const formStatus = document.getElementById('form-status')
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            // Show loading state
            submitText.textContent = 'Sending...'
            submitIcon.classList.add('hidden')
            submitLoading.classList.remove('hidden')
            submitBtn.disabled = true
            
            // Simulate form submission (replace with actual email service)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000))
                
                // Show success message
                formStatus.innerHTML = `
                    <div class="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 rounded-lg">
                        <div class="flex items-center">
                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Message sent successfully! I'll get back to you soon.
                        </div>
                    </div>
                `
                formStatus.classList.remove('hidden')
                contactForm.reset()
                
            } catch (error) {
                // Show error message
                formStatus.innerHTML = `
                    <div class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
                        <div class="flex items-center">
                            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                            </svg>
                            Failed to send message. Please try again.
                        </div>
                    </div>
                `
                formStatus.classList.remove('hidden')
            } finally {
                // Reset button state
                submitText.textContent = 'Send Message'
                submitIcon.classList.remove('hidden')
                submitLoading.classList.add('hidden')
                submitBtn.disabled = false
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden')
                }, 5000)
            }
        })
    }
    
    // Update current year in footer
    const currentYearElement = document.getElementById('current-year')
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear()
    }
    
    // Scroll-based particle behavior
    let scrollTimeout
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout)
        
        scrollTimeout = setTimeout(() => {
            // Reset particle behavior after scrolling stops
            particleAnimation.connectionDistance = 150
        }, 150)
    })
    
    // Window resize handling
    let resizeTimeout
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout)
        
        resizeTimeout = setTimeout(() => {
            // Recreate particles for new window size
            particleAnimation.destroy()
            const newParticleAnimation = new ParticleAnimation()
            
            // Reset skill bar animations
            skillBarAnimation.resetAnimations()
        }, 250)
    })
    
    // Performance optimization: Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations to save resources
            if (particleAnimation.animationId) {
                cancelAnimationFrame(particleAnimation.animationId)
            }
        } else {
            // Resume animations
            particleAnimation.animate()
        }
    })
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMobileMenu()
        }
    })
    
    // Touch gesture support for mobile
    let touchStartY = 0
    let touchEndY = 0
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY
    })
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY
        handleSwipe()
    })
    
    function handleSwipe() {
        const swipeThreshold = 50
        const diff = touchStartY - touchEndY
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could trigger special effects
                particleAnimation.createClickEffect(window.innerWidth / 2, window.innerHeight / 2)
            } else {
                // Swipe down - could trigger different effects
                particleAnimation.updateForScroll(window.scrollY + 100)
            }
        }
    }
    
    // Accessibility improvements
    document.addEventListener('keydown', (e) => {
        // Skip to main content
        if (e.key === 'Tab' && e.target === document.body) {
            e.preventDefault()
            document.querySelector('main')?.focus()
        }
    })
    
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select')
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #3b82f6'
            element.style.outlineOffset = '2px'
        })
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none'
        })
    })
    
    console.log('Portfolio initialized successfully! 🚀')

    // --- Typewriter Animation Initialization ---
    if (typeof setupTypingAnimation === 'function') {
      setupTypingAnimation();
    } else if (window.setupTypingAnimation) {
      window.setupTypingAnimation();
    }

    // Typewriter animation for roles in hero section
    startTypewriterRoles();
})

// Reset modal state
function resetModalState() {
    const iframe = document.getElementById('resume-pdf-viewer')
    const fallback = document.getElementById('pdf-fallback')
    const loading = document.getElementById('pdf-loading')
    
    // Reset iframe
    if (iframe) {
        iframe.src = ''
        iframe.classList.remove('hidden')
    }
    
    // Hide fallback
    if (fallback) {
        fallback.classList.add('hidden')
    }
    
    // Show loading
    if (loading) {
        loading.style.display = 'flex'
    }
}

function openResumeModal() {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    const iframe = document.getElementById('resume-pdf-viewer')
    const loading = document.getElementById('pdf-loading')
    
    if (modal && modalContent) {
        // Reset modal state first
        resetModalState()
        
        // Ensure modal is visible
        modal.style.display = 'flex'
        modal.classList.remove('hidden')
        modal.classList.add('flex')
        
        // Trigger animation after a small delay
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)'
            modalContent.style.opacity = '1'
        }, 10)
        
        // Load PDF only when modal opens
        setTimeout(() => {
            if (iframe) {
                // Load PDF with parameters for better readability
                iframe.src = 'Resume__Harsh (1).pdf#toolbar=1&navpanes=1&scrollbar=1&view=FitH&zoom=100'
            }
        }, 300)
        
        // Check PDF viewer support
        setTimeout(() => {
            checkPDFViewerSupport()
        }, 1000)
        
        // Hide loading spinner after 5 seconds as fallback
        setTimeout(() => {
            hidePDFLoading()
        }, 5000)
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden'
    }
}

function closeResumeModal() {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    const iframe = document.getElementById('resume-pdf-viewer')
    const loading = document.getElementById('pdf-loading')
    
    if (modal && modalContent) {
        // Trigger close animation
        modalContent.style.transform = 'scale(0.95)'
        modalContent.style.opacity = '0'
        
        // Reset iframe to prevent PDF from loading
        if (iframe) {
            iframe.src = ''
        }
        
        // Reset loading spinner
        if (loading) {
            loading.style.display = 'flex'
        }
        
        // Hide modal after animation
        setTimeout(() => {
            modal.classList.add('hidden')
            modal.classList.remove('flex')
            modal.style.display = 'none'
        }, 300)
        
        // Restore body scroll
        document.body.style.overflow = 'auto'
    }
}

function downloadResume() {
    // Download the actual PDF file
    const a = document.createElement('a')
    a.href = 'Resume__Harsh (1).pdf'
    a.download = 'Harsh_Prateek_Resume.pdf'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // Show success message
    showDownloadSuccess()
}

function showDownloadSuccess() {
    // Create success notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
    notification.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Resume downloaded successfully!
        </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)'
    }, 100)
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(full)'
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300)
    }, 3000)
}

// Hide PDF loading spinner
function hidePDFLoading() {
    const loading = document.getElementById('pdf-loading')
    if (loading) {
        loading.style.display = 'none'
    }
}

// Show PDF loading spinner
function showPDFLoading() {
    const loading = document.getElementById('pdf-loading')
    if (loading) {
        loading.style.display = 'flex'
    }
}

// Check PDF viewer support and show fallback if needed
function checkPDFViewerSupport() {
    const iframe = document.getElementById('resume-pdf-viewer')
    const fallback = document.getElementById('pdf-fallback')
    
    if (iframe && fallback) {
        // Check if iframe loaded successfully
        iframe.onload = function() {
            // If iframe loads successfully, hide fallback and loading
            fallback.classList.add('hidden')
            hidePDFLoading()
        }
        
        iframe.onerror = function() {
            // If iframe fails to load, show fallback
            fallback.classList.remove('hidden')
            iframe.classList.add('hidden')
            hidePDFLoading()
        }
        
        // Additional check for PDF support after a delay
        setTimeout(() => {
            try {
                // Check if iframe has content
                if (iframe.contentWindow && iframe.contentWindow.document) {
                    const iframeDoc = iframe.contentWindow.document
                    if (iframeDoc.body && iframeDoc.body.innerHTML.includes('PDF')) {
                        // PDF viewer not supported
                        fallback.classList.remove('hidden')
                        iframe.classList.add('hidden')
                        hidePDFLoading()
                    }
                }
            } catch (e) {
                // Cross-origin or other error, assume PDF viewer works
                // PDF viewer check completed
            }
        }, 3000)
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    
    if (modal && e.target === modal) {
        closeResumeModal()
    }
})

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('resume-modal')
        if (modal && !modal.classList.contains('hidden')) {
            closeResumeModal()
        }
    }
})

// Ensure modal is hidden on page load
function ensureModalHidden() {
    const modal = document.getElementById('resume-modal')
    const modalContent = document.getElementById('resume-modal-content')
    const iframe = document.getElementById('resume-pdf-viewer')
    
    if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
        modal.style.display = 'none'
    }
    
    if (modalContent) {
        modalContent.style.transform = 'scale(0.95)'
        modalContent.style.opacity = '0'
    }
    
    if (iframe) {
        iframe.src = ''
    }
    
    // Restore body scroll
    document.body.style.overflow = 'auto'
}

// Call this when document is ready
document.addEventListener('DOMContentLoaded', function() {
    ensureModalHidden()
})

// Also call on window load
window.addEventListener('load', function() {
    ensureModalHidden()
})

// Typewriter animation for roles in hero section
function startTypewriterRoles() {
  const roles = [
    'Full Stack Developer',
    'Android Developer',
    'DevOps Engineer'
  ];
  const el = document.getElementById('typewriter-roles');
  let roleIndex = 0;
  let charIndex = 0;
  let typing = true;

  function type() {
    if (!el) return;
    const currentRole = roles[roleIndex];
    if (typing) {
      if (charIndex < currentRole.length) {
        el.textContent += currentRole.charAt(charIndex);
        charIndex++;
        setTimeout(type, 80);
      } else {
        typing = false;
        setTimeout(type, 1200); // Pause before erasing
      }
    } else {
      if (charIndex > 0) {
        el.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(type, 40);
      } else {
        typing = true;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
      }
    }
  }
  el.textContent = '';
  type();
}
