const defaultSet = '{1,2,3}';
const defaultRel = '{(1,1),(2,2),(3,3),(1,2),(2,3),(1,3)}';

export function createInputScreen(container, { bindPress, onBack, onSubmit }) {
  container.innerHTML = `
    <div class="card">
      <h2>Input Poset</h2>
      <p class="muted">Enter set A and relation R.</p>
      <div class="results" style="margin-top:12px;">
        <label>
          Set A
          <input id="setInput" value="${defaultSet}" autocomplete="off" />
        </label>
        <label>
          Relation R
          <textarea id="relationInput" rows="3">${defaultRel}</textarea>
        </label>
      </div>
      <p id="inputFeedback" class="muted" style="margin-top:10px;"></p>
      <div class="actions" style="margin-top:12px;">
        <button id="backBtn" type="button">Back</button>
        <button id="generateBtn" type="button">Generate Diagram</button>
      </div>
    </div>
  `;

  const setInput = container.querySelector('#setInput');
  const relationInput = container.querySelector('#relationInput');
  const feedbackNode = container.querySelector('#inputFeedback');

  const feedback = (text, isError) => {
    feedbackNode.textContent = text;
    feedbackNode.classList.toggle('error', Boolean(isError));
  };

  bindPress(container.querySelector('#backBtn'), onBack);
  bindPress(container.querySelector('#generateBtn'), () => {
    onSubmit({
      setText: setInput.value,
      relationText: relationInput.value,
      feedback
    });
  });
}
