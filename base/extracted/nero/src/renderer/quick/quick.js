(() => {
  let type = 'todo';
  const input = document.getElementById('input');
  const form = document.getElementById('form');
  const buttons = document.querySelectorAll('.type button[data-type]');

  for (const b of buttons) {
    b.addEventListener('click', () => {
      type = b.dataset.type;
      for (const x of buttons) x.classList.toggle('on', x === b);
      input.focus();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { window.neroQuick.close(); return; }
    if (type === 'todo') await window.neroQuick.addTodo(text);
    else await window.neroQuick.addNote(text);
    window.neroQuick.close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.neroQuick.close();
    if (e.key === 'Tab') { e.preventDefault(); buttons[type === 'todo' ? 1 : 0].click(); }
  });

  window.addEventListener('focus', () => input.focus());
  input.focus();
})();
