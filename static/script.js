/**
 * BIRTHDAY SURPRISE — INTERACTIVE CORE CONTROLLER
 * Powers: Lightbox Modal (with Touch Swipe), Bespoke Music Player, Surprises,
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
       4. BESPOKE AUDIO PLAYER CONTROLLER
       ------------------------------------------------------------------------ */
    const audio = document.getElementById('birthdayAudio');
    const mainPlayBtn = document.getElementById('mainPlayBtn');
    const quickAudioBtn = document.getElementById('quickAudioToggle');
    const vinylDeck = document.getElementById('vinylDeck');
    const soundWaves = document.getElementById('soundWaves');
    const progressTrack = document.getElementById('progressTrack');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeBtn = document.getElementById('volumeBtn');

    if (audio) {
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

        function togglePlay() {
            if (!audio) return;

            if (audio.paused) {
                // Ensure audio is loaded if uninitialized
                if (!audio.currentSrc || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
                    audio.load();
                }

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        updatePlayState(true);
                    }).catch(err => {
                        console.warn("Initial playback attempt handled:", err);
                        // Fallback reload and retry
                        audio.load();
                        audio.play().then(() => {
                            updatePlayState(true);
                        }).catch(e2 => {
                            console.error("Audio playback error:", e2);
                            updatePlayState(false);
                        });
                    });
                }
            } else {
                audio.pause();
                updatePlayState(false);
            }
        }

        function updatePlayState(isPlaying) {
            if (isPlaying) {
                if (mainPlayBtn) {
                    mainPlayBtn.innerHTML = '❚❚';
                    mainPlayBtn.classList.add('playing');
                    mainPlayBtn.setAttribute('aria-label', 'Pause Birthday Song');
                }
                if (quickAudioBtn) quickAudioBtn.classList.add('playing');
                if (vinylDeck) vinylDeck.classList.add('playing');
                if (soundWaves) soundWaves.classList.add('active');
            } else {
                if (mainPlayBtn) {
                    mainPlayBtn.innerHTML = '▶';
                    mainPlayBtn.classList.remove('playing');
                    mainPlayBtn.setAttribute('aria-label', 'Play Birthday Song');
                }
                if (quickAudioBtn) quickAudioBtn.classList.remove('playing');
                if (vinylDeck) vinylDeck.classList.remove('playing');
                if (soundWaves) soundWaves.classList.remove('active');
            }
        }

        // Native audio event synchronization
        audio.addEventListener('play', () => updatePlayState(true));
        audio.addEventListener('playing', () => updatePlayState(true));
        audio.addEventListener('pause', () => updatePlayState(false));

        if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlay);
        if (quickAudioBtn) quickAudioBtn.addEventListener('click', togglePlay);
        if (vinylDeck) {
            vinylDeck.style.cursor = 'pointer';
            vinylDeck.setAttribute('role', 'button');
            vinylDeck.setAttribute('aria-label', 'Toggle Birthday Soundtrack Playback');
            vinylDeck.addEventListener('click', togglePlay);
        }

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const percentage = (audio.currentTime / audio.duration) * 100;
            if (progressFill) progressFill.style.width = `${percentage}%`;
            if (progressTrack) progressTrack.setAttribute('aria-valuenow', Math.round(percentage));
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
            if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
        });

        function seekAudio(e) {
            if (!audio.duration || !progressTrack) return;
            const rect = progressTrack.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clickX = clientX - rect.left;
            const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
            audio.currentTime = newRatio * audio.duration;
        }

        if (progressTrack) {
            progressTrack.addEventListener('click', seekAudio);
            progressTrack.addEventListener('touchstart', seekAudio, { passive: true });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                audio.volume = parseFloat(e.target.value);
                if (volumeBtn) {
                    volumeBtn.textContent = audio.volume === 0 ? '🔇' : '🔊';
                }
            });
        }

        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                if (audio.volume > 0) {
                    audio.dataset.prevVolume = audio.volume;
                    audio.volume = 0;
                    if (volumeSlider) volumeSlider.value = 0;
                    volumeBtn.textContent = '🔇';
                } else {
                    const restored = parseFloat(audio.dataset.prevVolume || 0.8);
                    audio.volume = restored;
                    if (volumeSlider) volumeSlider.value = restored;
                    volumeBtn.textContent = '🔊';
                }
            });
        }

        audio.addEventListener('ended', () => {
            updatePlayState(false);
            if (progressFill) progressFill.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
        });
    }

    /* ------------------------------------------------------------------------
       5. SMOOTH SCROLL OBSERVER (Gentle entrance effects)
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
