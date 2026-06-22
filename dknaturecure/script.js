/**
 * DK Nature Cure Clinic - Interactive Script
 * Features: Scrolled navbar effects, Mobile navigation menu,
 * Interactive Tab-switching for Specializations, and Seamless WhatsApp-form integration.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. MOBILE MENU TOGGLE
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinksMenu = document.getElementById('nav-links-menu');
  const navLinks = document.querySelectorAll('.nav-item a');

  if (mobileMenuBtn && navLinksMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      navLinksMenu.classList.toggle('active');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        navLinksMenu.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     2. NAVBAR SCROLL EFFECT
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check in case page starts scrolled
    handleScroll();
  }

  /* ==========================================================================
     3. INTERACTIVE CLINICAL FOCUS TABS / MOBILE ACCORDION
     ========================================================================== */
  const conditionItems = document.querySelectorAll('.condition-item');
  const detailsContents = document.querySelectorAll('.details-content');
  const detailsBox = document.querySelector('.condition-details-box');

  const arrangeConditionsDOM = () => {
    const isMobile = window.innerWidth <= 768;
    
    conditionItems.forEach(item => {
      const targetId = item.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      
      if (targetContent) {
        if (isMobile) {
          // Move targetContent inside the condition-item for mobile accordion
          if (targetContent.parentNode !== item) {
            item.appendChild(targetContent);
          }
        } else {
          // Move targetContent back to the desktop details box in original tab order
          if (detailsBox && targetContent.parentNode !== detailsBox) {
            detailsBox.appendChild(targetContent);
          }
        }
      }
    });

    // Guard: Ensure at least one tab is active on desktop to prevent a blank details card
    if (!isMobile) {
      const activeItem = document.querySelector('.condition-item.active');
      if (!activeItem && conditionItems.length > 0) {
        const firstItem = conditionItems[0];
        firstItem.classList.add('active');
        firstItem.setAttribute('aria-selected', 'true');
        
        const firstTargetId = firstItem.getAttribute('data-target');
        const firstTargetContent = document.getElementById(firstTargetId);
        if (firstTargetContent) {
          firstTargetContent.classList.add('active');
        }
      }
    }
  };

  // Perform initial DOM arrangement
  arrangeConditionsDOM();

  // Handle dynamic resizing/orientation changes
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(arrangeConditionsDOM, 100);
  });

  conditionItems.forEach(item => {
    item.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      const isAlreadyActive = item.classList.contains('active');

      // Deactivate all items
      conditionItems.forEach(i => {
        i.classList.remove('active');
        i.setAttribute('aria-selected', 'false');
      });
      
      // Hide all content panels
      detailsContents.forEach(content => {
        content.classList.remove('active');
      });

      // If on mobile and clicked an already active item, collapse it
      if (isMobile && isAlreadyActive) {
        return;
      }

      // Activate selected item
      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');

      // Show corresponding content panel
      const targetId = item.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });

    // Add keyboard interaction (Enter / Space) for accessibility
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  /* ==========================================================================
     4. SEAMLESS WHATSAPP CONSULTATION FORM INTEGRATION
     ========================================================================== */
  const consultationForm = document.getElementById('consultation-form');
  
  if (consultationForm) {
    consultationForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent standard page reload
      
      // Extract form values
      const name = document.getElementById('booking-name').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const condition = document.getElementById('booking-condition').value;
      const userMessage = document.getElementById('booking-message').value.trim();
      
      // Formatting the WhatsApp Pre-filled message
      let messageText = `Hello Dr. Dhivya Varshini,\n\nI visited your website and would like to request a consultation. Here are my details:\n\n`;
      messageText += `*Name:* ${name}\n`;
      messageText += `*Mobile:* ${phone}\n`;
      
      if (condition !== 'Not Specified') {
        messageText += `*Clinical Specialization:* ${condition}\n`;
      }
      if (userMessage !== '') {
        messageText += `*Health Goals / Symptoms:* ${userMessage}\n`;
      }
      
      // Encode URL properly for web standards
      const encodedText = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/919445139655?text=${encodedText}`;
      
      // Provide immediate success styling on the button
      const submitBtn = document.getElementById('submit-booking-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `Connecting to WhatsApp... <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16" style="animation: spin 1.5s infinite linear;"><path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/><path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/></svg>`;
      submitBtn.style.background = '#25d366';
      submitBtn.style.borderColor = '#25d366';
      
      // Open WhatsApp after a very short organic delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener');
        
        // Reset the form and restore button
        consultationForm.reset();
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
      }, 1000);
    });
  }

});

// Add keyframe styling for submission loading spinner dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
