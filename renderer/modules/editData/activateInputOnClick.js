export default async function activateInputOnClick() {
  const el = document.querySelectorAll('button');

  el.forEach(button => {
    if (button.classList.contains('btn-edit')) {
      button.addEventListener('click', e => {
        e.preventDefault();
        let inputPrevius = button.previousElementSibling

        if (inputPrevius.classList.contains('inputOff')) {
          inputActivate(inputPrevius);
        } else if (inputPrevius.classList.contains('inputOn')) {
          inputDisabled(inputPrevius);
          inputPrevius.setAttribute('value', inputPrevius.value);
        }
      });
    }
  });
}

function inputActivate(inputEl) {
  if (inputEl.value == 'Não Cadastrado') {
    inputEl.value = '';
  }
  inputEl.removeAttribute('disabled');
  inputEl.style.background = 'transparent';
  inputEl.focus();

  inputEl.classList.remove('inputOff');
  inputEl.classList.add('inputOn');
}

function inputDisabled(inputEl) {
  if (inputEl.value == '' && inputEl.value !== 'Não Cadastrado') {
    inputEl.value = inputEl.value;
  }

  if (inputEl.value == '') {
    inputEl.value = 'Não Cadastrado';
  }

  inputEl.setAttribute('disabled', '');
  inputEl.style.background = '#e6e6e681';
  inputEl.style.color = '##535353';

  inputEl.classList.remove('inputOn');
  inputEl.classList.add('inputOff');
}