export function createMenuScreen(container, { bindPress, onStart }) {
  container.innerHTML = `
    <div class="card">
      <h1>Pathfinding Simulator</h1>
      <p class="muted">Visualize Hasse diagrams and compare algorithm efficiency.</p>
      <div class="actions" style="margin-top:14px;">
        <button id="startBtn">New Game</button>
        <button id="settingsBtn" type="button">Settings (Soon)</button>
        <button id="learnBtn" type="button">Learn Mode (Soon)</button>
      </div>
    </div>
  `;

  const startBtn = container.querySelector('#startBtn');
  const settingsBtn = container.querySelector('#settingsBtn');
  const learnBtn = container.querySelector('#learnBtn');

  bindPress(startBtn, onStart);
  bindPress(settingsBtn, () => window.alert('Settings will be added in a future update.'));
  bindPress(learnBtn, () => window.alert('Learn mode will be added in a future update.'));
}
