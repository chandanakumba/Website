/**
 * BIRTHDAY SURPRISE — INTERACTIVE CORE CONTROLLER
 * Powers: Lightbox Modal (with Touch Swipe), Surprises,
 * Mobile Drawer Navigation, and Smooth Scroll Observers.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------------
       1. GLOBAL SURPRISE INTERACTION (Preserves existing IDs & functions)
       ------------------------------------------------------------------------ */
    const surpriseStage = document.getElementById('surpriseBox');
    const msgEl = document.getElementById('message');
    const loveEl = document.getElementById('love');
    const bdayMsgEl = document.getElementById('birthdayMessage');
    const weirdSection = document.getElementById('weirdSurpriseSection');
    const weirdCards = document.querySelectorAll('.weird-photo-card');

    window.showMessage = function() {
        if (!surpriseStage) return;
        surpriseStage.classList.add('active');

        // Hide weird photos when sweet message is shown
        if (weirdSection) {
            weirdSection.classList.remove('active');
            weirdCards.forEach(card => card.classList.remove('animate-in'));
        }

        // Populate text (preserving original personal text)
        msgEl.textContent = "You are one of the most special one to me. ✨";
        loveEl.textContent = "This little website is made just for you ❤️";
        bdayMsgEl.textContent = "";

        // Trigger reflow to restart text reveal animation smoothly
        [msgEl, loveEl].forEach(el => {
            el.style.animation = 'none';
            void el.offsetHeight;
            el.style.animation = null;
        });

        // Smooth scroll focus into view if not fully visible
        surpriseStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    window.showSurprise = function() {
        if (!surpriseStage) return;
        surpriseStage.classList.add('active');

        // Populate text (preserving original personal text)
        msgEl.textContent = "";
        loveEl.textContent = "There are so many beautiful memories waiting for you... 💙";
        bdayMsgEl.textContent = "Wishing you a beautiful birthday filled with happiness, laughter, and wonderful memories. ❤️";

        // Trigger reflow to restart text reveal animation smoothly
        [loveEl, bdayMsgEl].forEach(el => {
            el.style.animation = 'none';
            void el.offsetHeight;
            el.style.animation = null;
        });

        // Trigger the funny staggered reveal for the 4 weird photos
        if (weirdSection) {
            weirdSection.classList.add('active');
            
            // Reset animation state to allow re-triggering
            weirdCards.forEach(card => card.classList.remove('animate-in'));
            void weirdSection.offsetHeight; // force reflow

            // Staggered reveals: "Wait... what is this?!" -> hilarious entrance
            weirdCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, 280 * (index + 1)); // 280ms, 560ms, 840ms, 1120ms
            });
        }

        // Smooth scroll focus into view if not fully visible
        surpriseStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Allow weird photos to also open in Lightbox modal when tapped
    weirdCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = card.querySelector('img');
            const caption = card.getAttribute('data-caption') || 'Funny Blooper 😂';
            const lbModal = document.getElementById('lightboxModal');
            const lbImg = document.getElementById('lightboxImg');
            const lbCaption = document.getElementById('lightboxCaption');
            const lbCounter = document.getElementById('lightboxCounter');

            if (lbModal && lbImg) {
                lbImg.src = img.src;
                lbImg.alt = caption;
                if (lbCaption) lbCaption.textContent = caption;
                if (lbCounter) lbCounter.textContent = 'Special Blooper 😂';
                lbModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });


    /* ------------------------------------------------------------------------
       2. MOBILE DRAWER NAVIGATION
       ------------------------------------------------------------------------ */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openMobileDrawer() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.add('active');
        mobileNavDrawer.setAttribute('aria-hidden', 'false');
        if (drawerBackdrop) {
            drawerBackdrop.classList.add('active');
            drawerBackdrop.setAttribute('aria-hidden', 'false');
        }
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.remove('active');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        if (drawerBackdrop) {
            drawerBackdrop.classList.remove('active');
            drawerBackdrop.setAttribute('aria-hidden', 'true');
        }
        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileDrawer();
        });
    });


    /* ------------------------------------------------------------------------
       3. FULLSCREEN LIGHTBOX GALLERY (With Touch Swipe for Mobile)
       ------------------------------------------------------------------------ */
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    const photoCards = Array.from(document.querySelectorAll('.editorial-photo-card'));
    let currentPhotoIndex = 0;

    function openLightbox(index) {
        if (index < 0 || index >= photoCards.length) return;
        currentPhotoIndex = index;

        const card = photoCards[index];
        const img = card.querySelector('img');
        const title = card.getAttribute('data-caption') || img.getAttribute('alt') || 'Cherished Memory';

        lightboxImg.src = img.src;
        lightboxImg.alt = title;
        lightboxCaption.textContent = title;
        lightboxCounter.textContent = `${index + 1} / ${photoCards.length}`;

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % photoCards.length;
        openLightbox(currentPhotoIndex);
    }

    function prevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + photoCards.length) % photoCards.length;
        openLightbox(currentPhotoIndex);
    }

    photoCards.forEach((card, index) => {
        card.addEventListener('click', () => openLightbox(index));
    });

    const epilogueFrame = document.querySelector('.epilogue-photo-pane, .epilogue-photo-frame');
    if (epilogueFrame) {
        epilogueFrame.addEventListener('click', () => {
            const img = epilogueFrame.querySelector('img');
            const caption = epilogueFrame.getAttribute('data-caption') || 'Cherished Memories Together ❤️';
            if (lightboxImg && lightboxModal) {
                lightboxImg.src = img.src;
                lightboxImg.alt = caption;
                if (lightboxCaption) lightboxCaption.textContent = caption;
                if (lightboxCounter) lightboxCounter.textContent = 'Final Memory ❤️';
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-dialog')) {
                closeLightbox();
            }
        });

        // Mobile Touch Swipe Handling
        let touchStartX = 0;
        let touchEndX = 0;

        lightboxModal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxModal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            if (Math.abs(swipeDistance) > 45) {
                if (swipeDistance < 0) {
                    nextPhoto(); // swiped left
                } else {
                    prevPhoto(); // swiped right
                }
            }
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal && lightboxModal.classList.contains('active')) closeLightbox();
            if (mobileNavDrawer && mobileNavDrawer.classList.contains('active')) closeMobileDrawer();
        }
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
    });


    /* ------------------------------------------------------------------------
       4. SMOOTH SCROLL OBSERVER (Gentle entrance effects)
       ------------------------------------------------------------------------ */
    const revealElements = document.querySelectorAll('.editorial-section, .editorial-photo-card, .editorial-letter, .surprise-interactive-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }
});
