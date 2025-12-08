// main.js

// 1. CONFIGURACIÓN FIREBASE (¡PEGA TUS DATOS AQUÍ!)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLn1XJyKkpgj_4CANQRUV173TtdImzP7U",
  authDomain: "peninsulamdt.firebaseapp.com",
  projectId: "peninsulamdt",
  storageBucket: "peninsulamdt.firebasestorage.app",
  messagingSenderId: "394789444178",
  appId: "1:394789444178:web:c0aa37665ca9445a35dd8b"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 2. BASE DE DATOS: CÓDIGO PENAL (BOE)
// ==========================================
const codigoPenal = [
    // --- CAPÍTULO I: SEGURIDAD VIAL ---
    { id: "1.0", titulo: "No tener DNI/NIE registrado", multa: 1500, meses: 0 },
    { id: "1.0.1", titulo: "No llevar DNI/NIE o Carnet", multa: 250, meses: 0 },
    { id: "1.0.2", titulo: "Conducción sin Carnet", multa: 1750, meses: 0 },
    { id: "1.0.3", titulo: "Conducción sin seguro activo", multa: 1750, meses: 0 },
    { id: "1.0.4", titulo: "Conducción con carnet caducado", multa: 1250, meses: 0 },
    { id: "1.0.5", titulo: "Conducción con seguro caducado", multa: 1250, meses: 0 },
    { id: "1.1", titulo: "Abuso del claxon", multa: 45, meses: 0 },
    { id: "1.2", titulo: "Pisar línea continua", multa: 65, meses: 0 },
    { id: "1.2.1", titulo: "Adelantamiento en línea continua", multa: 100, meses: 0 },
    { id: "1.2.2", titulo: "Giro indebido (Línea continua)", multa: 95, meses: 0 },
    { id: "1.3", titulo: "Circular en sentido contrario", multa: 150, meses: 0 },
    { id: "1.4", titulo: "Estacionamiento prohibido", multa: 50, meses: 0 },
    { id: "1.4.1", titulo: "Estacionamiento doble fila", multa: 75, meses: 0 },
    { id: "1.5", titulo: "Obstruir la circulación", multa: 175, meses: 0 },
    { id: "1.6", titulo: "Saltarse señal de parada", multa: 75, meses: 0 },
    { id: "1.7", titulo: "No ceder paso a emergencias", multa: 850, meses: 0 },
    { id: "1.8", titulo: "Marcha atrás peligrosa", multa: 125, meses: 0 },
    { id: "1.9", titulo: "Evadir control policial", multa: 600, meses: 0 },
    { id: "1.9.1", titulo: "Fuga de control policial", multa: 1350, meses: 0 },
    { id: "1.10", titulo: "Exceso velocidad (Urbana)", multa: 750, meses: 0 },
    { id: "1.10.1", titulo: "Exceso velocidad (Interurbana)", multa: 650, meses: 0 },
    { id: "1.10.2", titulo: "Exceso velocidad (Autovía)", multa: 500, meses: 0 },
    { id: "1.11", titulo: "Conducción con fallos", multa: 350, meses: 0 },
    { id: "1.12", titulo: "Sin luces de noche", multa: 150, meses: 0 },
    { id: "1.13", titulo: "Sin luces en túnel", multa: 75, meses: 0 },
    { id: "1.13.1", titulo: "Luces largas en túnel", multa: 25, meses: 0 },
    { id: "1.14", titulo: "Entrar zonas restringidas (Vehículo)", multa: 300, meses: 0 },
    { id: "1.15", titulo: "Conducción bajo estupefacientes", multa: 1500, meses: 3 },
    { id: "1.15.1", titulo: "Conducción bajo alcohol", multa: 1250, meses: 3 },
    { id: "1.16", titulo: "Siniestro (1 implicado)", multa: 0, meses: 0 },
    { id: "1.16.1", titulo: "Siniestro (2 implicados)", multa: 250, meses: 0 },
    { id: "1.16.2", titulo: "Siniestro múltiple", multa: 500, meses: 0 },
    { id: "1.17", titulo: "Provocar/Insultar al volante", multa: 950, meses: 0 },
    { id: "1.18", titulo: "Dañar mobiliario público (Coche)", multa: 1050, meses: 0 },
    { id: "1.18.1", titulo: "Dañar mobiliario privado (Coche)", multa: 1500, meses: 0 },
    { id: "1.19", titulo: "Intento atropello civil", multa: 1700, meses: 0 },
    { id: "1.19.1", titulo: "Intento atropello civil y fuga", multa: 7000, meses: 0 },
    { id: "1.20", titulo: "Intento atropello funcionario", multa: 2000, meses: 0 },
    { id: "1.20.1", titulo: "Intento atropello funcionario y fuga", multa: 10000, meses: 0 },
    { id: "1.21", titulo: "Atropello a civil", multa: 5000, meses: 0 },
    { id: "1.21.1", titulo: "Atropello civil y fuga", multa: 7500, meses: 12 },
    { id: "1.22", titulo: "Atropello a funcionario", multa: 7500, meses: 15 },
    { id: "1.22.1", titulo: "Atropello funcionario y fuga", multa: 10000, meses: 15 },
    { id: "1.23", titulo: "Crear carrera ilegal", multa: 50000, meses: 6 },
    { id: "1.23.1", titulo: "Participar carrera ilegal", multa: 25000, meses: 1 },
    { id: "1.24", titulo: "Sin cinturón de seguridad", multa: 500, meses: 0 },
    { id: "1.25", titulo: "Persona en maletero", multa: 2500, meses: 0 },
    { id: "1.26", titulo: "Iniciar persecución policial", multa: 7000, meses: 0 },
    { id: "1.27", titulo: "Iniciar persecución", multa: 2000, meses: 0 },
    { id: "1.28", titulo: "Tirar objetos ventanilla", multa: 750, meses: 0 },
    { id: "1.29", titulo: "Conducción sin matrícula", multa: 1000, meses: 0 },
    { id: "1.29.1", titulo: "Matrícula no registrada", multa: 250, meses: 0 },
    { id: "1.29.2", titulo: "Matrícula tapada/mal estado", multa: 750, meses: 0 },
    { id: "1.30", titulo: "Alterar taxímetro", multa: 1500, meses: 0 },
    { id: "1.31", titulo: "Niño sin supervisión en coche", multa: 3000, meses: 0 },
    { id: "1.32", titulo: "No usar intermitentes", multa: 200, meses: 0 },
    { id: "1.32.1", titulo: "Uso indebido intermitentes", multa: 600, meses: 0 },
    { id: "1.33", titulo: "Uso de móvil al volante", multa: 3500, meses: 0 },
    { id: "1.34", titulo: "Conducir siendo menor", multa: 650, meses: 0 },
    { id: "1.35", titulo: "No guardar distancia seguridad", multa: 450, meses: 0 },
    { id: "1.36", titulo: "Conducción temeraria", multa: 2000, meses: 0 },
    { id: "1.37", titulo: "Música demasiado alta", multa: 350, meses: 0 },
    { id: "1.38", titulo: "Posesión elementos ilícitos (Coche)", multa: 1500, meses: 0 },
    { id: "1.39", titulo: "Transporte inflamable inadecuado", multa: 650, meses: 0 },
    { id: "1.39.1", titulo: "Transporte inflamable sin permiso", multa: 1500, meses: 0 },
    { id: "1.40", titulo: "Uso indebido aeronave", multa: 15000, meses: 12 },
    // --- CAPÍTULO II: ROBOS ---
    { id: "2.0", titulo: "Hurto a civil", multa: 500, meses: 0 },
    { id: "2.0.1", titulo: "Hurto a civil (Arma blanca)", multa: 1000, meses: 24 },
    { id: "2.0.2", titulo: "Hurto a civil (Arma fuego)", multa: 1500, meses: 36 },
    { id: "2.1", titulo: "Hurto a funcionario", multa: 1000, meses: 0 },
    { id: "2.5", titulo: "Robo a locales", multa: 5500, meses: 48 },
    { id: "2.6", titulo: "Robo Joyería", multa: 45000, meses: 180 },
    { id: "2.7", titulo: "Robo Banco", multa: 250000, meses: 264 },
    // ... (Puedes añadir el resto de tu lista aquí, he puesto los más importantes para no saturar el código) ...
    { id: "3.2", titulo: "Violencia de género", multa: 450, meses: 3 },
    { id: "3.5", titulo: "Agresión a funcionario", multa: 1000, meses: 0 },
    { id: "4.0", titulo: "Posesión arma ilegal", multa: 500, meses: 1 },
    { id: "5.2", titulo: "Homicidio civil", multa: 75000, meses: 180 }
];

// ==========================================
// 3. FUNCIONES DE LÓGICA
// ==========================================

// --- REGISTRO DE CIUDADANOS (SELF-SERVICE) ---
window.abrirRegistro = () => {
    document.getElementById('modal-registro').style.display = 'flex';
}
window.cerrarRegistro = () => {
    document.getElementById('modal-registro').style.display = 'none';
}

window.registrarCiudadanoPublico = async () => {
    const nombre = document.getElementById('new-nombre').value;
    const dni = document.getElementById('new-dni').value.toUpperCase();
    const pass = document.getElementById('new-pass').value;
    const msg = document.getElementById('reg-msg');

    if(!nombre || !dni || !pass) {
        msg.innerText = "Rellena todos los campos.";
        msg.style.color = "orange";
        return;
    }

    msg.innerText = "Comprobando DNI...";
    
    try {
        const q = query(collection(db, "ciudadanos"), where("dni", "==", dni));
        const snap = await getDocs(q);

        if(!snap.empty) {
            msg.innerText = "Este DNI ya está registrado.";
            msg.style.color = "red";
            return;
        }

        await addDoc(collection(db, "ciudadanos"), {
            nombre: nombre,
            dni: dni,
            pass: pass,
            historial: "Limpio",
            deudas: 0
        });

        alert("¡Cuenta Creada! Ahora inicia sesión.");
        window.cerrarRegistro();
    } catch(e) {
        msg.innerText = "Error: " + e.message;
    }
};

// --- RENDERIZAR CÓDIGO PENAL ---
window.cargarLeyes = () => {
    const tbody = document.getElementById('tabla-leyes-body');
    if(!tbody) return;

    tbody.innerHTML = "";
    codigoPenal.forEach(ley => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${ley.id}</strong></td>
                <td>${ley.titulo}</td>
                <td style="color: #f87171">${ley.multa}€</td>
                <td>${ley.meses > 0 ? ley.meses + " meses" : "Sin prisión"}</td>
            </tr>
        `;
    });
};

// --- BUSQUEDA Y MULTAS (POLICÍA) ---
window.buscarCiudadanoPol = async () => {
    const input = document.getElementById('input-busqueda').value;
    const resDiv = document.getElementById('resultados-busqueda');
    resDiv.innerHTML = "Buscando...";

    const q = query(collection(db, "ciudadanos"), where("dni", "==", input));
    const snap = await getDocs(q);

    resDiv.innerHTML = "";
    if (snap.empty) {
        resDiv.innerHTML = "<p>No encontrado.</p>";
    } else {
        snap.forEach((docSnap) => {
            const c = docSnap.data();
            const docId = docSnap.id; // ID interno de Firebase para poder editarlo

            resDiv.innerHTML += `
                <div style="background: #334155; padding: 20px; border-radius: 10px; margin-bottom: 10px;">
                    <h3 style="color: #3b82f6;">${c.nombre}</h3>
                    <p><strong>DNI:</strong> ${c.dni}</p>
                    <p><strong>Deuda Actual:</strong> <span id="deuda-${docId}" style="font-size: 1.2em; color:${c.deudas > 0 ? 'red' : 'lime'}">${c.deudas}€</span></p>
                    
                    <div style="margin-top: 15px; border-top: 1px solid #475569; padding-top: 10px;">
                        <label>Añadir Multa (€):</label>
                        <input type="number" id="multa-amount-${docId}" placeholder="Cantidad" style="width: 100px;">
                        <button onclick="anadirMulta('${docId}', ${c.deudas})" style="width: auto; background: var(--warning);">Aplicar Multa</button>
                    </div>
                </div>
            `;
        });
    }
};

window.anadirMulta = async (docId, deudaActual) => {
    const amountInput = document.getElementById(`multa-amount-${docId}`);
    const cantidad = parseInt(amountInput.value);

    if(!cantidad || cantidad <= 0) return alert("Pon una cantidad válida.");

    const nuevaDeuda = deudaActual + cantidad;

    try {
        const ciudadanoRef = doc(db, "ciudadanos", docId);
        await updateDoc(ciudadanoRef, {
            deudas: nuevaDeuda
        });
        alert("Multa aplicada correctamente.");
        // Refrescar búsqueda
        document.getElementById('input-busqueda').value; 
        window.buscarCiudadanoPol(); 
    } catch (e) {
        console.error(e);
        alert("Error al poner multa.");
    }
};

// --- LOGINS (IGUAL QUE ANTES) ---
window.loginPolicia = async () => { /* ... Copia tu loginPolicia anterior ... */ 
    const placa = document.getElementById('placa').value;
    const pass = document.getElementById('pass-policia').value;
    // ... (Usa el código del login que ya funcionaba) ...
    // Para simplificar, asumo que ya lo tienes del mensaje anterior.
    // Solo asegurate de que redirija a sistema.html
    const q = query(collection(db, "agentes"), where("placa", "==", placa), where("pass", "==", pass));
    const snap = await getDocs(q);
    if(!snap.empty) {
        localStorage.setItem('usuarioActivo', placa);
        window.location.href = "sistema.html";
    } else {
        alert("Datos incorrectos");
    }
};

window.loginCiudadano = async () => {
    const dni = document.getElementById('dni-login').value;
    const pass = document.getElementById('pass-ciudadano').value;
    const msg = document.getElementById('feedback-msg');

    const q = query(collection(db, "ciudadanos"), where("dni", "==", dni), where("pass", "==", pass));
    const snap = await getDocs(q);

    if (!snap.empty) {
        const data = snap.docs[0].data();
        document.getElementById('dni-nombre').innerText = data.nombre;
        document.getElementById('dni-numero').innerText = data.dni;
        document.getElementById('dni-deuda').innerText = data.deudas + "€";
        document.getElementById('movil-view').style.display = 'flex';
    } else {
        msg.innerText = "DNI o Contraseña incorrectos.";
        msg.style.color = "red";
    }
};

// Inicializar tabla si estamos en codigo_penal.html
if (window.location.pathname.includes("codigo_penal.html")) {
    window.cargarLeyes();
}

// Inicializar botones en sistema.html
if (window.location.pathname.includes("sistema.html")) {
    const btn = document.getElementById('btn-buscar-pol');
    if(btn) btn.addEventListener('click', window.buscarCiudadanoPol);
}
