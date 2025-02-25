/**
 * Main JavaScript for Nate Fineman's Rowing Mentor Website
 * Created: February 2025
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileNav();
  initSmoothScrolling();
  initCarousel();
  initBackToTop();
  initScrollAnimation();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const menuToggle = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  }
}

/**
 * Smooth Scrolling for Navigation Links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const targetID = href.substring(1);
        const targetElement = document.getElementById(targetID);
        
        if (targetElement) {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without page jump
          window.history.pushState(null, null, href);
        }
        
        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        const menuToggle = document.getElementById('mobile-menu');
        
        if (navMenu && menuToggle && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', false);
        }
      }
    });
  });
}

/**
 * Testimonials Carousel
 */
function initCarousel() {
  const carousel = document.getElementById('carousel');
  
  if (carousel) {
    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    
    if (!carouselInner || carouselItems.length === 0) return;
    
    let currentIndex = 0;
    const totalItems = carouselItems.length;
    let autoAdvanceInterval;
    
    // Function to show specific item
    function showItem(index) {
      if (index < 0) index = totalItems - 1;
      if (index >= totalItems) index = 0;
      
      currentIndex = index;
      carouselInner.style.transform = `translateX(-${index * 100}%)`;
      
      // Update ARIA attributes for accessibility
      carouselItems.forEach((item, i) => {
        item.setAttribute('aria-hidden', i !== currentIndex);
        item.setAttribute('tabindex', i === currentIndex ? '0' : '-1');
      });
    }
    
    // Auto advance carousel
    function autoAdvance() {
      showItem((currentIndex + 1) % totalItems);
    }
    
    // Initialize
    carouselItems.forEach((item, i) => {
      item.setAttribute('aria-hidden', i !== 0);
      item.setAttribute('tabindex', i === 0 ? '0' : '-1');
      item.setAttribute('role', 'tabpanel');
      item.id = `carousel-item-${i}`;
    });
    
    // Add event listeners for controls
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        showItem((currentIndex - 1 + totalItems) % totalItems);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        showItem((currentIndex + 1) % totalItems);
      });
    }
    
    // Set up auto advance
    autoAdvanceInterval = setInterval(autoAdvance, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoAdvanceInterval));
    carousel.addEventListener('mouseleave', () => {
      autoAdvanceInterval = setInterval(autoAdvance, 5000);
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        showItem((currentIndex - 1 + totalItems) % totalItems);
      } else if (e.key === 'ArrowRight') {
        showItem((currentIndex + 1) % totalItems);
      }
    });
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // Swipe left
        showItem((currentIndex + 1) % totalItems);
      } else if (touchEndX > touchStartX + 50) {
        // Swipe right
        showItem((currentIndex - 1 + totalItems) % totalItems);
      }
    }
  }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  
  if (backToTop) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.style.display = 'flex';
      } else {
        backToTop.style.display = 'none';
      }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', () => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    });
  }
}

/**
 * Scroll Animation
 */
function initScrollAnimation() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('in-view');
    });
  }
}

/**
 * Form Validation
 * @param {HTMLFormElement} form - The form element to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
    
    // Email validation
    if (input.type === 'email' && input.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(input.value)) {
        input.classList.add('error');
        isValid = false;
      }
    }
  });
  
  return isValid;
}
