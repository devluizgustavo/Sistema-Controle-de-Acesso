import showError from "../../utils/showError";
let errors = [];

export default async function handleRegisterSubmit(event) {
  try {
    event.preventDefault();
    const nameAndLastNameRegex = /[^a-zA-Z\s]/g;
    const userRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const formRegister = new FormData(event.target);
    const dataUser = {
      name: formRegister.get('name').trim(),
      lastname: formRegister.get('lastname').trim(),
      user: formRegister.get('user').trim(),
      password: formRegister.get('password').trim(),
      sexo: formRegister.get('gender')
    };
    //Zerar erros
    errors = [];
    document.getElementById('error').innerHTML = '';
    //Verificar se há algum campo vazio
    for (let chave in dataUser) {
      if (dataUser[chave] == '') errors.push('Nenhum campo pode estar vazio<br>');
    }
    errors.splice(1, 3); //Extrair apenas uma mensagem de erro

    if (dataUser.sexo === null) errors.push('Por favor, identifique o seu gênero<br>');
    if ((nameAndLastNameRegex.test(dataUser.name)) || (nameAndLastNameRegex.test(dataUser.lastname)))
      errors.push('Campo nome ou sobrenome não pode conter números/caracteres especiais<br>');
    if (!userRegex.test(dataUser.user) || dataUser.user.length < 5) errors.push('Usuário inválido<br>');
    if (!passwordRegex.test(dataUser.password) || dataUser.password.length < 7) errors.push('Senha inválida<br>');
    if (errors.length > 0) return errors.forEach(val => showError('error', val));

    const res = await window.electron.getRegister(dataUser);

    if (res) return window.electron.send('success-register');
  } catch (e) {
    console.error('Ocorreu um erro ao tentar cadastrar', e);
  }
}