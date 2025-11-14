onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);

  // Initialize word-by-word animation after flower finishes
  // Flower finishes around 6.5-7 seconds (1s initial delay + 5.5s longest animation)
  setTimeout(() => {
    initWordAnimation();
  }, 7000);
};

function initWordAnimation() {
  const messageContainer = document.querySelector('.message-container');
  const paragraphs = document.querySelectorAll('.message-paragraph');
  
  if (!messageContainer || paragraphs.length === 0) return;
  
  let wordIndex = 0;
  const wordDelay = 100; // Delay between each word in milliseconds
  const words = []; // Store all word elements for auto-scrolling
  
  paragraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const paragraphWords = text.split(/\s+/);
    
    // Clear the paragraph content
    paragraph.innerHTML = '';
    
    paragraphWords.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'message-word';
      wordSpan.textContent = word;
      
      // Set animation delay for each word
      wordSpan.style.animationDelay = `${wordIndex * wordDelay}ms`;
      
      paragraph.appendChild(wordSpan);
      words.push(wordSpan);
      wordIndex++;
    });
  });
  
  // Show the message container
  messageContainer.classList.add('visible');
  
  // Auto-scroll as words appear
  startAutoScroll(words, wordDelay);
}

function startAutoScroll(words, wordDelay) {
  if (words.length === 0) return;
  
  const startTime = Date.now();
  const initialDelay = 7000; // When animation starts
  
  // Check scroll position periodically
  const scrollCheckInterval = setInterval(() => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime - initialDelay;
    
    if (elapsed < 0) return; // Animation hasn't started yet
    
    // Find the currently animating word
    let currentWordIndex = Math.floor(elapsed / wordDelay);
    if (currentWordIndex >= words.length) {
      clearInterval(scrollCheckInterval);
      return;
    }
    
    const currentWord = words[currentWordIndex];
    if (currentWord) {
      const wordRect = currentWord.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If word is approaching the bottom of viewport (within 300px), scroll down smoothly
      if (wordRect.bottom > viewportHeight - 300) {
        const scrollAmount = Math.min(wordRect.bottom - (viewportHeight - 300), 50);
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  }, 100); // Check every 100ms
  
  // Also scroll when new paragraphs start appearing
  const paragraphs = document.querySelectorAll('.message-paragraph');
  paragraphs.forEach((paragraph) => {
    const firstWordInPara = paragraph.querySelector('.message-word');
    if (firstWordInPara && firstWordInPara instanceof HTMLElement) {
      const paraDelay = parseFloat(firstWordInPara.style.animationDelay) || 0;
      setTimeout(() => {
        const paraRect = paragraph.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // If paragraph is below viewport, scroll to center it
        if (paraRect.top > viewportHeight - 150) {
          paragraph.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, initialDelay + paraDelay + 200); // Small buffer after word appears
    }
  });
}