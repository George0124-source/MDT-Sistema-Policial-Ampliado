import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
// GESTIÓN DE AGENTES (STAFF)
// ==========================================

window.anadirNuevaPlaca = async () => {
    const passMaster = prompt("Ingrese Contraseña Maestra:");
    if(passMaster !== MASTER_KEY) return alert("Llave incorrecta.");

    const placa = prompt("Número de Placa (ej: CNP-123):");
    const password = prompt("Contraseña para el agente:");
    const rango = prompt("Rango (Agente, Oficial, Inspector, Comisario):");

    if(!placa || !password || !rango) return alert("Datos incompletos.");

    try {
        await addDoc(collection(db, "agentes"), {
            placa: placa,
            pass: password,
            rango: rango
        });
        alert("Agente autorizado correctamente en el sistema.");
        if(window.cargarAgentesStaff) window.cargarAgentesStaff();
    } catch(e) {
        alert("Error: " + e.message);
    }
};

window.cargarAgentesStaff = async () => {
    const lista = document.getElementById('lista-agentes-admin');
    if(!lista) return;
    lista.innerHTML = "Consultando...";

    const snap = await getDocs(collection(db, "agentes"));
    lista.innerHTML = "";
    snap.forEach(d => {
        const a = d.data();
        lista.innerHTML += `
            <div style="background:#1e293b; padding:10px; margin-bottom:5px; border-radius:4px; display:flex; justify-content:space-between;">
                <span><strong>${a.placa}</strong> - ${a.rango}</span>
                <button onclick="window.eliminarAgente('${d.id}')" style="background:red; color:white; padding:2px 5px; font-size:10px;">ELIMINAR</button>
            </div>
        `;
    });
};

window.eliminarAgente = async (id) => {
    if(confirm("¿Seguro que quieres revocar el acceso a esta placa?")) {
        await deleteDoc(doc(db, "agentes", id));
        window.cargarAgentesStaff();
    }
};

// ==========================================
// SISTEMA DE BÚSQUEDA Y MULTAS
// ==========================================

window.buscarCiudadanoPol = async () => {
    const input = document.getElementById('input-busqueda').value.toUpperCase();
    const resDiv = document.getElementById('resultados-busqueda');
    resDiv.innerHTML = "<p>Consultando Base de Datos Nacional...</p>";

    const q = query(collection(db, "ciudadanos"), where("dni", "==", input));
    const snap = await getDocs(q);

    resDiv.innerHTML = "";
    if (snap.empty) {
        resDiv.innerHTML = "<p>No existen registros con ese DNI.</p>";
    } else {
        snap.forEach((docSnap) => {
            const c = docSnap.data();
            const docId = docSnap.id;
            resDiv.innerHTML += `
                <div class="card-result" style="background:#1e293b; padding:20px; border-left: 4px solid var(--cnp-gold);">
                    <h2 style="color:var(--cnp-gold)">${c.nombre}</h2>
                    <p>DNI: ${c.dni} | ESTADO: <span style="color:lime">ACTIVO</span></p>
                    <p style="font-size:1.5rem; margin:10px 0;">Deuda: <span style="color:${c.deudas > 0 ? '#f87171' : '#4ade80'}">${c.deudas}€</span></p>
                    <div style="display:flex; gap:10px;">
                        <input type="number" id="m-amount-${docId}" placeholder="Importe Multa" style="width:120px;">
                        <button onclick="window.aplicarMulta('${docId}', ${c.deudas})" class="btn-auth">SANCIONAR</button>
                    </div>
                </div>
            `;
        });
    }
};

window.aplicarMulta = async (id, actual) => {
    const cant = parseInt(document.getElementById(`m-amount-${id}`).value);
    if(!cant) return;
    await updateDoc(doc(db, "ciudadanos", id), { deudas: actual + cant });
    alert("Sanción aplicada y registrada.");
    window.buscarCiudadanoPol();
};

// ==========================================
// LOGINS
// ==========================================

window.loginPolicia = async () => {
    const placa = document.getElementById('placa').value;
    const pass = document.getElementById('pass-pol').value;

    const q = query(collection(db, "agentes"), where("placa", "==", placa), where("pass", "==", pass));
    const snap = await getDocs(q);

    if(!snap.empty) {
        localStorage.setItem('agenteActivo', JSON.stringify(snap.docs[0].data()));
        window.location.href = "sistema.html";
    } else {
        alert("ACCESO DENEGADO: Credenciales no registradas en la DGP.");
    }
};

// Resto de lógica de ciudadano similar...
window.abrirRegistro = () => document.getElementById('modal-registro').style.display='flex';
window.cerrarRegistro = () => document.getElementById('modal-registro').style.display='none';
