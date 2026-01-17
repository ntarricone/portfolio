/* ========================================
   SCROLL-TRIGGERED ANIMATIONS
   Using Intersection Observer API
   ======================================== */

(function() {
  'use strict';

  // Configuration
  const config = {
    threshold: 0.15,      // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'  // Trigger slightly before element enters viewport
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

  const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
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
    });
  } else {
    initScrollAnimations();
    initSectionNav();
  }
})();
