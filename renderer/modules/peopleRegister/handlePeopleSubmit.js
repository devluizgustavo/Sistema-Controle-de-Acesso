import ValidateCPF from './ValidateCPF.js';
import showError from '../../utils/showError.js'

class RegPeopleForm {
  constructor() {
    this.form = document.getElementById('formCadPeople');
    this.errors = [];
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getDataAndValidate();
  }

  async getDataAndValidate() {
    try {
      const form = new FormData(this.form);
      const data = {
        name: form.get('name')?.trim() || '',
        lastname: form.get('lastname')?.trim() || '',
        cpf: form.get('cpf')?.trim() || '',
        rg: form.get('rg')?.trim() || '',
        org: form.get('org')?.trim() || '',
        dtnasc: form.get('dtnasc')?.trim() || '',
        sexo: document.getElementById('id_type_sexo').value,
        tel: form.get('tel')?.trim() || '',
        email: form.get('email')?.trim() || '',
      };

      const checked = this.checkCamps(data);
      if (!checked) {
        return this.errors.forEach((val) => { showError('error-message', val) })
      };

      const isValid = await window.electron.getCadPeople(data);
      if (!isValid) return this.cleanInputsBefVal();
    } catch (e) {
      console.error('Erro ao tentar a comunicação com o sistema', e);
    }
  }

  checkCamps(data) {
    const selectIdent = document.getElementById('id_type_identific');
    let valid = false;

    for (let errorText of this.form.querySelectorAll('.error-text')) {
      errorText.remove();
    }

    this.errors = [];
    document.getElementById("error-message").innerHTML = '';

    if (data.name === '' || data.lastname === '') this.errors.push('Campos: Nome/Sobrenome não podem estar vazios<br>');
    if (!selectIdent.value) this.errors.push('É necessário que ao menos CPF ou RG seja selecionado<br>');
    if (!data.cpf && !data.rg && !data.org) this.errors.push('Você deve preencher pelo menos um dos campos: CPF ou RG<br>');
    if (!data.dtnasc) this.errors.push('É necessário que a data de nascimento seja preenchida<br>');
    if (!data.sexo) this.errors.push('É necessário que identifique o gênero<br>');
    if (data.email !== '') {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(data.email)) this.errors.push('Email Inválido<br>');
    }
    if (data.tel !== '') {
      if (data.tel.length < 14 || data.tel.length > 15) this.errors.push('Número de contato incorreto<br>');
    }
    if (data.org !== '') {
      const regexOrg = /^[a-zA-Z]+$/;
      if (!regexOrg.test(data.org)) this.errors.push('Orgão expeditor inválido');
    }

    const Rg_isNotNull = data.rg && !data.cpf;  // Verifica se o RG e o Orgão Expeditor estão preenchidos e  o CPF está vazio
    const CPF_isNotNull = !data.rg && data.cpf;  // Verifica se o RG e o Orgão Expeditor estão preenchidos e  o CPF está vazio
    const All_isNotNull = data.rg && data.cpf;  // Verifica se o RG e o Orgão Expeditor estão preenchidos e  o CPF também
    if (Rg_isNotNull || CPF_isNotNull || All_isNotNull) {        // Se qualquer uma das condições for verdadeira, define a validade como verdadeiro
      valid = true;
    }

    if (Rg_isNotNull) {
      if (data.rg.length < 7 || data.rg.length > 13) this.errors.push('RG inválido');
    }

    if (CPF_isNotNull) {
      const cpf_inst = new ValidateCPF(data.cpf)
      if (cpf_inst.validate()) {
        valid = true;
      } else {
        this.errors.push('O CPF digitado é invalido');
      }
    }

    const isCaracterSpecial = /^[A-Za-zà-üÀ-ÜçÇ~\s]*$/
    if (!isCaracterSpecial.test(data.name) || !isCaracterSpecial.test(data.lastname)) this.errors.push('Nome ou Sobrenome não pode conter caracteres especiais');

    return valid === true && this.errors.length === 0 ? true : false;
  }



  cleanInputsBefVal() {
    for (let input of document.querySelectorAll('input')) {
      input.value = "";
    }

    for (let select of document.querySelectorAll('select')) {
      select.value = "";
    };
  }
}

const handlePeopleForm = new RegPeopleForm();

export default handlePeopleForm;
