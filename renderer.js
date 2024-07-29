const { ipcRenderer } = require("electron");

//Variável para alocar os erros a cada rodada de verificação
let errors = [];

//Função para mostrar os erros
function showError(idName, MsgError) {
  document.getElementById(idName).innerHTML += MsgError;
}
//Função para capturar e validar o formulário de Login
function handleLoginSubmit(event) {
  event.preventDefault();
  const userAndPasswordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$/
  const formDataLogin = new FormData(event.target);
  const dataLogin = {
    user: formDataLogin.get('user').trim(),
    password: formDataLogin.get('password').trim()
  }

  errors = [];
  document.getElementById('error').innerHTML = '';

  if (dataLogin.user.length < 5 || dataLogin.password.length < 7) errors.push('Campos não atendem a quantidade mínima de caracteres.<br>');
  if (!userAndPasswordRegex.test(dataLogin.user) ||
    !userAndPasswordRegex.test(dataLogin.password)) errors.push('Campos não atendem aos requisitos necessários.<br>');
  if (errors.length > 0) return errors.forEach((val) => showError('error', val));

  return ipcRenderer.send('form-login', dataLogin);
}
//Função para capturar e validar o formulário de Registro
function handleRegisterSubmit(event) {
  event.preventDefault();
  const nameAndLastNameRegex = /[^a-zA-Z\s]/g;
  const userAndPasswordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$/
  const formRegister = new FormData(event.target);
  const dataUser = {
    name: formRegister.get('name').trim(),
    lastname: formRegister.get('lastname').trim(),
    user: formRegister.get('user').trim(),
    password: formRegister.get('password').trim()
  };
  //Zerar erros
  errors = [];
  document.getElementById('error').innerHTML = '';
  //Verificar se há algum campo vazio
  for (let chave in dataUser) {
    if (dataUser[chave] == '') errors.push('Nenhum campo pode estar vazio<br>');
  }
  errors.splice(1, 3); //Extrair apenas uma mensagem de erro

  if ((nameAndLastNameRegex.test(dataUser.name)) || (nameAndLastNameRegex.test(dataUser.lastname)))
       errors.push('Campo nome ou sobrenome não pode conter números/caracteres especiais<br>');
  if (!userAndPasswordRegex.test(dataUser.user) || dataUser.user.length < 5) errors.push('Usuário inválido<br>');
  if (!userAndPasswordRegex.test(dataUser.password) || dataUser.password.length < 7) errors.push('Senha inválida<br>');

  if (errors.length > 0) return errors.forEach(val => showError('error', val));

  return ipcRenderer.send('form-register', dataUser);
}
//Função para capturar e validar o formulário de Prompt
function handlePromptSubmit(event) {
  event.preventDefault();
  const formPrompt = new FormData(event.target);
  console.log(formPrompt)
  const dataPrompt = { code: formPrompt.get('code').trim() };

  if (errors.length + 1 <= 3) document.getElementById('errorText').innerHTML = `Tentativa: ${errors.length + 1}`;
  if (errors.length + 1 === 3) document.getElementById('errorText').innerHTML = 'Ultima Tentativa';
  if (errors.length + 1 === 4) return ipcRenderer.send('block-prompt');
  if (dataPrompt.code.length != 10) return errors.push('Acesso Negado');

  return ipcRenderer.send('auth-required', dataPrompt.code);
}

//Prever TODOS os eventos do documento
document.addEventListener('DOMContentLoaded', () => {
  //Capturar os cliques em elementos da página
  document.addEventListener('click', e => {
    const el = e.target;

    if (el.classList.contains('BtnRegister')) return ipcRenderer.send('open-prompt'); //Enviar mensagem para abrir o prompt
    if (el.classList.contains('back')) return ipcRenderer.send('go-back'); //Enviar evento para voltar a página principal
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
        handlePromptSubmit(e);
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
