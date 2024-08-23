export default class ValidateCPF {
  constructor(cpfCapture) {
    Object.defineProperty(this, 'cpfClean', {
      get: function () {
        return cpfCapture.replace(/\D+/g, '');
      }
    });
  }

  validate() {
    if (!this.cpfClean) return false;
    if (this.cpfClean.length !== 11) return false;
    if (typeof this.cpfClean !== 'string') return false;
    if (this.cpfClean[0].repeat(this.cpfClean.length) === this.cpfClean) return false;

    const cpf9Digits = this.cpfClean.slice(0, 9);
    const final_dig1 = this.validateDigits(cpf9Digits);
    const final_dig2 = this.validateDigits(cpf9Digits + final_dig1);
    const cpfBefValidation = cpf9Digits + final_dig1 + final_dig2

    return cpfBefValidation === this.cpfClean;
  }

  validateDigits(cpf9Digits) {
    const cpfArray = Array.from(cpf9Digits);
    let start = cpfArray.length + 1;

    const sum = cpfArray.reduce((ac, val) => {
      ac += (val * start);
      start--;
      return ac;
    }, 0);

    const formula = 11 - (sum % 11);

    return formula > 9 ? '0' : String(formula);
  }
}