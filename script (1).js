import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFJHWM6MboWoka_ocLIBDsWucD685RQQU",
  authDomain: "psico-vieco-53844.firebaseapp.com",
  projectId: "psico-vieco-53844",
  storageBucket: "psico-vieco-53844.appspot.com",
  messagingSenderId: "45686787795",
  appId: "1:45686787795:web:827a13bb690dc9a70b8e26",
  measurementId: "G-4959ZGP931"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mostrar formulario al hacer clic
document.getElementById("showForm").addEventListener("click", () => {
  document.getElementById("citaForm").classList.remove("hidden");
});

// Guardar cita
document.getElementById("citaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value;

  const dia = new Date(`${fecha}T${hora}`).getDay();
  const horaNum = parseInt(hora.split(":")[0]);

  if (dia === 0 || dia === 6 || horaNum < 6 || horaNum >= 18) {
    alert("Solo se pueden agendar citas de lunes a viernes entre 6:00 a.m. y 6:00 p.m.");
    return;
  }

  await addDoc(collection(db, "citas"), {
    nombre,
    correo,
    fecha,
    hora,
    motivo,
    estado: "Pendiente"
  });

  alert("Cita guardada exitosamente");
  e.target.reset();
  cargarCitas();
});

// Cargar citas guardadas
async function cargarCitas() {
  const lista = document.getElementById("listaCitas");
  lista.innerHTML = "";
  const snapshot = await getDocs(collection(db, "citas"));

  snapshot.forEach((docSnap) => {
    const c = docSnap.data();
    const item = document.createElement("li");
    item.innerHTML = `
      <strong>${c.nombre}</strong><br>
      ${c.fecha} a las ${c.hora}<br>
      Estado: ${c.estado}<br>
      Motivo: ${c.motivo}
    `;
    lista.appendChild(item);
  });
}

window.addEventListener("load", cargarCitas);


