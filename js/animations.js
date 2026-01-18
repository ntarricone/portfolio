/* ========================================
   SCROLL-TRIGGERED ANIMATIONS
   Using Intersection Observer API
   ======================================== */

(function() {
  'use strict';

  // Configuration - adjusted for faster mobile loading
  const isMobile = window.innerWidth <= 768;
  const config = {
    threshold: isMobile ? 0.05 : 0.15,  // Lower threshold on mobile for faster trigger
    rootMargin: isMobile ? '0px 0px 150px 0px' : '0px 0px 50px 0px'  // Larger margin on mobile to trigger earlier
  };

  // ----------------------------------------
  // ACCESSIBILITY HELPERS
  // ----------------------------------------

  // Announce message to screen readers via live region
  function announceToScreenReader(message) {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = '';
      // Small delay to ensure the change is detected
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  }

  // Section name mapping for announcements
  const sectionNames = {
    'hero': 'Home',
    'about': 'About Me',
    'experience': 'Work Experience',
    'skills': 'Tech Stack',
    'projects': 'Featured Projects',
    'contact': 'Contact'
  };

  // Initialize scroll animations
  function initScrollAnimations() {
    // Select all elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
      '.anim-on-scroll, .anim-scale-on-scroll, .anim-stagger-children'
    );

    if (!animatedElements.length) return;

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      animatedElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optional: unobserve after animation (better performance)
          observer.unobserve(entry.target);
        }
      });
    }, config);

    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));
  }

  // ----------------------------------------
  // SECTION NAVIGATOR
  // ----------------------------------------

  const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
  let currentSectionIndex = 0;

  function initSectionNav() {
    const navUp = document.getElementById('navUp');
    const navDown = document.getElementById('navDown');

    if (!navUp || !navDown) return;

    // Get section elements (hero section doesn't have id, use class)
    const sectionElements = sections.map(id => {
      if (id === 'hero') {
        return document.querySelector('.hero');
      }
      return document.getElementById(id);
    }).filter(Boolean);

    // Update current section based on scroll position
    function updateCurrentSection() {
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPos) {
          currentSectionIndex = i;
          break;
        }
      }

      updateButtonStates();
    }

    // Update button disabled states
    function updateButtonStates() {
      navUp.disabled = currentSectionIndex === 0;
      navDown.disabled = currentSectionIndex === sectionElements.length - 1;
    }

    // Navigate to section
    function goToSection(index) {
      if (index < 0 || index >= sectionElements.length) return;

      const section = sectionElements[index];
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        currentSectionIndex = index;
        updateButtonStates();

        // Announce section change to screen readers
        const sectionId = sections[index];
        const sectionName = sectionNames[sectionId] || sectionId;
        announceToScreenReader(`Navigated to ${sectionName} section`);
      }
    }

    // Button click handlers
    navUp.addEventListener('click', () => {
      goToSection(currentSectionIndex - 1);
    });

    navDown.addEventListener('click', () => {
      goToSection(currentSectionIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only if not focused on an input
      if (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSection(currentSectionIndex - 1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goToSection(currentSectionIndex + 1);
      }
    });

    // Update on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateCurrentSection, 100);
    }, { passive: true });

    // Initial state
    updateCurrentSection();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollAnimations();
      initSectionNav();
      initMagnifyingGlass();
      initNavbarHighlighting();
    });
  } else {
    initScrollAnimations();
    initSectionNav();
    initMagnifyingGlass();
    initNavbarHighlighting();
  }
})();

// ========================================
// MAGNIFYING GLASS EFFECT
// ========================================

function initMagnifyingGlass() {
  const container = document.getElementById('magnifyContainer');
  if (!container) return;

  const clearText = container.querySelector('.magnify-clear');
  const lens = document.getElementById('magnifyLens');
  const lensRadius = 90;

  container.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    clearText.style.clipPath = `circle(${lensRadius}px at ${x}px ${y}px)`;
    lens.style.left = e.clientX + 'px';
    lens.style.top = e.clientY + 'px';
  });

  container.addEventListener('mouseleave', function() {
    clearText.style.clipPath = 'circle(0px at 0px 0px)';
  });
}

// ========================================
// NAVBAR SECTION HIGHLIGHTING
// ========================================

function initNavbarHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          // Remove aria-current from all links
          link.removeAttribute('aria-current');

          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            // Add aria-current for accessibility
            link.setAttribute('aria-current', 'true');
          }
        });
      }
    });
  }

  // Update on scroll
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Update on page load
  updateActiveNav();
}
