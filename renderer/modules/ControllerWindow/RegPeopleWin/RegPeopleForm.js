import ValidateCPF from './ValidateCPF.js';
import showError from '../../../utils/showError.js'


class RegPeopleForm {
  constructor() {
    this.form = document.getElementById('formCadPeople');
    this.errors = [];
  }

  async handleSubmit(event) {
    try {
      event.preventDefault();
      this.getData();
    } catch (e) {
      console.error('Ocorreu um erro ao tentar efetuar o cadastro', e);
    }
  }

  getData() {
    const form = new FormData(this.form);
    const data = {
      name: form.get('name')?.trim() || '',
      lastname: form.get('lastname')?.trim() || '',
      cpf: form.get('cpf')?.trim() || '',
      rg: form.get('rg')?.trim() || '',
      org: form.get('org')?.trim() || '',
      dtnasc: form.get('dtnasc')?.trim() || '',
      tel: form.get('tel')?.trim() || '',
      email: form.get('email')?.trim() || '',
    };

    const checked = this.checkCamps(data);
    if (!checked) {
      this.errors.forEach((val) => { showError('error-message', val) })
    };
  }

  checkCamps(data) {
    const selectIdent = document.getElementById('id_type_identific');
    const selectSexo = document.getElementById('id_type_sexo')
    let valid = false;

    for (let errorText of this.form.querySelectorAll('.error-text')) {
      errorText.remove();
    }

    this.errors = [];
    document.getElementById("error-message").innerHTML = '';

    if (!selectIdent.value) this.errors.push('É necessário que ao menos CPF ou RG seja selecionado<br>');
    if (!selectSexo.value) this.errors.push('É necessário que identifique o gênero<br>');
    if (data.name === '' || data.lastname === '') this.errors.push('Campos: Nome/Sobrenome não podem estar vazios<br>');
    if (!data.cpf && !data.rg && !data.org) this.errors.push('Você deve preencher pelo menos um dos campos: CPF ou RG<br>');
    if (!data.dtnasc) this.errors.push('É necessário que a data de nascimento seja preenchida');

    const Rg_isNotNull = data.rg && data.org && !data.cpf;  // Verifica se o RG e o Orgão Expeditor estão preenchidos e  o CPF está vazio
    const All_isNotNull = data.rg && data.org && data.cpf;  // Verifica se o RG e o Orgão Expeditor estão preenchidos e  o CPF também
    if (Rg_isNotNull || All_isNotNull) {                    // Se qualquer uma das condições for verdadeira, define a validade como verdadeiro
      valid = true;
    }

    if (data.cpf !== '') {
      const cpf_inst = new ValidateCPF(data.cpf)
      if (cpf_inst.validate()) {
        valid = true;
      } else {
        this.errors.push('O CPF digitado é invalido');
      }
    }

    return valid === true && this.errors.length === 0 ? true : false;
  }
}

const handlePeopleForm = new RegPeopleForm();

export default handlePeopleForm;
