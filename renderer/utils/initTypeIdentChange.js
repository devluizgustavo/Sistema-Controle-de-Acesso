// Função para inicializar a troca de campos de input baseados em seleção
export default async function initTypeIdentificationChange() {
  document.getElementById('id_type_identific').addEventListener('change', async function () {
    const cpfField = document.getElementById('cpf_field');
    const rgField = document.getElementById('rg_field');
    const orgField = document.getElementById('org_field');

    cpfField.value = '';
    rgField.value = '';
    orgField.value = '';

    switch (this.value) {
      case 'cpf':
        cpfField.style.display = 'inline-block';
        rgField.style.display = 'none';
        orgField.style.display = 'none';
        break;
      case 'rg':
        cpfField.style.display = 'none';
        rgField.style.display = 'inline-block';
        orgField.style.display = 'inline-block';
        break;
      default:
        cpfField.style.display = 'inline-block';
        rgField.style.display = 'none';
        orgField.style.display = 'none';
    }
  });
}