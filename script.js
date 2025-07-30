// CONFIGURACIÓN FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDFJHWM6MboWoka_ocLIBDsWucD685RQQU",
  authDomain: "psico-vieco-53844.firebaseapp.com",
  projectId: "psico-vieco-53844",
  storageBucket: "psico-vieco-53844.firebasestorage.app",
  messagingSenderId: "45686787795",
  appId: "1:45686787795:web:827a13bb690dc9a70b8e26",
  measurementId: "G-4959ZGP931"
};

// CARGAR SDKs de Firebase (solo si estás en index.html, si no, ignora esto)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// INICIALIZAR
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LOGIN
document.getElementById("login-btn").addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("login-section").classList.add("hidden");
    })
    .catch(() => {
      document.getElementById("login-error").textContent = "Correo o contraseña incorrectos";
    });
});

// SESIÓN
onAuthStateChanged(auth, (user) => {
  if (user) {
    const esPsico = user.email === "sistemapsicologicocvo@gmail.com";
    if (esPsico) {
      document.getElementById("citas-section").classList.remove("hidden");
      cargarCitas(true);
    } else {
      document.getElementById("form-section").classList.remove("hidden");
    }
  }
});

// GUARDAR CITA
document.getElementById("cita-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const motivo = document.getElementById("motivo").value;

  const dia = new Date(`${fecha}T${hora}`).getDay();
  const horaNum = parseInt(hora.split(":")[0]);

  if (dia === 0 || dia === 6 || horaNum < 6 || horaNum >= 18) {
    alert("Solo de lunes a viernes entre 6:00 a.m. y 6:00 p.m.");
    return;
  }

  await addDoc(collection(db, "citas"), {
    nombre,
    fecha,
    hora,
    motivo,
    estado: "Pendiente"
  });

  alert("Cita guardada");
  e.target.reset();
});

// CARGAR CITAS
async function cargarCitas(esPsico) {
  const lista = document.getElementById("citas-list");
  lista.innerHTML = "";
  const snapshot = await getDocs(collection(db, "citas"));

  snapshot.forEach((docSnap) => {
    const c = docSnap.data();
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.fecha}</td>
      <td>${c.hora}</td>
      <td>${c.motivo}</td>
      <td>${c.estado}</td>
      <td>
        ${esPsico ? `
          <select onchange="cambiarEstado('${docSnap.id}', this.value)">
            <option value="">--</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        ` : ""}
      </td>
    `;

    lista.appendChild(fila);
  });
}

// CAMBIAR ESTADO
window.cambiarEstado = async function(id, nuevo) {
  const ref = doc(db, "citas", id);
  await updateDoc(ref, { estado: nuevo });
  alert("Estado actualizado");
  cargarCitas(true);
};


