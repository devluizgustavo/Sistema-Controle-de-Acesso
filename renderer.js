const { ipcRenderer } = require("electron");

//Errors-by-Forms
let errors = [];

//Function for Process Login form
function handleLoginSubmit(event) {
  event.preventDefault();

  const formDataLogin = new FormData(event.target);
  const dataLogin = {
    user: formDataLogin.get('user').trim(),
    password: formDataLogin.get('password').trim()
  }

  errors = [];

  if (dataLogin.user == '' || dataLogin.password == '') {
    errors.push('Campos não podem ser vazios');
  } else if (dataLogin.user.length < 5 || dataLogin.password.length < 7) {
    errors.push('Dados digitados de forma incorreta');
  }


  if (errors.length > 0) {
    document.querySelector('.error-message').innerHTML = errors.join('<br>');
    ipcRenderer.send('camp-error');
    return;
  }

  return ipcRenderer.send('form-login', dataLogin);
}
//Function for Process Register form
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

  errors = [];

  for (let chave in dataUser) {
    if (dataUser[chave] == '') errors.push('Nenhum campo pode estar vazio');
  }
  errors.splice(1, 3);

  if ((nameAndLastNameRegex.test(dataUser.name)) || (nameAndLastNameRegex.test(dataUser.lastname)))
    errors.push('Campo nome ou sobrenome não pode conter números/caracteres especiais');

  if (!userAndPasswordRegex.test(dataUser.user)) errors.push('Usuário inválido');

  if (!userAndPasswordRegex.test(dataUser.password)) errors.push('Senha inválida');

  if (errors.length > 0) {
    document.querySelector('.error-message').innerHTML = errors.join('<br>');
    ipcRenderer.send('camp-error');
    return;
  }

  return ipcRenderer.send('form-register', dataUser);
}

function handlePromptSubmit(event) {
  event.preventDefault();
  const formPrompt = new FormData(event.target);
  const dataPrompt = { code: formRegister.get('code').trim() };

  if (errors.length + 1 <= 3) msgError.innerHTML = `Tentativa: ${errors.length + 1}`;
  if (errors.length + 1 === 3) msgError.innerHTML = 'Ultima Tentativa';
  if (errors.length + 1 === 4) {
    ipcRenderer.send('block-prompt');
    return;
  }

  if (dataPrompt.code === '' || dataPrompt.code.length !== 10) {
    errors.push('Acesso Negado');
    return;
  } else {
    ipcRenderer.send('access-success', dataPrompt.code);
    return;
  }
}

//Capture form events
document.addEventListener('submit', (e) => {
  const el = e.target;

  if (el.id === 'formLogin') {
    handleLoginSubmit(e);
  }
  if (el.id === 'formRegister') {
    handleRegisterSubmit(e);
  }
  if (el.id === 'formPrompt') {
    handlePromptSubmit(e);
  }
});

//Capture Events-From-MainProcess
document.addEventListener('click', e => {
  const el = e.target;
  //Elements PROMPT-HOME
  const msgError = document.getElementById('errorText');
  const inputCode = document.getElementById('codeInp');

  if (el.classList.contains('codeBtn')) { //Prompt-HomePage-Validation
    if (errors.length + 1 <= 3) msgError.innerHTML = `Tentativa: ${errors.length + 1}`;
    if (errors.length + 1 === 3) msgError.innerHTML = 'Ultima Tentativa';
    if (errors.length + 1 === 4) {
      ipcRenderer.send('block-prompt');
      return;
    }

    if (inputCode.value === '' || inputCode.value.length !== 10) {
      errors.push('Acesso Negado');
      return;
    } else {
      ipcRenderer.send('auth-required', inputCode.value);
      
      return;
    }
  }

  if (el.classList.contains('BtnRegister')) { //Button-Access-Prompt
    ipcRenderer.send('open-prompt');
  }

  if (el.classList.contains('back')) { //Button-Back-Page-Register
    ipcRenderer.send('go-back');
  }
})

//Capture ENTER from keyboard
document.addEventListener('keypress', e => {
  if (e.keyCode === 13) {
    document.addEventListener('submit', (e) => {
      const el = e.target;

      if (el.id === 'formLogin') {
        handleLoginSubmit(e);
      }
      if (el.id === 'formRegister') {
        handleRegisterSubmit(e);
      }
      if (el.id === 'formPrompt') {
        handlePromptSubmit(e);
      }
    });
  }
})