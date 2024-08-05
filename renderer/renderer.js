import handleLoginSubmit from './modules/Login/handleLoginSubmit.js';
import handleAuthSubmit from './modules/AuthPrompt/handleAuthSubmit.js';
import handleRegisterSubmit from './modules/Register/handleRegisterSubmit.js'
import showNameUser from './modules/ControllerWindow/showNameUser.js';



//Executar ações quando o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
  //Capturar os cliques em elementos da página
  document.addEventListener('click', e => {
    const el = e.target;

    if (el.classList.contains('BtnRegister')) return window.electron.send('open-prompt'); //Enviar mensagem para abrir o prompt
    if (el.classList.contains('back')) return window.electron.send('go-back'); //Enviar evento para voltar a página principal
    if (el.classList.contains('logoff')) return window.electron.send('close-session') //Encerrar sessão
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

  showNameUser();

  // Seleciona uma linha da tabela
  document.querySelectorAll('.styled-table tbody tr').forEach(row => {
    row.addEventListener('click', () => {
      // Remove a classe 'selected' de todas as linhas
      document.querySelectorAll('.styled-table tbody tr').forEach(r => r.classList.remove('selected'));

      // Adiciona a classe 'selected' à linha clicada
      row.classList.add('selected');
    });
  });


});
