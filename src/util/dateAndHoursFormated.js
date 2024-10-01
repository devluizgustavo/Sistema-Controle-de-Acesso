function dateNowFormated() {
  const date = new Date;

  let day = date.getDate();        //Pegar o dia atual
  let mouth = date.getMonth() + 1; //Pegar o mês atual
  let year = date.getFullYear();   //Pegar o ano atual

  if (mouth < 10) {
    mouth = `0${mouth}`;
  } else if (day < 10) {
    day = `0${day}`;
  }

  return (day + '/' + mouth + '/' + year);
}

function hoursNowFormated() {
  const date = new Date;

  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  } else if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return (hours + "h" + minutes);
}

module.exports = { dateNowFormated, hoursNowFormated }

