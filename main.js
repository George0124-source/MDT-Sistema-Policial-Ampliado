// main.js

// --- 1. PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLn1XJyKkpgj_4CANQRUV173TtdImzP7U",
  authDomain: "peninsulamdt.firebaseapp.com",
  projectId: "peninsulamdt",
  storageBucket: "peninsulamdt.firebasestorage.app",
  messagingSenderId: "394789444178",
  appId: "1:394789444178:web:c0aa37665ca9445a35dd8b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Sistema cargado. Esperando acciones...");

// --- 2. FUNCIÓN PARA CREAR DATOS (ADMIN) ---
// La adjuntamos a 'window' para que el HTML la encuentre
window.crearDatosPrueba = async () => {
    console.log("Botón presionado. Solicitando clave...");
    
    const clave = prompt("Introduce la CLAVE MAESTRA para resetear la base de datos:");
    
    // VERIFICACIÓN DE LA CONTRASEÑA QUE PEDISTE
    if(clave !== "JorgeMorales2708...") {
        alert("Clave incorrecta. Acceso denegado.");
        return;
    }

    try {
        console.log("Clave correcta. Escribiendo en Firebase...");
        alert("Iniciando creación de datos... Espere.");

        // Crear Agentes (Jorge y Alex)
        await addDoc(collection(db, "agentes"), { 
            placa: "CF-001", 
            pass: "Jorge0124", 
            rango: "Co-Fundador", 
            discordId: "803332911926739005" 
        });

        await addDoc(collection(db, "agentes"), { 
            placa: "FN-001", 
            pass: "Alex0124", 
            rango: "Fundador", 
            discordId: "739425840214835270" 
        });
        
        // Crear Ciudadanos de prueba
        await addDoc(collection(db, "ciudadanos"), { 
            dni: "12345678A", 
            pass: "1234", 
            nombre: "Pepe Garcia", 
            historial: "Limpio", 
            deudas: 0 
        });

        await addDoc(collection(db, "ciudadanos"), { 
            dni: "87654321B", 
            pass: "0000", 
            nombre: "Lucia Fernandez", 
            historial: "Robo a mano armada", 
            deudas: 500 
        });
        
        console.log("Datos creados correctamente.");
        alert("¡ÉXITO! Datos creados en Firebase. Ya puedes iniciar sesión.");

    } catch (e) {
        console.error("Error de Firebase:", e);
        alert("ERROR: " + e.message + ". \nRevisa la consola (F12) y asegúrate de que copiaste bien la configuración de Firebase.");
    }
};

// --- 3. FUNCIONES DE LOGIN ---

window.loginPolicia = async () => {
    const placa = document.getElementById('placa').value;
    const pass = document.getElementById('pass-policia').value;
    const msg = document.getElementById('feedback-msg');

    msg.innerText = "Verificando credenciales...";
    msg.style.color = "yellow";

    try {
        const q = query(collection(db, "agentes"), where("placa", "==", placa), where("pass", "==", pass));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const agente = querySnapshot.docs[0].data();
            localStorage.setItem('usuarioActivo', agente.placa);
            localStorage.setItem('rangoActivo', agente.rango);
            window.location.href = "sistema.html";
        } else {
            msg.innerText = "Acceso denegado: Placa o contraseña incorrecta.";
            msg.style.color = "red";
        }
    } catch (e) {
        console.error(e);
        msg.innerText = "Error de conexión. Revisa la consola.";
    }
};

window.loginCiudadano = async () => {
    const dni = document.getElementById('dni-login').value;
    const pass = document.getElementById('pass-ciudadano').value;
    const msg = document.getElementById('feedback-msg');

    msg.innerText = "Accediendo...";
    
    try {
        const q = query(collection(db, "ciudadanos"), where("dni", "==", dni), where("pass", "==", pass));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            
            document.getElementById('dni-nombre').innerText = data.nombre;
            document.getElementById('dni-numero').innerText = data.dni;
            const deudaElem = document.getElementById('dni-deuda');
            deudaElem.innerText = data.deudas + "€";
            deudaElem.style.color = data.deudas > 0 ? "red" : "lime";

            msg.innerText = "";
            document.getElementById('movil-view').style.display = 'flex';
        } else {
            msg.innerText = "DNI o Contraseña incorrectos.";
            msg.style.color = "red";
        }
    } catch (e) {
        console.error(e);
        msg.innerText = "Error al buscar ciudadano.";
    }
};

// Lógica extra para sistema.html (si aplica)
if (window.location.pathname.includes("sistema.html")) {
    // ... (El código del sistema.html se mantiene igual que te pasé antes) ...
    // Si necesitas que te lo reponga, dímelo, pero con lo de arriba basta para arreglar el botón.
}
