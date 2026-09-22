/**
 * Innova Dental Clinic - Fast Typewriter Preloader
 * Only runs on the initial site load/open.
 * When navigating between pages in the same session, it does not run.
 */
(function() {
  'use strict';

  var isVisited = false;
  try {
    isVisited = sessionStorage.getItem('innova_visited') === 'true';
  } catch (e) {
    isVisited = false;
  }

  var preloader = document.getElementById('innovaPreloader') || document.querySelector('.innova-preloader');

  // If already visited in this session, immediately hide and do NOT run animation
  if (isVisited) {
    if (preloader) {
      preloader.style.display = 'none';
      preloader.classList.add('preloader-hidden');
    }
    return;
  }

  // Mark visited so page transitions don't re-trigger the preloader animation
  try {
    sessionStorage.setItem('innova_visited', 'true');
  } catch (e) {}

  function initInnovaPreloader() {
    var textElement = document.getElementById('innovaTypewriter');
    var targetPreloader = document.getElementById('innovaPreloader') || document.querySelector('.innova-preloader');
    
    if (!targetPreloader) return;
    if (!textElement) {
      targetPreloader.style.display = 'none';
      return;
    }

    var targetText = "INNOVA CLINIC";
    var currentIndex = 0;
    var charSpeed = 45; // quick & responsive typing

    textElement.textContent = "";

    function dismissPreloader() {
      if (!targetPreloader.classList.contains('preloader-hidden')) {
        targetPreloader.classList.add('preloader-hidden');
        setTimeout(function() {
          targetPreloader.style.display = 'none';
        }, 300);
      }
    }

    function typeNextChar() {
      if (currentIndex < targetText.length) {
        textElement.textContent += targetText.charAt(currentIndex);
        currentIndex++;
        setTimeout(typeNextChar, charSpeed);
      } else {
        // Once typed, brief delay then fade away
        setTimeout(dismissPreloader, 280);
      }
    }

    // Start typing quickly
    setTimeout(typeNextChar, 80);

    // Hard fallback safety: never block for more than 1.2s
    setTimeout(dismissPreloader, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInnovaPreloader);
  } else {
    initInnovaPreloader();
  }
})();
