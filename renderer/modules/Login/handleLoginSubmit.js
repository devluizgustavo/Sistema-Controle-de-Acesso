import showError from '../../utils/showError.js';
let errors = [];

export default async function handleLoginSubmit(event) {
  try {
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

    const res = await window.electron.getLogin(dataLogin);

    if (res) window.electron.send('success-login');
  } catch (e) {
    console.log('Ocorreu um erro ao tentar efetuar o login', e);
  }
}

