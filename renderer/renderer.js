import handleLoginSubmit from './modules/Login/handleLoginSubmit.js';
import handleAuthSubmit from './modules/AuthPrompt/handleAuthSubmit.js';
import handleRegisterSubmit from './modules/Register/handleRegisterSubmit'

//Prever TODOS os eventos do documento
window.addEventListener('DOMContentLoaded', () => {
  //Capturar os cliques em elementos da página
  document.addEventListener('click', e => {
    const el = e.target;

    if (el.classList.contains('BtnRegister')) return window.electron.send('open-prompt'); //Enviar mensagem para abrir o prompt
    if (el.classList.contains('back')) return window.electron.send('go-back'); //Enviar evento para voltar a página principal
  })

  // Capturar o evento submit de todos os formulários
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Impede o envio padrão
      const el = e.target;

      if (el.id === 'formLogin') {
        handleLoginSubmit(e);
      } else if (el.id === 'formRegister') {
        handleRegisterSubmit(e);
      } else if (el.id === 'formPrompt') {
        handleAuthSubmit(e);
      }
    });
  });

  // Capturar a tecla enter para enviar o formulário
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Impede o envio padrão do Enter
        const form = e.target.closest('form'); // Encontra o formulário pai
        if (form) {
          form.dispatchEvent(new Event('submit')); // Dispara o evento de submit no formulário
        }
      }
    });
  });
});
