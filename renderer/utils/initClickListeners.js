import getAccess from '../modules/realeaseAccess/handleAccessSubmit.js';
// Função para inicializar event listeners de clique
export default function initClickListeners() {
  document.addEventListener('click', e => {
    const el = e.target;
    if (el.classList.contains('BtnRegister')) {
      window.electron.send('open-prompt');
    } else if (el.classList.contains('back')) {
      window.electron.send('go-back');
    } else if (el.classList.contains('logoff')) {
      window.electron.send('close-session');
    } else if (el.classList.contains('cadPageController')) {
      window.electron.send('click-btn-cad');
    } else if (el.classList.contains('img-back')) {
      window.electron.send('back-to-controller');
    }
  });
}