export default function showError(idName, MsgError) {
  const element = document.getElementById(idName);
  element.innerHTML += MsgError;
}
