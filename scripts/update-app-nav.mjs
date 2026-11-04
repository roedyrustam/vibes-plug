import fs from 'node:fs';

const filePath = './showcase/app.js';
let content = fs.readFileSync(filePath, 'utf8');

const isCrlf = content.includes('\r\n');
const eol = isCrlf ? '\r\n' : '\n';

// 1. Update initDom
const oldDomInit = `  dom.toastContainer = document.getElementById('toastContainer');
}`;

const newDomInit = `  dom.toastContainer = document.getElementById('toastContainer');
  dom.siteHeader = document.getElementById('siteHeader');
  dom.navQuickSearchBtn = document.getElementById('navQuickSearchBtn');
  dom.navMobileToggle = document.getElementById('navMobileToggle');
  dom.mobileNavDrawer = document.getElementById('mobileNavDrawer');
  dom.mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  dom.mobileNavClose = document.getElementById('mobileNavClose');
  dom.mobileNavSearchBtn = document.getElementById('mobileNavSearchBtn');
}`;

const normContent = content.replace(/\r\n/g, '\n');
const normOldDomInit = oldDomInit.replace(/\r\n/g, '\n');
const normNewDomInit = newDomInit.replace(/\r\n/g, '\n');

if (!normContent.includes(normOldDomInit)) {
  console.error('Could not find oldDomInit!');
  process.exit(1);
}

content = normContent.replace(normOldDomInit, normNewDomInit);

// 2. Add modern navbar handlers inside initShowcase
const oldInitTarget = `  // Initial render
  filterSkills();`;

const navbarHandlers = `  /* ==========================================================================
     Modern Navbar & Mobile Drawer Interactivity
     ========================================================================== */

  // Header scroll elevation
  function handleScrollElevation() {
    if (!dom.siteHeader) return;
    if (window.scrollY > 18) {
      dom.siteHeader.classList.add('scrolled');
    } else {
      dom.siteHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScrollElevation, { passive: true });
  handleScrollElevation();

  // Active Nav Link Scrollspy
  const navSectionIds = ['terminal', 'explorer', 'topologies', 'benchmarks', 'bridge'];
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  function updateActiveNavScrollspy() {
    const scrollPos = window.scrollY + 140;
    let currentSection = '';

    for (const id of navSectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSection = id;
          break;
        }
      }
    }

    if (currentSection) {
      allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }
  window.addEventListener('scroll', updateActiveNavScrollspy, { passive: true });

  // Quick Search Jump & Focus
  function handleQuickSearchTrigger() {
    closeMobileDrawer();
    const explorerEl = document.getElementById('explorer');
    if (explorerEl) {
      explorerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      if (dom.searchInput) {
        dom.searchInput.focus();
        dom.searchInput.select();
      }
    }, 380);
  }

  if (dom.navQuickSearchBtn) {
    dom.navQuickSearchBtn.addEventListener('click', handleQuickSearchTrigger);
  }
  if (dom.mobileNavSearchBtn) {
    dom.mobileNavSearchBtn.addEventListener('click', handleQuickSearchTrigger);
  }

  // Mobile Drawer Toggle & Control
  function openMobileDrawer() {
    if (!dom.mobileNavDrawer) return;
    dom.mobileNavDrawer.classList.add('open');
    dom.mobileNavDrawer.setAttribute('aria-hidden', 'false');
    if (dom.navMobileToggle) {
      dom.navMobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (!dom.mobileNavDrawer) return;
    dom.mobileNavDrawer.classList.remove('open');
    dom.mobileNavDrawer.setAttribute('aria-hidden', 'true');
    if (dom.navMobileToggle) {
      dom.navMobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (dom.navMobileToggle) {
    dom.navMobileToggle.addEventListener('click', () => {
      const isOpen = dom.mobileNavDrawer && dom.mobileNavDrawer.classList.contains('open');
      if (isOpen) closeMobileDrawer();
      else openMobileDrawer();
    });
  }

  if (dom.mobileNavClose) {
    dom.mobileNavClose.addEventListener('click', closeMobileDrawer);
  }

  if (dom.mobileNavBackdrop) {
    dom.mobileNavBackdrop.addEventListener('click', closeMobileDrawer);
  }

  document.querySelectorAll('[data-close-drawer]').forEach(item => {
    item.addEventListener('click', closeMobileDrawer);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMobileDrawer();
    }
  });

  // Initial render
  filterSkills();`;

const normOldInitTarget = oldInitTarget.replace(/\r\n/g, '\n');
const normNavbarHandlers = navbarHandlers.replace(/\r\n/g, '\n');

if (!content.includes(normOldInitTarget)) {
  console.error('Could not find normOldInitTarget!');
  process.exit(1);
}

content = content.replace(normOldInitTarget, normNavbarHandlers);

// Format with appropriate EOL
content = content.replace(/\n/g, eol);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated showcase/app.js with modern navbar behavior!');

