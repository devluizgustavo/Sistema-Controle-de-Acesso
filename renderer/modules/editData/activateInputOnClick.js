export default async function activateInputOnClick() {
  const el = document.querySelectorAll('button');

  el.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      let inputPrevius = button.previousElementSibling

      if (inputPrevius.classList.contains('inputOff')) {
        inputActivate(inputPrevius);
      } else if (inputPrevius.classList.contains('inputOn')) {
        inputDisabled(inputPrevius);
        inputPrevius.setAttribute('value', inputPrevius.value);
      }
    })
  })
}

function inputActivate(inputEl) {
  inputEl.removeAttribute('disabled');
  inputEl.style.background = 'transparent';
  inputEl.focus();

  inputEl.classList.remove('inputOff');
  inputEl.classList.add('inputOn');
}

function inputDisabled(inputEl) {
  inputEl.setAttribute('disabled', '');
  inputEl.style.background = '#e6e6e681';

  inputEl.classList.remove('inputOn');
  inputEl.classList.add('inputOff');
}