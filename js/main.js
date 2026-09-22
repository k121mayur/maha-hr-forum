/**
 * MAHA HR FORUM — Main Script
 * Lightweight, accessible interactions, mobile drawer, sticky header & metric animation
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initSmoothScroll();
  initMetricCounter();
  initObjectivesCharter();
  initMembershipPage();
  initContactPage();
});

/**
 * Sticky Header Elevation on Scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer with Accessible Controls
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer__close');
  const drawerLinks = document.querySelectorAll('.mobile-drawer__link, .mobile-drawer__actions a');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', openDrawer);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking overlay backdrop
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Close drawer when clicking a link
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/**
 * Smooth Anchor Scrolling with Header Offset Compensation
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  const header = document.querySelector('.site-header');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight + 10 : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set focus to target for screen readers
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });
}

/**
 * Subtle Metric Number Counter Animation
 */
function initMetricCounter() {
  const metricNumbers = document.querySelectorAll('[data-counter]');
  if (!metricNumbers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          let count = 0;
          const duration = 1400;
          const stepTime = Math.abs(Math.floor(duration / (target || 50)));

          const timer = setInterval(() => {
            count += Math.ceil(target / 40);
            if (count >= target) {
              el.textContent = `${prefix}${target.toLocaleString('en-IN')}${suffix}`;
              clearInterval(timer);
            } else {
              el.textContent = `${prefix}${count.toLocaleString('en-IN')}${suffix}`;
            }
          }, stepTime);

          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  metricNumbers.forEach((el) => observer.observe(el));
}

/**
 * Objectives Charter Real-Time Search, Filtering & Copy Functionality
 */
function initObjectivesCharter() {
  const container = document.getElementById('moa-clauses-container');
  if (!container) return;

  const searchInput = document.getElementById('moa-search-input');
  const searchClear = document.getElementById('moa-search-clear');
  const filterBtns = document.querySelectorAll('.moa-filter-btn');
  const counterBadge = document.getElementById('moa-counter-badge');
  const emptyState = document.getElementById('moa-empty-state');
  const resetBtn = document.getElementById('moa-reset-btn');
  const cards = container.querySelectorAll('.clause-card');
  const triggerBtns = document.querySelectorAll('[data-trigger-filter]');
  const copyBtns = container.querySelectorAll('.clause-copy-btn');

  let currentCategory = 'all';
  let currentQuery = '';

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();
      const matchesCategory = currentCategory === 'all' || category === currentCategory;
      const matchesQuery = !currentQuery || text.includes(currentQuery);

      if (matchesCategory && matchesQuery) {
        card.style.display = '';
        visibleCount++;
        if (currentQuery) {
          card.classList.add('clause-card--highlight');
        } else {
          card.classList.remove('clause-card--highlight');
        }
      } else {
        card.style.display = 'none';
        card.classList.remove('clause-card--highlight');
      }
    });

    // Update Counter
    if (counterBadge) {
      counterBadge.textContent = `Showing ${visibleCount} of ${cards.length} Clauses`;
    }

    // Toggle Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.style.display = 'block';
        container.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        container.style.display = 'flex';
      }
    }
  };

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = currentQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  // Clear Search
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentQuery = '';
        searchClear.style.display = 'none';
        searchInput.focus();
        applyFilters();
      }
    });
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Domain Cards "View MoA Clauses" Links
  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-trigger-filter');
      const matchingFilterBtn = document.querySelector(`.moa-filter-btn[data-filter="${targetCategory}"]`);
      if (matchingFilterBtn) {
        filterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        matchingFilterBtn.classList.add('active');
        matchingFilterBtn.setAttribute('aria-selected', 'true');
        currentCategory = targetCategory;
        applyFilters();

        const targetEl = document.getElementById('moa-clauses');
        if (targetEl) {
          const header = document.querySelector('.site-header');
          const headerOffset = header ? header.offsetHeight + 10 : 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Reset Filters
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentQuery = '';
      }
      if (searchClear) {
        searchClear.style.display = 'none';
      }
      currentCategory = 'all';
      filterBtns.forEach((b) => {
        if (b.getAttribute('data-filter') === 'all') {
          b.classList.add('active');
          b.setAttribute('aria-selected', 'true');
        } else {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        }
      });
      applyFilters();
    });
  }

  // Copy Clause Citation
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.getAttribute('data-copy-target');
      const card = document.getElementById(targetId);
      if (!card) return;

      const titleEl = card.querySelector('.clause-title');
      const bodyEl = card.querySelector('.clause-body');
      const badgeEl = card.querySelector('.clause-badge');

      const citation = `MAHA HR FORUM — MoA ${badgeEl ? badgeEl.textContent : ''}: ${titleEl ? titleEl.textContent : ''}\n\n${bodyEl ? bodyEl.textContent.trim() : ''}\n\n(Section 8 Not-For-Profit Charter | www.mahahrforum.org)`;

      try {
        await navigator.clipboard.writeText(citation);
        const originalContent = btn.innerHTML;
        btn.classList.add('is-copied');
        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Copied!</span>`;
        setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.innerHTML = originalContent;
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });
}

/**
 * Membership Page Interactions: Tier Switching, Live Fee Calculation, Accordions, Verification & Toasts
 */
function initMembershipPage() {
  const applicationSection = document.getElementById('application');
  const accordion = document.getElementById('membership-accordion');
  if (!applicationSection && !accordion) return;

  // Plan Data Definition
  const plans = {
    student: {
      name: 'Student / Beneficiary Member',
      badge: 'Student / Beneficiary',
      fee: '₹100',
      numericFee: 100,
      btnText: 'Proceed to Secure Enrolment (₹100) &rarr;',
      orgLabel: 'College / University Name',
      orgPlaceholder: 'e.g. Pune University / Symbiosis / TISS / ILS',
      roleLabel: 'Course / Degree Specialization',
      rolePlaceholder: 'e.g. MSW / MBA (HR) / LLB / Final Year Apprentice',
      inclusions: [
        'Access to foundational HR, IR & Labour Law webinars',
        'Resume review clinics & career mentoring sessions',
        'Direct verified internship & apprenticeship opportunities',
        'Plain-language statutory guides to employee rights',
        'Maha HR Digital Student ID Card'
      ]
    },
    professional: {
      name: 'Professional Member',
      badge: 'Professional Member',
      fee: '₹1,000',
      numericFee: 1000,
      btnText: 'Proceed to Secure Enrolment (₹1,000) &rarr;',
      orgLabel: 'Organization / Company Name',
      orgPlaceholder: 'e.g. Tata Motors / Forbes Marshall / MIDC Enterprise',
      roleLabel: 'Designation / Current Role',
      rolePlaceholder: 'e.g. HR Manager / IR Officer / Compliance Head',
      inclusions: [
        'Statewide Professional Network Directory access',
        'Real-time statutory circulars & Maharashtra gazette digests',
        'CPD Masterclasses on 4 Labour Codes & Certifications',
        'Digital HR, People Analytics & AI training modules',
        'Peer IR & domestic inquiry support forum',
        'Maha HR Certified Professional ID & Credentials'
      ]
    },
    institutional: {
      name: 'Institutional Partner',
      badge: 'Institutional Partner',
      fee: '₹10,000',
      numericFee: 10000,
      btnText: 'Proceed to Secure Enrolment (₹10,000) &rarr;',
      orgLabel: 'Company / Enterprise / College Legal Name',
      orgPlaceholder: 'e.g. XYZ Manufacturing Pvt Ltd / College of Engineering',
      roleLabel: 'Authorized Delegate / HR Head Designation',
      rolePlaceholder: 'e.g. VP - Human Resources / Plant Head / Director',
      inclusions: [
        'In-house customized training on POSH, Safety or Compliance',
        'Direct campus placement & job fair employer booth access',
        'Statutory compliance health-check advisory for plants',
        '3 designated full-access delegate passes for HR team',
        'Brand visibility as institutional supporter on official portal',
        'Official framed institutional plaque & Section 8 receipt'
      ]
    }
  };

  // Switch Tier Function
  const switchTier = (tierKey) => {
    const plan = plans[tierKey];
    if (!plan) return;

    // Update Hidden Input
    const tierInput = document.getElementById('selected-tier-input');
    if (tierInput) tierInput.value = tierKey;

    // Update Tabs
    const tabs = document.querySelectorAll('.app-tab-btn');
    tabs.forEach((tab) => {
      const isCurrent = tab.getAttribute('data-tier') === tierKey;
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // Update Form Labels & Placeholders
    const labelOrg = document.getElementById('label-org');
    const inputOrg = document.getElementById('member-organization');
    if (labelOrg && inputOrg) {
      labelOrg.innerHTML = `${plan.orgLabel} <span class="required">*</span>`;
      inputOrg.placeholder = plan.orgPlaceholder;
    }

    const labelRole = document.getElementById('label-role');
    const inputRole = document.getElementById('member-designation');
    if (labelRole && inputRole) {
      labelRole.innerHTML = `${plan.roleLabel} <span class="required">*</span>`;
      inputRole.placeholder = plan.rolePlaceholder;
    }

    // Update Submit Button
    const submitBtn = document.getElementById('btn-submit-application');
    if (submitBtn) {
      submitBtn.innerHTML = `${plan.btnText}`;
    }

    // Update Summary Card
    const summaryBadge = document.getElementById('summary-tier-badge');
    if (summaryBadge) summaryBadge.textContent = plan.badge;

    const summaryPlanName = document.getElementById('summary-plan-name');
    if (summaryPlanName) summaryPlanName.textContent = plan.name;

    const summaryBaseFee = document.getElementById('summary-base-fee');
    if (summaryBaseFee) summaryBaseFee.textContent = plan.fee;

    const summaryTotalFee = document.getElementById('summary-total-fee');
    if (summaryTotalFee) summaryTotalFee.textContent = plan.fee;

    const inclusionsList = document.getElementById('summary-inclusions-list');
    if (inclusionsList) {
      inclusionsList.innerHTML = plan.inclusions
        .map(
          (inc) => `
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${inc}</span>
          </li>`
        )
        .join('');
    }
  };

  // Tab button click listeners
  const tabs = document.querySelectorAll('.app-tab-btn');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tierKey = tab.getAttribute('data-tier');
      switchTier(tierKey);
    });
  });

  // External Tier Select Buttons (e.g. from Pricing Cards & Comparison Table)
  const tierSelectBtns = document.querySelectorAll('.tier-select-btn');
  tierSelectBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetPlan = btn.getAttribute('data-plan');
      if (targetPlan) {
        switchTier(targetPlan);
      }
    });
  });

  // Toast Function
  const showToast = (message, duration = 4000) => {
    const toast = document.getElementById('membership-toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, duration);
  };

  // Form Submission Handler
  const form = document.getElementById('membership-reg-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('member-fullname').value.trim();
      const email = document.getElementById('member-email').value.trim();
      const phone = document.getElementById('member-phone').value.trim();
      const district = document.getElementById('member-district').value;
      const org = document.getElementById('member-organization').value.trim();
      const role = document.getElementById('member-designation').value.trim();
      const declaration = document.getElementById('member-declaration').checked;
      const tier = document.getElementById('selected-tier-input').value;

      if (!name || !email || !phone || !district || !org || !role) {
        showToast('Please fill out all required fields marked with *.');
        return;
      }

      if (!declaration) {
        showToast('Please agree to the Section 8 non-political declaration checkbox.');
        return;
      }

      const planName = plans[tier] ? plans[tier].name : 'Membership';
      const planFee = plans[tier] ? plans[tier].fee : '';

      showToast(`Application for ${planName} (${planFee}) submitted successfully! Preparing Section 8 payment gateway...`, 5000);

      // Smooth simulated feedback
      const submitBtn = document.getElementById('btn-submit-application');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processing Section 8 Receipt...</span>`;
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>✓ Application Registered! Receipt Emailed</span>`;
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
          }, 3500);
        }, 1500);
      }
    });
  }

  // Member Verification Simulation
  const verifyBtn = document.getElementById('btn-verify-member');
  const verifyInput = document.getElementById('verify-member-id');
  const verifyResult = document.getElementById('verify-result');

  if (verifyBtn && verifyInput && verifyResult) {
    const handleVerify = () => {
      const val = verifyInput.value.trim().toUpperCase();
      if (!val) {
        verifyResult.className = 'verification-result is-invalid';
        verifyResult.textContent = 'Please enter a valid Maha HR Member ID (e.g. MHRF-2026-P1048).';
        return;
      }

      if (val.length < 5) {
        verifyResult.className = 'verification-result is-invalid';
        verifyResult.textContent = `Member ID "${val}" was not found in our Section 8 active register. Please check and re-try.`;
        return;
      }

      verifyResult.className = 'verification-result is-valid';
      verifyResult.innerHTML = `<strong>✓ Verified Active Member</strong><br>ID: ${val} &bull; Maharashtra HR Forum Section 8 Register &bull; Status: In Good Standing`;
    };

    verifyBtn.addEventListener('click', handleVerify);
    verifyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVerify();
      }
    });
  }

  // Member Login Simulation
  const loginBtn = document.getElementById('btn-member-login');
  const loginInput = document.getElementById('login-member-id');
  if (loginBtn && loginInput) {
    loginBtn.addEventListener('click', () => {
      const val = loginInput.value.trim();
      if (!val) {
        showToast('Please enter your registered Member ID or Mobile Number.');
        return;
      }
      showToast(`One-Time Passcode (OTP) sent to registered coordinates for "${val}".`);
    });
  }

  // FAQ Accordion Toggle
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const panel = item.querySelector('.faq-panel');
      const isOpen = item.classList.contains('is-open');

      // Close all other items for clean single-open behavior
      document.querySelectorAll('.faq-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '0';
      } else {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight + 30}px`;
      }
    });
  });

  // Handle URL hash on load (e.g. #student, #professional, #institutional)
  const hash = window.location.hash.toLowerCase().replace('#', '');
  if (hash === 'student' || hash === 'professional' || hash === 'institutional') {
    switchTier(hash);
  }
}

/**
 * Contact Us Page Interactions: Inquiry Form, SLA Timers, Copy Coordinates & Accordion
 */
function initContactPage() {
  const form = document.getElementById('contact-inquiry-form');
  const toast = document.getElementById('contact-toast');
  const toastMsg = document.getElementById('contact-toast-message');

  const showToast = (message, duration = 4000) => {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, duration);
  };

  // Copy-to-clipboard buttons for coordinates
  const copyButtons = document.querySelectorAll('.btn-copy-coord');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--color-amber-500)';
        showToast(`Copied to clipboard: "${text}"`, 3000);

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        showToast(`Contact value: ${text}`);
      }
    });
  });

  // Contact Form Submission Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-fullname')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const phone = document.getElementById('contact-phone')?.value.trim();
      const category = document.getElementById('contact-category')?.value;
      const purpose = document.getElementById('contact-purpose')?.value;
      const district = document.getElementById('contact-district')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();
      const declaration = document.getElementById('contact-declaration')?.checked;

      if (!name || !email || !phone || !category || !purpose || !district || !message) {
        showToast('Please fill out all required fields marked with * before submitting.');
        return;
      }

      // Basic email pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      // Section 8 declaration check
      if (!declaration) {
        showToast('Please acknowledge the Section 8 non-political declaration checkbox.');
        return;
      }

      const submitBtn = document.getElementById('btn-submit-inquiry');
      if (submitBtn) {
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Dispatching to Secretariat Desk...</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        `;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>✓ Inquiry Dispatched to Secretariat!</span>
          `;
          showToast(`Thank you, ${name}! Your inquiry regarding ${purpose} has been received. Secretariat response will be issued within 24 business hours.`, 6000);
          form.reset();

          setTimeout(() => {
            submitBtn.innerHTML = originalContent;
          }, 4000);
        }, 1400);
      }
    });
  }

  // Contact FAQs Accordion Toggle (isolated to #faqs)
  const faqSection = document.getElementById('faqs');
  if (faqSection) {
    const faqTriggers = faqSection.querySelectorAll('.faq-trigger');
    faqTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const panel = item.querySelector('.faq-panel');
        const isOpen = item.classList.contains('is-open');

        // Close all other items in this accordion
        faqSection.querySelectorAll('.faq-item').forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherPanel = otherItem.querySelector('.faq-panel');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.style.maxHeight = '0';
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = '0';
        } else {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = `${panel.scrollHeight + 30}px`;
        }
      });
    });
  }
}

