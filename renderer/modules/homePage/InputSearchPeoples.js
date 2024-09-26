import validator from "validator";
import showMaskCPF, { showMaskRG } from "../../utils/showMask";
import funcCreateRow from '../homePage/funcCreateRow.js';
import invokeAllAccessInTable from './invokeAllAccessInTable.js';

const input = document.getElementById('search');

export default async function funcInitInput() {
  input.addEventListener('input', async (e) => {
    document.querySelector('#text-error-table').innerHTML = '';
    if (e.target.value === '') return await invokeAllAccessInTable();

    cleanCampIfCaracterEsp();
    isNumberOrString();

    const valueClean = input.value.replace(/[-.]/g, '');
    await findAllRegistersAndResponse(valueClean);
  })
}

//Criar uma função que compare na tabela se o valor do input existe, e se caso existir, traga os dados, caso não, mostre que não existe o dado
async function findAllRegistersAndResponse(valueInput) {
  try {
    const RecordsFound = await window.electron.findRecordsBySearchInput(valueInput);

    if (RecordsFound.length === 0) {
      const tableBody = document.querySelector('#access-table tbody');
      tableBody.innerHTML = '';      
      return showMessageError();
    }

    funcCreateRow(RecordsFound);
  } catch (e) {
    console.error('Erro ao tentar a comunicação com o back-end:', e);
  }
}

//Filtar campo de input, para que não seja possível digitar caracteres especiais
function cleanCampIfCaracterEsp() {
  const regexCaracterEsp = /[^\w\s]/g
  const newValue = input.value.split('').filter(char => !regexCaracterEsp.test(char)).join('');
  input.value = newValue;
}

//Checar campo input, para saber se a busca será por nome, rg ou cpf
function isNumberOrString() {
  if (validator.isAlpha(input.value[0])) {
    const regexOnlyString = /[^a-zA-Z\s]/g;
    const newValueIfString = input.value.split('').filter(char => !regexOnlyString.test(char)).join('');

    input.value = newValueIfString;
  } else if (validator.isNumeric(input.value[0])) {
    const regexOnlyNumbers = /[^0-9]/g;
    const newValueIfNumber = input.value.split('').filter(char => !regexOnlyNumbers.test(char)).join('');

    input.value = newValueIfNumber;

    checkLengthAndApplyMask(input.value);
  }
}

//Checar o tamanho do que foi digitado e aplicar mascara 57.090.985
function checkLengthAndApplyMask() {
  if (input.value.length >= 8 && input.value.length <= 10) {
    input.value = showMaskRG(input.value);
  } else if (input.value.length === 11) {
    input.value = showMaskCPF(input.value);
  }
}

//Mostrar mensagem de não encontrado
function showMessageError() {
  const divError = document.querySelector('#text-error-table');
  divError.innerHTML = 'Nenhum Cadastro foi Encontrado';
}