/**
 * ============================================================================
 * HELLO MONDAY CREATIVE STUDIO — INTERACTIVE SCRIPT
 * High-craft interactions, generative hero canvas, Web Audio synth & modal
 * ============================================================================
 */

(function () {
    'use strict';

    /* --------------------------------------------------------------------------
       1. DATA: CASE STUDY CATALOGUE
       -------------------------------------------------------------------------- */
    const PROJECTS_DATA = {
        luminaris: {
            id: 'luminaris',
            client: 'Luminaris AI',
            title: 'Transforming Creative Velocity through Spatial Canvas',
            tagline: 'An infinite cognitive workspace that fuses generative AI workflows with spatial node canvas.',
            category: 'product',
            categoryLabel: 'Digital Product',
            year: '2026',
            services: 'Design System, Web Application, Mobile App, AI UX',
            timeline: '6 Months',
            impact: '+185% Daily Active Velocity',
            image: 'assets/images/project-luminaris.jpg',
            challenge: 'Modern creative directors struggle between fragmented tools: text prompts, vector canvasses, and asset libraries. Luminaris needed a cohesive, lightning-fast spatial interface that feels like an extension of the human mind.',
            solution: 'We engineered a node-based spatial canvas built with high-velocity rendering, fluid glassmorphism, micro-gestures, and predictive UI heuristics that anticipate user intents.'
        },
        canvas3d: {
            id: 'canvas3d',
            client: 'National Digital Arts Museum',
            title: 'The Digital Canvas: Immersive 3D Architectural Space',
            tagline: 'A boundary-pushing virtual museum designed for digital art preservation and interactive spatial exhibitions.',
            category: 'experiential',
            categoryLabel: '3D & Experiential',
            year: '2025',
            services: 'WebGL Architecture, Three.js, Spatial Audio, 3D Art Direction',
            timeline: '8 Months',
            impact: '1.2M Virtual Visitors in Month 1',
            image: 'assets/images/project-canvas3d.jpg',
            challenge: 'How can an online gallery evoke the same reverence, acoustic depth, and spatial grandeur of walking through the Guggenheim or Tate Modern?',
            solution: 'We built a bespoke WebGL rendering engine with dynamic radiosity lighting, generative soundscapes responding to proximity, and intuitive spatial navigation that requires zero tutorials.'
        },
        terra: {
            id: 'terra',
            client: 'Terra Living Labs',
            title: 'Terra: Playfully Crafted Sustainable Living Goods',
            tagline: 'A joyful, earth-conscious brand identity and digital e-commerce flagship for mycelium-based goods.',
            category: 'brand',
            categoryLabel: 'Brand Systems',
            year: '2025',
            services: 'Brand Identity, Packaging, E-Commerce, Custom Typography',
            timeline: '4 Months',
            impact: '$3.4M Seed Launch Volume',
            image: 'assets/images/project-terra.jpg',
            challenge: 'Sustainability products are often branded with drab beige tones and clinical messaging that feels guilty rather than uplifting.',
            solution: 'We injected Danish playful minimalism: organic jelly shapes, optimistic lime and olive gradients, tactile physical packaging, and a delightful checkout flow featuring micro-animations at every step.'
        },
        orbit: {
            id: 'orbit',
            client: 'Copenhagen Astrophysics Inst.',
            title: 'Orbit Kinematics: Gravitational Wave Sonification',
            tagline: 'Translating cosmic gravitational vibrations into interactive visual harmonic waveforms.',
            category: 'experiential',
            categoryLabel: '3D & Experiential',
            year: '2026',
            services: 'Creative Coding, Data Art, Web Audio API, Educational Web',
            timeline: '3 Months',
            impact: 'Featured on NASA Science & Tech',
            image: 'assets/images/project-canvas3d.jpg',
            challenge: 'Astronomical gravitational data is conceptually abstract and mathematically inaccessible to non-specialists.',
            solution: 'We sculpted a kinetic web simulation where visitors manipulate orbital mass, triggering resonant harmonic synthesis and real-time spacetime curvature graphics.'
        },
        hyperion: {
            id: 'hyperion',
            client: 'Hyperion OS',
            title: 'Hyperion: Cognitive Work OS for Distributed Teams',
            tagline: 'A desktop application reimagining asynchronous team velocity and focused work states.',
            category: 'product',
            categoryLabel: 'Digital Product',
            year: '2025',
            services: 'Desktop UI/UX, Electron Architecture, Motion System',
            timeline: '7 Months',
            impact: '4.9/5 Rating across 50,000+ teams',
            image: 'assets/images/project-luminaris.jpg',
            challenge: 'Notification fatigue and endless context-switching plague modern remote knowledge workers.',
            solution: 'We crafted an ambient interface that clusters tasks by cognitive load, muting micro-interruptions and displaying beautiful visual rhythms of team collaboration.'
        },
        nordic: {
            id: 'nordic',
            client: 'København Type Foundry',
            title: 'Nordic Letters: Variable Typographic Specimen Studio',
            tagline: 'An interactive typographic playground celebrating Scandinavian editorial type design.',
            category: 'brand',
            categoryLabel: 'Brand Systems',
            year: '2024',
            services: 'Typography Specimen, Web Design, Interactive Font Tester',
            timeline: '3 Months',
            impact: 'Over 200,000 Font Downloads',
            image: 'assets/images/project-terra.jpg',
            challenge: 'Traditional PDF font specimen sheets fail to demonstrate how variable fonts adapt across viewports and interaction states.',
            solution: 'We developed an interactive browser studio that lets typographers and designers stretch, skew, colorize, and animate variable font axes in real time.'
        }
    };

    /* --------------------------------------------------------------------------
       2. WEB AUDIO SYNTHESIS ENGINE (No external files needed)
       -------------------------------------------------------------------------- */
    class AudioEngine {
        constructor() {
            this.ctx = null;
            this.isMuted = localStorage.getItem('hm_sound_muted') === 'true';
            this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);
            window.addEventListener('click', this.initOnFirstInteraction, { once: true });
            window.addEventListener('keydown', this.initOnFirstInteraction, { once: true });
        }

        initOnFirstInteraction() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
        }

        ensureContext() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playTone(freq = 440, type = 'sine', duration = 0.25, volume = 0.12) {
            if (this.isMuted) return;
            try {
                this.ensureContext();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                gain.gain.setValueAtTime(volume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                console.warn('Audio play prevented:', e);
            }
        }

        playClick() {
            this.playTone(880, 'triangle', 0.08, 0.05);
        }

        playPop() {
            this.playTone(520, 'sine', 0.15, 0.08);
        }

        playSuccess() {
            if (this.isMuted) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    this.playTone(freq, 'sine', 0.45, 0.09);
                }, idx * 110);
            });
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            localStorage.setItem('hm_sound_muted', this.isMuted.toString());
            return this.isMuted;
        }
    }

    const sound = new AudioEngine();

    /* --------------------------------------------------------------------------
       3. CUSTOM MAGNETIC CURSOR & HOVER STATES
       -------------------------------------------------------------------------- */
    function initCustomCursor() {
        const dot = document.getElementById('cursor-dot');
        const follower = document.getElementById('cursor-follower');
        const textLabel = document.getElementById('cursor-text');

        if (!dot || !follower) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        // Smooth follower lerping
        function renderFollower() {
            followerX += (mouseX - followerX) * 0.18;
            followerY += (mouseY - followerY) * 0.18;
            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(renderFollower);
        }
        requestAnimationFrame(renderFollower);

        // Dynamic cursor hover detection via data-cursor attribute
        function attachCursorListeners() {
            const targets = document.querySelectorAll('[data-cursor], a, button, input, select, textarea');
            targets.forEach((el) => {
                el.addEventListener('mouseenter', () => {
                    const customText = el.getAttribute('data-cursor');
                    if (customText) {
                        follower.classList.add('is-hovering');
                        textLabel.textContent = customText;
                    } else {
                        follower.classList.add('is-hovering');
                        textLabel.textContent = '';
                    }
                });

                el.addEventListener('mouseleave', () => {
                    follower.classList.remove('is-hovering');
                    textLabel.textContent = '';
                });
            });
        }
        attachCursorListeners();

        // Re-attach when dynamic DOM updates
        window.addEventListener('hm-refresh-cursor', attachCursorListeners);
    }

    /* --------------------------------------------------------------------------
       4. INTERACTIVE GENERATIVE HERO CANVAS (Playful Physics & Fluid Orbs)
       -------------------------------------------------------------------------- */
    function initHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;

        let mouse = { x: width / 2, y: height / 2, radius: 180 };
        let activeMood = 'playful';

        // Palette presets by mood
        const moodPalettes = {
            playful: [
                { r: 255, g: 72, b: 0, a: 0.14 },    // Tangerine
                { r: 255, g: 180, b: 0, a: 0.14 },   // Amber
                { r: 34, g: 197, b: 94, a: 0.10 },   // Lime
                { r: 99, g: 102, b: 241, a: 0.10 }   // Indigo
            ],
            minimal: [
                { r: 100, g: 100, b: 110, a: 0.08 },
                { r: 200, g: 200, b: 210, a: 0.08 },
                { r: 255, g: 72, b: 0, a: 0.06 }
            ],
            electric: [
                { r: 255, g: 0, b: 128, a: 0.18 },
                { r: 0, g: 220, b: 255, a: 0.16 },
                { r: 255, g: 72, b: 0, a: 0.16 }
            ]
        };

        // Orbs definition
        const orbs = [];
        const numOrbs = 7;

        for (let i = 0; i < numOrbs; i++) {
            orbs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                baseRadius: Math.random() * 90 + 90,
                radius: 120,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                colorIdx: i % moodPalettes.playful.length,
                phase: Math.random() * Math.PI * 2
            });
        }

        window.addEventListener('resize', () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        });

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            const palette = moodPalettes[activeMood] || moodPalettes.playful;

            for (let i = 0; i < orbs.length; i++) {
                const orb = orbs[i];
                orb.phase += 0.02;
                orb.radius = orb.baseRadius + Math.sin(orb.phase) * 18;

                // Move
                orb.x += orb.vx;
                orb.y += orb.vy;

                // Wall bounce
                if (orb.x < -orb.radius) orb.x = width + orb.radius;
                if (orb.x > width + orb.radius) orb.x = -orb.radius;
                if (orb.y < -orb.radius) orb.y = height + orb.radius;
                if (orb.y > height + orb.radius) orb.y = -orb.radius;

                // Subtle mouse repulsion
                const dx = orb.x - mouse.x;
                const dy = orb.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - dist) / mouse.radius;
                    orb.x += Math.cos(angle) * force * 4;
                    orb.y += Math.sin(angle) * force * 4;
                }

                // Render gradient orb
                const col = palette[orb.colorIdx % palette.length];
                const grad = ctx.createRadialGradient(
                    orb.x, orb.y, 0,
                    orb.x, orb.y, orb.radius
                );
                grad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`);
                grad.addColorStop(0.6, `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a * 0.4})`);
                grad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animateCanvas);
        }
        requestAnimationFrame(animateCanvas);

        // Mood switcher pills
        const moodPills = document.querySelectorAll('.mood-pill');
        moodPills.forEach(pill => {
            pill.addEventListener('click', () => {
                moodPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeMood = pill.getAttribute('data-mood');
                sound.playPop();
            });
        });
    }

    /* --------------------------------------------------------------------------
       5. LIVE STUDIO CLOCKS (Copenhagen, NYC, Jakarta)
       -------------------------------------------------------------------------- */
    function initStudioClocks() {
        const cphEl = document.getElementById('time-cph');
        const nycEl = document.getElementById('time-nyc');
        const jktEl = document.getElementById('time-jkt');

        function updateClocks() {
            const now = new Date();
            const formatTime = (timeZone) => {
                try {
                    return new Intl.DateTimeFormat('en-GB', {
                        timeZone,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(now);
                } catch (e) {
                    return '--:--';
                }
            };

            if (cphEl) cphEl.textContent = formatTime('Europe/Copenhagen');
            if (nycEl) nycEl.textContent = formatTime('America/New_York');
            if (jktEl) jktEl.textContent = formatTime('Asia/Jakarta');
        }

        updateClocks();
        setInterval(updateClocks, 10000);
    }

    /* --------------------------------------------------------------------------
       6. THEME TOGGLER (Dark / Light Mode)
       -------------------------------------------------------------------------- */
    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (!themeBtn) return;

        // Load saved theme or system preference
        const savedTheme = localStorage.getItem('hm_theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', currentTheme);

        themeBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('hm_theme', nextTheme);
            sound.playPop();
            showToast(`Switched to ${nextTheme === 'dark' ? 'Night' : 'Porcelain Day'} Mode`);
        });
    }

    /* --------------------------------------------------------------------------
       7. SOUND TOGGLER
       -------------------------------------------------------------------------- */
    function initSoundToggle() {
        const soundBtn = document.getElementById('sound-toggle-btn');
        if (!soundBtn) return;

        if (sound.isMuted) {
            soundBtn.classList.add('is-muted');
        }

        soundBtn.addEventListener('click', () => {
            const isMutedNow = sound.toggleMute();
            soundBtn.classList.toggle('is-muted', isMutedNow);
            if (!isMutedNow) {
                sound.playPop();
                showToast('Sound Effects Enabled 🔊');
            } else {
                showToast('Sound Muted 🔇');
            }
        });
    }

    /* --------------------------------------------------------------------------
       8. PROJECT FILTERING, SEARCH & LIST/GRID SWITCHER
       -------------------------------------------------------------------------- */
    function initWorkShowcase() {
        const filterPills = document.querySelectorAll('.filter-pill');
        const searchInput = document.getElementById('project-search-input');
        const clearBtn = document.getElementById('clear-search-btn');
        const gridContainer = document.getElementById('projects-grid');
        const listContainer = document.getElementById('projects-list');
        const listItemsGroup = document.getElementById('list-items-group');
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listViewBtn = document.getElementById('list-view-btn');
        const noResultsMsg = document.getElementById('no-results-msg');
        const resetFiltersBtn = document.getElementById('reset-filters-btn');

        let currentCategory = 'all';
        let searchQuery = '';

        // Populate dynamic list table
        function populateListItems() {
            if (!listItemsGroup) return;
            listItemsGroup.innerHTML = '';

            Object.values(PROJECTS_DATA).forEach(item => {
                const row = document.createElement('div');
                row.className = 'list-item-row';
                row.setAttribute('data-category', item.category);
                row.setAttribute('data-id', item.id);
                row.setAttribute('data-cursor', 'VIEW');

                row.innerHTML = `
                    <span class="col-client">${item.client}</span>
                    <span class="col-title">${item.title}</span>
                    <span class="col-category">${item.categoryLabel}</span>
                    <span class="col-year">${item.year}</span>
                    <span class="col-action-btn">View Case &rarr;</span>
                `;

                row.addEventListener('click', () => openProjectModal(item.id));
                listItemsGroup.appendChild(row);
            });
        }
        populateListItems();

        // Filter and Search Evaluation
        function applyFilters() {
            const gridCards = gridContainer ? gridContainer.querySelectorAll('.project-card') : [];
            const listRows = listItemsGroup ? listItemsGroup.querySelectorAll('.list-item-row') : [];

            let visibleCount = 0;

            function checkMatch(cat, title, client) {
                const matchCategory = currentCategory === 'all' || cat === currentCategory;
                const matchSearch = !searchQuery || 
                    title.toLowerCase().includes(searchQuery) || 
                    client.toLowerCase().includes(searchQuery);
                return matchCategory && matchSearch;
            }

            gridCards.forEach(card => {
                const id = card.getAttribute('data-id');
                const data = PROJECTS_DATA[id];
                if (!data) return;

                const isMatch = checkMatch(data.category, data.title, data.client);
                card.style.display = isMatch ? 'flex' : 'none';
                if (isMatch) visibleCount++;
            });

            listRows.forEach(row => {
                const id = row.getAttribute('data-id');
                const data = PROJECTS_DATA[id];
                if (!data) return;

                const isMatch = checkMatch(data.category, data.title, data.client);
                row.style.display = isMatch ? 'grid' : 'none';
            });

            if (noResultsMsg) {
                noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }

        // Category Pills Click
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = pill.getAttribute('data-category');
                sound.playClick();
                applyFilters();
            });
        });

        // Search Input Handling
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.trim().toLowerCase();
                if (clearBtn) clearBtn.style.display = searchQuery ? 'inline-block' : 'none';
                applyFilters();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    searchQuery = '';
                    clearBtn.style.display = 'none';
                    applyFilters();
                    searchInput.focus();
                }
            });
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                currentCategory = 'all';
                searchQuery = '';
                if (searchInput) searchInput.value = '';
                if (clearBtn) clearBtn.style.display = 'none';
                filterPills.forEach(p => {
                    p.classList.toggle('active', p.getAttribute('data-category') === 'all');
                });
                applyFilters();
                sound.playPop();
            });
        }

        // Grid / List View Mode
        if (gridViewBtn && listViewBtn) {
            gridViewBtn.addEventListener('click', () => {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                if (gridContainer) gridContainer.style.display = 'grid';
                if (listContainer) listContainer.style.display = 'none';
                sound.playClick();
            });

            listViewBtn.addEventListener('click', () => {
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                if (gridContainer) gridContainer.style.display = 'none';
                if (listContainer) listContainer.style.display = 'block';
                sound.playClick();
            });
        }

        // Card Quick-View Triggers
        document.querySelectorAll('.card-quickview-btn, .project-card').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // If clicked direct button or card itself
                const targetCard = trigger.closest('.project-card');
                if (targetCard) {
                    const projectId = targetCard.getAttribute('data-id');
                    openProjectModal(projectId);
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       9. CASE STUDY QUICK VIEW MODAL
       -------------------------------------------------------------------------- */
    function openProjectModal(projectId) {
        const data = PROJECTS_DATA[projectId];
        if (!data) return;

        const modal = document.getElementById('project-modal');
        if (!modal) return;

        document.getElementById('modal-project-badge').textContent = data.categoryLabel.toUpperCase();
        document.getElementById('modal-project-year').textContent = data.year;
        document.getElementById('modal-project-title').textContent = data.title;
        document.getElementById('modal-project-tagline').textContent = data.tagline;

        const imgEl = document.getElementById('modal-project-image');
        if (imgEl) {
            imgEl.src = data.image;
            imgEl.alt = `${data.title} visual`;
        }

        document.getElementById('modal-client-name').textContent = data.client;
        document.getElementById('modal-services').textContent = data.services;
        document.getElementById('modal-timeline').textContent = data.timeline;
        document.getElementById('modal-impact').textContent = data.impact;

        document.getElementById('modal-challenge-text').textContent = data.challenge;
        document.getElementById('modal-solution-text').textContent = data.solution;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        sound.playPop();
    }

    function closeProjectModal() {
        const modal = document.getElementById('project-modal');
        if (!modal) return;

        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        sound.playClick();
    }

    function initProjectModalEvents() {
        const closeBtn = document.getElementById('modal-close-btn');
        const dismissBtn = document.getElementById('modal-dismiss-btn');
        const contactCta = document.getElementById('modal-contact-cta');
        const modal = document.getElementById('project-modal');

        if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
        if (dismissBtn) dismissBtn.addEventListener('click', closeProjectModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeProjectModal();
                }
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        });

        if (contactCta) {
            contactCta.addEventListener('click', () => {
                closeProjectModal();
                const contactSec = document.getElementById('contact-section');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    /* --------------------------------------------------------------------------
       10. INTERACTIVE LAB: PENTATONIC SYNTHESIZER
       -------------------------------------------------------------------------- */
    function initSynthLab() {
        const synthPads = document.querySelectorAll('.synth-pad');
        const readout = document.getElementById('active-note-readout');
        const arpeggioBtn = document.getElementById('synth-arpeggio-btn');

        synthPads.forEach(pad => {
            const freq = parseFloat(pad.getAttribute('data-freq'));
            const note = pad.getAttribute('data-note');

            function triggerNote() {
                pad.classList.add('is-playing');
                sound.playTone(freq, 'sine', 0.45, 0.18);
                if (readout) readout.textContent = `Tone: ${note} (${freq}Hz)`;

                setTimeout(() => {
                    pad.classList.remove('is-playing');
                }, 280);
            }

            pad.addEventListener('click', triggerNote);
            pad.addEventListener('mouseenter', () => {
                // If mouse button is held down, trigger note
                pad.classList.add('is-hover');
            });
        });

        // Arpeggio player
        if (arpeggioBtn) {
            arpeggioBtn.addEventListener('click', () => {
                const pads = Array.from(synthPads);
                pads.forEach((p, idx) => {
                    setTimeout(() => {
                        p.click();
                    }, idx * 140);
                });
            });
        }
    }

    /* --------------------------------------------------------------------------
       11. INTERACTIVE LAB: KINETIC TYPOGRAPHY PLAYGROUND
       -------------------------------------------------------------------------- */
    function initKineticTypography() {
        const letters = document.querySelectorAll('.k-letter');
        const weightSlider = document.getElementById('weight-slider');
        const trackingSlider = document.getElementById('tracking-slider');
        const shuffleBtn = document.getElementById('shuffle-type-btn');
        const stage = document.getElementById('kinetic-letters-stage');

        if (weightSlider && stage) {
            weightSlider.addEventListener('input', (e) => {
                const val = e.target.value;
                letters.forEach(letter => {
                    letter.style.fontWeight = val;
                });
            });
        }

        if (trackingSlider && stage) {
            trackingSlider.addEventListener('input', (e) => {
                const val = e.target.value;
                stage.style.letterSpacing = `${val}px`;
            });
        }

        letters.forEach(letter => {
            letter.addEventListener('mouseenter', () => {
                sound.playTone(400 + Math.random() * 400, 'sine', 0.12, 0.04);
            });
        });

        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                letters.forEach(letter => {
                    const rot = (Math.random() - 0.5) * 45;
                    const dy = (Math.random() - 0.5) * 30;
                    letter.style.transform = `translateY(${dy}px) rotate(${rot}deg)`;
                });
                sound.playPop();

                setTimeout(() => {
                    letters.forEach(letter => {
                        letter.style.transform = '';
                    });
                }, 900);
            });
        }
    }

    /* --------------------------------------------------------------------------
       12. SERVICES ACCORDION
       -------------------------------------------------------------------------- */
    function initServicesAccordion() {
        const items = document.querySelectorAll('.services-accordion .accordion-item');

        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const panel = item.querySelector('.accordion-panel');
            const icon = item.querySelector('.service-toggle-icon');

            if (!header || !panel) return;

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all other items for clean accordion behavior
                items.forEach(other => {
                    other.classList.remove('active');
                    const otherHeader = other.querySelector('.accordion-header');
                    const otherPanel = other.querySelector('.accordion-panel');
                    const otherIcon = other.querySelector('.service-toggle-icon');
                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                    if (otherPanel) otherPanel.hidden = true;
                    if (otherIcon) otherIcon.innerHTML = '&#43;';
                });

                if (!isOpen) {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                    panel.hidden = false;
                    if (icon) icon.innerHTML = '&minus;';
                    sound.playClick();
                } else {
                    sound.playClick();
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       13. INTERSECTION OBSERVER FOR STAT COUNTERS
       -------------------------------------------------------------------------- */
    function initStatsCounters() {
        const counters = document.querySelectorAll('.metric-num');
        if (!counters.length) return;

        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'), 10);
                        const duration = 1600;
                        const start = 0;
                        const startTime = performance.now();

                        function updateCount(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Ease out quartic
                            const easeOut = 1 - Math.pow(1 - progress, 4);
                            const currentVal = Math.floor(easeOut * target);

                            counter.textContent = currentVal;

                            if (progress < 1) {
                                requestAnimationFrame(updateCount);
                            } else {
                                counter.textContent = target;
                            }
                        }

                        requestAnimationFrame(updateCount);
                    });
                }
            });
        }, { threshold: 0.3 });

        const heroMetrics = document.querySelector('.hero-metrics-strip');
        if (heroMetrics) observer.observe(heroMetrics);
    }

    /* --------------------------------------------------------------------------
       14. QUICK INQUIRY FORM & TOAST NOTIFICATION
       -------------------------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById('quick-inquiry-form');
        const scopePills = document.querySelectorAll('.scope-pill');
        const submitBtn = document.getElementById('submit-brief-btn');

        // Scope Selector
        scopePills.forEach(pill => {
            pill.addEventListener('click', () => {
                scopePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                sound.playClick();
            });
        });

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('client-name');
            const emailInput = document.getElementById('client-email');
            const msgInput = document.getElementById('client-message');

            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const msgError = document.getElementById('msg-error');

            let isValid = true;

            // Name check
            if (!nameInput.value.trim()) {
                nameInput.classList.add('has-error');
                if (nameError) nameError.classList.add('is-visible');
                isValid = false;
            } else {
                nameInput.classList.remove('has-error');
                if (nameError) nameError.classList.remove('is-visible');
            }

            // Email check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                emailInput.classList.add('has-error');
                if (emailError) emailError.classList.add('is-visible');
                isValid = false;
            } else {
                emailInput.classList.remove('has-error');
                if (emailError) emailError.classList.remove('is-visible');
            }

            // Message check
            if (!msgInput.value.trim()) {
                msgInput.classList.add('has-error');
                if (msgError) msgError.classList.add('is-visible');
                isValid = false;
            } else {
                msgInput.classList.remove('has-error');
                if (msgError) msgError.classList.remove('is-visible');
            }

            if (!isValid) return;

            // Submit animation
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Transmitting Brief...</span>`;
            }

            setTimeout(() => {
                sound.playSuccess();
                showToast(`👋 Thank you ${nameInput.value.trim()}! We'll reply within 24 hours.`);

                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Inquiry Sent Successfully! ✓</span>`;
                    setTimeout(() => {
                        submitBtn.innerHTML = `<span>Send Inquiry</span><span class="btn-arrow">&rarr;</span>`;
                    }, 4000);
                }
            }, 800);
        });
    }

    function showToast(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    }

    /* --------------------------------------------------------------------------
       15. MOBILE MENU DRAWER & NAVIGATION
       -------------------------------------------------------------------------- */
    function initMobileMenu() {
        const toggleBtn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-menu-drawer');
        const closeLinks = document.querySelectorAll('[data-close-menu]');

        if (!toggleBtn || !drawer) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = drawer.classList.contains('is-open');
            drawer.classList.toggle('is-open', !isOpen);
            toggleBtn.classList.toggle('active', !isOpen);
            toggleBtn.setAttribute('aria-expanded', (!isOpen).toString());
            sound.playClick();
        });

        closeLinks.forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('is-open');
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* --------------------------------------------------------------------------
       16. QUICK REEL & BANNER BUTTONS
       -------------------------------------------------------------------------- */
    function initAuxButtons() {
        const quickReelBtn = document.getElementById('quick-reel-btn');
        if (quickReelBtn) {
            quickReelBtn.addEventListener('click', () => {
                const labSec = document.getElementById('lab-section');
                if (labSec) {
                    labSec.scrollIntoView({ behavior: 'smooth' });
                    sound.playPop();
                }
            });
        }

        const bannerContactBtn = document.getElementById('banner-contact-btn');
        const headerContactBtn = document.getElementById('header-contact-btn');
        const exploreWorkBtn = document.getElementById('explore-work-btn');

        function scrollToContact() {
            const contactSec = document.getElementById('contact-section');
            if (contactSec) {
                contactSec.scrollIntoView({ behavior: 'smooth' });
                sound.playClick();
            }
        }

        if (bannerContactBtn) bannerContactBtn.addEventListener('click', scrollToContact);
        if (headerContactBtn) headerContactBtn.addEventListener('click', scrollToContact);
    }

    /* --------------------------------------------------------------------------
       17. INITIALIZE ALL MODULES ON DOM READY
       -------------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        initCustomCursor();
        initHeroCanvas();
        initStudioClocks();
        initThemeToggle();
        initSoundToggle();
        initWorkShowcase();
        initProjectModalEvents();
        initSynthLab();
        initKineticTypography();
        initServicesAccordion();
        initStatsCounters();
        initContactForm();
        initMobileMenu();
        initAuxButtons();
    });

})();
