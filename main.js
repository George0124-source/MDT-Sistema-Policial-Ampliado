import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLn1XJyKkpgj_4CANQRUV173TtdImzP7U",
  authDomain: "peninsulamdt.firebaseapp.com",
  projectId: "peninsulamdt",
  storageBucket: "peninsulamdt.firebasestorage.app",
  messagingSenderId: "394789444178",
  appId: "1:394789444178:web:c0aa37665ca9445a35dd8b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MASTER_KEY = "CupulaFundadoraPeninsula0124";

// ==========================================
// SISTEMA DE SEGURIDAD (MASTER KEY)
// ==========================================
window.verifyMasterAction = (callback) => {
    const pass = prompt("Acción Protegida. Ingrese Contraseña Maestra:");
    if (pass === MASTER_KEY) {
        callback();
    } else {
        alert("¡ACCESO DENEGADO! Contraseña Incorrecta.");
    }
};

// ==========================================
// GESTIÓN DE CIUDADANOS
// ==========================================

// Registrar (Público)
window.registrarCiudadanoPublico = async () => {
    const nombre = document.getElementById('new-nombre').value;
    const dni = document.getElementById('new-dni').value.toUpperCase();
    const pass = document.getElementById('new-pass').value;

    if(!nombre || !dni || !pass) return alert("Faltan datos");

    try {
        const q = query(collection(db, "ciudadanos"), where("dni", "==", dni));
        const snap = await getDocs(q);
        if(!snap.empty) return alert("DNI ya registrado");

        await addDoc(collection(db, "ciudadanos"), {
            nombre, dni, pass, deudas: 0, estado: "Limpio", notas: ""
        });
        alert("Registro completado.");
        window.cerrarRegistro();
    } catch(e) { console.error(e); }
};

// Buscar (Policía)
window.buscarCiudadanoPol = async () => {
    const input = document.getElementById('input-busqueda').value.toUpperCase();
    const resDiv = document.getElementById('resultados-busqueda');
    resDiv.innerHTML = "<p>Buscando en la base de datos nacional...</p>";

    const q = query(collection(db, "ciudadanos"), where("dni", "==", input));
    const snap = await getDocs(q);

    resDiv.innerHTML = "";
    if (snap.empty) {
        resDiv.innerHTML = "<p>Sin resultados.</p>";
    } else {
        snap.forEach((docSnap) => {
            const c = docSnap.data();
            const id = docSnap.id;
            resDiv.innerHTML += `
                <div class="card" style="text-align: left; border-left: 5px solid ${c.deudas > 5000 ? 'red' : 'green'}">
                    <h3>${c.nombre} ${c.deudas > 10000 ? '<span class="badge-wanted">BUSCADO</span>' : ''}</h3>
                    <p><strong>DNI:</strong> ${c.dni}</p>
                    <p><strong>Deuda:</strong> ${c.deudas}€</p>
                    <hr style="margin: 10px 0; opacity: 0.1;">
                    <div style="display: flex; gap: 10px;">
                        <input type="number" id="m-${id}" placeholder="Cantidad multa">
                        <button class="btn-primary" onclick="window.anadirMulta('${id}', ${c.deudas})">Multar</button>
                        <button class="btn-danger" onclick="window.verifyMasterAction(() => window.limpiarDeuda('${id}'))">Limpiar Deuda</button>
                    </div>
                </div>
            `;
        });
    }
};

window.anadirMulta = async (id, actual) => {
    const cant = parseInt(document.getElementById(`m-${id}`).value);
    if(!cant) return;
    await updateDoc(doc(db, "ciudadanos", id), { deudas: actual + cant });
    alert("Multa procesada");
    window.buscarCiudadanoPol();
};

window.limpiarDeuda = async (id) => {
    await updateDoc(doc(db, "ciudadanos", id), { deudas: 0 });
    alert("Deudas eliminadas por orden superior.");
    window.buscarCiudadanoPol();
};

// ==========================================
// GESTIÓN DE AGENTES
// ==========================================
window.cargarAgentes = async () => {
    const tbody = document.getElementById('tabla-agentes-body');
    if(!tbody) return;
    tbody.innerHTML = "Cargando...";
    
    const snap = await getDocs(collection(db, "agentes"));
    tbody.innerHTML = "";
    snap.forEach(d => {
        const a = d.data();
        tbody.innerHTML += `<tr><td>${a.placa}</td><td>${a.rango}</td><td><span style="color: lime">Activo</span></td></tr>`;
    });
};

// ==========================================
// LOGIN
// ==========================================
window.loginPolicia = async () => {
    const placa = document.getElementById('placa').value;
    const pass = document.getElementById('pass-policia').value;
    
    const q = query(collection(db, "agentes"), where("placa", "==", placa), where("pass", "==", pass));
    const snap = await getDocs(q);
    
    if(!snap.empty) {
        const u = snap.docs[0].data();
        localStorage.setItem('user', JSON.stringify(u));
        window.location.href = "sistema.html";
    } else {
        alert("Credenciales de agente no válidas.");
    }
};

// Inicialización de vistas
if(window.location.pathname.includes("sistema.html")) {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) window.location.href = "index.html";
    else document.getElementById('user-badge').innerText = `${user.rango} | ${user.placa}`;
}
