import showError from '../../utils/showError.js';
let errors = [];
let attemptCount = 0;

export default async function handlePromptSubmit(event) {
  try {
    event.preventDefault();
    const formPrompt = new FormData(event.target);
    const dataPrompt = { code: formPrompt.get('code').trim() };

    if (dataPrompt.code == '') {
      errors.push('Campo não pode estar vazio');
      showError('errorText', `Tentativa: ${attemptCount + 1}`);
    }

    document.getElementById('errorText').innerHTML = '';
    attemptCount += 1;
    const isAuthValid = await window.electron.getAuth(dataPrompt.code)

    if (isAuthValid) {
      showError('errorText', 'Acesso Autorizado');
      window.electron.send('success-auth');
    } else {
      if (attemptCount >= 4) {
        showError('errorText', 'Acesso Negado');
        window.electron.send('block-prompt');
        attemptCount = 0
      } else {
        showError('errorText', `Tentativa: ${attemptCount}`);
      }
    }
  } catch (e) {
    console.log(e);
  }
}