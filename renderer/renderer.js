import showNameUser from './modules/ControllerWindow/showNameUser.js';
import handleLoginSubmit from './modules/Login/handleLoginSubmit.js';
import handleAuthSubmit from './modules/AuthPrompt/handleAuthSubmit.js';
import handleRegisterSubmit from './modules/Register/handleRegisterSubmit.js'
import RegPeopleForm from './modules/ControllerWindow/RegPeopleWin/RegPeopleForm.js'

//Executar ações quando o DOM carregar
window.addEventListener('DOMContentLoaded', () => {
  //Capturar os cliques em elementos da página
  document.addEventListener('click', e => {
    const el = e.target;

    if (el.classList.contains('BtnRegister')) return window.electron.send('open-prompt'); //Enviar mensagem para abrir o prompt
    if (el.classList.contains('back')) return window.electron.send('go-back'); //Enviar evento para voltar a página principal
    if (el.classList.contains('logoff')) return window.electron.send('close-session') //Encerrar sessão
    if (el.classList.contains('cadPageController')) return window.electron.send('click-btn-cad') //Envia o evento de clique
    if (el.classList.contains('img-back')) return window.electron.send('back-to-controller') // Evento de clique no botão de volta
  });

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
      } else if (el.id === 'formCadPeople') {
        RegPeopleForm.handleSubmit(e)
      }
    });
  });

  // Capturar a tecla enter para enviar o formulário de todos os formulários
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

  //Tela Principal
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

  // Dependendo da escolha, mostrar input
  document.getElementById('id_type_identific').addEventListener('change', function () {
    const cpfField = document.getElementById('cpf_field');
    const rgField = document.getElementById('rg_field');
    const orgField = document.getElementById('org_field');

    cpfField.value == '';
    rgField.value == '';
    orgField.value == '';
    if (this.value === 'cpf') {
      cpfField.style.display = 'inline-block';
      rgField.style.display = 'none';
      orgField.style.display = 'none'
    } else if (this.value === 'rg') {
      cpfField.style.display = 'none';
      rgField.style.display = 'inline-block';
      orgField.style.display = 'inline-block';
    } else {
      cpfField.style.display = 'inline-block';
      rgField.style.display = 'none';
      orgField.style.display = 'none'
    }
  });


});
