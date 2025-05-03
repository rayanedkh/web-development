let slides = [];
let currentIndex = -1;
let isPlaying = false;
let paused = false;
let timer = null;

function loadSlides() {
  fetch('slides.json')
    .then(response => response.json())
    .then(data => {
      slides = data.slides;
    })
    .catch(error => console.error('Error loading slides:', error));
}

function showSlide(index) {
  if (index >= 0 && index < slides.length) {
    const slide = slides[index];
    const mainDiv = document.getElementById('MAIN');
    mainDiv.innerHTML = '';

    if (slide.url) {
      const iframe = document.createElement('iframe');
      iframe.src = slide.url;
      iframe.width = '800';
      iframe.height = '600';
      mainDiv.appendChild(iframe);
    }

    currentIndex = index;
  }
}

function playSlideshow() {
  if (isPlaying) return; // Avoid double start

  isPlaying = true;
  currentIndex = 0;
  nextSlideLoop();
}

function nextSlideLoop() {
  if (!isPlaying || paused || currentIndex >= slides.length) return;

  showSlide(currentIndex);

  timer = setTimeout(() => {
    currentIndex++;
    nextSlideLoop();
  }, 2000);
}

function pauseContinue() {
  paused = !paused;

  if (!paused && isPlaying) {
    nextSlideLoop();
  } else {
    clearTimeout(timer);
  }
}

function nextSlide() {
  clearTimeout(timer);
  isPlaying = false;
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    showSlide(currentIndex);
  }
}

function previousSlide() {
  clearTimeout(timer);
  isPlaying = false;
  if (currentIndex > 0) {
    currentIndex--;
    showSlide(currentIndex);
  }
}

document.getElementById('start').addEventListener('click', playSlideshow);
document.getElementById('paus').addEventListener('click', pauseContinue);
document.getElementById('suivant').addEventListener('click', nextSlide);
document.getElementById('prev').addEventListener('click', previousSlide);

loadSlides();
