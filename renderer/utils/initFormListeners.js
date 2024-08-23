import handleLoginSubmit from '../modules/userLogin/handleLoginSubmit';
import handleAuthSubmit from '../modules/authorized/handleAuthSubmit.js';
import handleRegisterSubmit from '../modules/userRegister/handleRegisterSubmit.js';
import handlePeopleSubmit from '../modules/peopleRegister/handlePeopleSubmit.js';
import handleAccessSubmit from '../modules/realeaseAccess/handleAccessSubmit.js'

// Função para inicializar event listeners de submit
export default function initFormListeners() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const el = e.target;

      switch (el.id) {
        case 'formLogin':
          handleLoginSubmit(e);
          break;
        case 'formRegister':
          handleRegisterSubmit(e);
          break;
        case 'formPrompt':
          handleAuthSubmit(e);
          break;
        case 'formCadPeople':
          handlePeopleSubmit.handleSubmit(e);
          break;
        case 'formRealeaseAccess':
          handleAccessSubmit(e);
          break;

        default:
          console.warn(`Nenhum formulário foi encontrado: ${el.id}`);
      }
    });
  });
}
