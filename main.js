// --- CONFIGURACIÓN DE FIREBASE (¡PEGA TUS DATOS AQUÍ!) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLn1XJyKkpgj_4CANQRUV173TtdImzP7U",
  authDomain: "peninsulamdt.firebaseapp.com",
  projectId: "peninsulamdt",
  storageBucket: "peninsulamdt.firebasestorage.app",
  messagingSenderId: "394789444178",
  appId: "1:394789444178:web:c0aa37665ca9445a35dd8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- FUNCIONES GLOBALES (Disponibles en el HTML) ---
window.loginPolicia = async () => {
    const placa = document.getElementById('placa').value;
    const pass = document.getElementById('pass-policia').value;
    const msg = document.getElementById('feedback-msg');

    msg.innerText = "Verificando credenciales...";
    msg.style.color = "yellow";

    try {
        // Consulta a la colección 'agentes'
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
        msg.innerText = "Error de conexión con la base de datos.";
    }
};

window.loginCiudadano = async () => {
    const dni = document.getElementById('dni-login').value;
    const pass = document.getElementById('pass-ciudadano').value;
    const msg = document.getElementById('feedback-msg');

    msg.innerText = "Accediendo al sistema biométrico...";
    msg.style.color = "yellow";

    try {
        // Consulta a 'ciudadanos' con DNI y CONTRASEÑA
        const q = query(collection(db, "ciudadanos"), where("dni", "==", dni), where("pass", "==", pass));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            
            // Rellenar el "Móvil" con los datos
            document.getElementById('dni-nombre').innerText = data.nombre;
            document.getElementById('dni-numero').innerText = data.dni;
            const deudaElem = document.getElementById('dni-deuda');
            deudaElem.innerText = data.deudas + "€";
            deudaElem.style.color = data.deudas > 0 ? "red" : "lime";

            msg.innerText = "";
            document.getElementById('movil-view').style.display = 'flex';
        } else {
            msg.innerText = "Contraseña de DNI incorrecta o Ciudadano no registrado.";
            msg.style.color = "red";
        }
    } catch (e) {
        console.error(e);
        msg.innerText = "Error buscando ciudadano.";
    }
};

// --- FUNCIÓN PARA CREAR DATOS INICIALES (SOLO USAR UNA VEZ) ---
window.crearDatosPrueba = async () => {
    const clave = prompt("Escribe la clave de admin para crear la base de datos:");
    if(clave !== "admin123") return alert("Clave incorrecta");

    try {
        // Crear Agentes
        await addDoc(collection(db, "agentes"), { placa: "CF-001", pass: "Jorge0124", rango: "Co-Fundador", discordId: "803332911926739005" });
        await addDoc(collection(db, "agentes"), { placa: "FN-001", pass: "Alex0124", rango: "Fundador", discordId: "739425840214835270" });
        
        // Crear Ciudadanos
        await addDoc(collection(db, "ciudadanos"), { dni: "12345678A", pass: "1234", nombre: "Pepe Garcia", historial: "Limpio", deudas: 0 });
        await addDoc(collection(db, "ciudadanos"), { dni: "87654321B", pass: "0000", nombre: "Lucia Fernandez", historial: "Robo", deudas: 500 });
        
        alert("Datos creados en Firebase exitosamente.");
    } catch (e) {
        alert("Error creando datos: " + e.message);
    }
};

// --- LOGICA DEL PANEL (SISTEMA.HTML) ---
if (window.location.pathname.includes("sistema.html")) {
    const usuario = localStorage.getItem('usuarioActivo');
    if (!usuario) window.location.href = "index.html";
    
    document.getElementById('user-badge').innerText = "Agente: " + usuario;

    // Buscar Ciudadano (Desde Policia)
    const btnBuscar = document.getElementById('btn-buscar');
    if(btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const input = document.getElementById('input-busqueda').value;
            const resDiv = document.getElementById('resultados-busqueda');
            resDiv.innerHTML = "Buscando en Archivos...";

            // Consulta flexible (por DNI)
            const q = query(collection(db, "ciudadanos"), where("dni", "==", input));
            const querySnapshot = await getDocs(q);

            resDiv.innerHTML = "";
            if (querySnapshot.empty) {
                resDiv.innerHTML = "<p style='color:orange'>No se encontraron ciudadanos.</p>";
            } else {
                querySnapshot.forEach((doc) => {
                    const c = doc.data();
                    resDiv.innerHTML += `
                        <div style="background: #334155; padding: 20px; border-radius: 10px; border: 1px solid #3b82f6; margin-bottom: 10px;">
                            <h3 style="color: #3b82f6;">${c.nombre}</h3>
                            <p><strong>DNI:</strong> ${c.dni}</p>
                            <p><strong>Historial:</strong> ${c.historial}</p>
                            <p><strong>Deuda:</strong> ${c.deudas}€</p>
                        </div>
                    `;
                });
            }
        });
    }

    // Cargar Agentes
    const cargarTablaAgentes = async () => {
        const tbody = document.getElementById('tabla-agentes-body');
        if(!tbody) return;
        const q = query(collection(db, "agentes"));
        const snap = await getDocs(q);
        
        tbody.innerHTML = "";
        snap.forEach(doc => {
            const a = doc.data();
            tbody.innerHTML += `<tr><td>${a.placa}</td><td>${a.rango}</td><td>${a.discordId}</td></tr>`;
        });
    };
    
    // Si estamos en la sección agentes, cargarlos (Simulado con click en menu)
    window.verSeccion = (id) => {
        document.getElementById('grid-principal').style.display = 'none';
        document.querySelectorAll('.table-container').forEach(e => e.style.display = 'none');
        document.getElementById('sec-' + id).style.display = 'block';
        if(id === 'agentes') cargarTablaAgentes();
    }
}
