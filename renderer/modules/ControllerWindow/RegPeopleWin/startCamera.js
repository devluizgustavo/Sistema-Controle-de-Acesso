export default async function startCamera() {
  const video = document.getElementById('video');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch(e) {
    console.error('Erro ao acessar a camera', e);
  }
}