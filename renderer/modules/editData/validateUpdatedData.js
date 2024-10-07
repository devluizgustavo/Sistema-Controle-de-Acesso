import showError from "../../utils/showError";
import ValidateCPF from "../peopleRegister/ValidateCPF";
import validator from "validator";

export default function (objData) {
  const errors = [];
  const regexChar = /^[a-zA-Z]+$/
  const cpf = new ValidateCPF(objData.cpf);

  document.getElementById('errorInEditPage').innerHTML = '';

  const date = new Date();
  const dtNascNumber = Number(objData.dtnasc.slice(0, -6))
  const minYear = date.getFullYear() - 13;
  const maxYear = date.getFullYear() - 150;

  if (!regexChar.test(objData.name.replace(/\s+/g, '')) || !regexChar.test(objData.lastname.replace(/\s+/g, ''))) errors.push('Campo Nome/Sobrenome não pode conter números ou caracteres especiais<br>');

  if (dtNascNumber > minYear || dtNascNumber < maxYear) errors.push('Data de Nascimento Inválida<br>');

  if (objData.rg !== 'Não Cadastrado') {
    if (objData.rg.length < 7 || objData.rg.length > 13) errors.push('O RG digitado é invalido<br>');
  }

  if (objData.cpf !== 'Não Cadastrado') {
    if (!cpf.validate()) errors.push('O CPF digitado é invalido<br>');
  }

  if (objData.tel !== 'Não Cadastrado' && objData.tel.length !== 15) errors.push('Número de Telefone Inválido<br>');
  if (objData.email !== 'Não Cadastrado' && !validator.isEmail(objData.email)) errors.push('E-mail inválido<br>');


  if (errors.length > 0) return errors.forEach(err => showError('errorInEditPage', err));

  return true;
} 