export function createLoadingScreen(container, onDone) {
  container.innerHTML = `
    <div class="logo">Pathfinding Simulator</div>
    <p class="muted">Preparing graph engine...</p>
    <div class="progress-wrap" aria-label="Loading progress">
      <div class="progress-bar" id="progressBar"></div>
    </div>
  `;

  const bar = container.querySelector('#progressBar');
  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(100, progress + 12);
    bar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(onDone, 220);
    }
  }, 120);
}
