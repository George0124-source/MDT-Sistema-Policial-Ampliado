/* placas.js - Lógica y Base de Datos Actualizada */

// 1. LISTA DE AGENTES AUTORIZADOS (Login Real)
const AGENTES = [
    // La Cúpula / Fundación
    { placa: "CF-001", pass: "Jorge0124", rango: "Co-Fundador", discordId: "803332911926739005" },
    { placa: "FN-001", pass: "Alex0124", rango: "Fundador", discordId: "739425840214835270" },
    
    // Agentes Normales (Ejemplos - Puedes añadir más aquí)
    { placa: "CNP-001", pass: "policia1", rango: "Comisario", discordId: "000000001" },
    { placa: "CNP-002", pass: "policia2", rango: "Agente", discordId: "000000002" }
];

// 2. BASE DE DATOS CIUDADANOS (Para búsquedas)
const ciudadanosDB = [
    { dni: "12345678A", nombre: "Pepe Garcia", historial: "Limpio", deudas: 0 },
    { dni: "87654321B", nombre: "Lucia Fernandez", historial: "Robo menor", deudas: 500 },
    { dni: "11223344C", nombre: "Antonio Recio", historial: "Escándalo público", deudas: 1500 },
    { dni: "55667788D", nombre: "Gustabo Fring", historial: "Narcotráfico", deudas: 50000 }
];


// --- FUNCIONES DEL SISTEMA ---

// LOGIN (Ahora verifica la lista AGENTES)
function attemptLogin() {
    const placaInput = document.getElementById('placa').value;
    const passInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    // Buscamos si existe un agente con esa placa Y esa contraseña
    const agenteEncontrado = AGENTES.find(agente => agente.placa === placaInput && agente.pass === passInput);

    if (agenteEncontrado) {
        // Guardamos los datos de sesión
        localStorage.setItem('usuarioActivo', agenteEncontrado.placa);
        localStorage.setItem('rangoActivo', agenteEncontrado.rango); // Guardamos el rango para permisos
        window.location.href = "sistema.html";
    } else {
        errorMsg.style.display = 'block'; // Mostrar error si no coincide
    }
}

// Login modo ciudadano
function loginCiudadano() {
    localStorage.setItem('usuarioActivo', 'Ciudadano');
    localStorage.setItem('rangoActivo', 'Civil');
    alert("Accediendo como Ciudadano (Funciones limitadas)");
    window.location.href = "sistema.html";
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('rangoActivo');
    window.location.href = "index.html";
}

// Verificar sesión al cargar sistema.html
function checkSession() {
    const usuario = localStorage.getItem('usuarioActivo');
    const rango = localStorage.getItem('rangoActivo');

    if (!usuario) {
        window.location.href = "index.html";
    } else {
        const badgeElement = document.getElementById('user-badge');
        if(badgeElement) {
            // Mostramos Placa y Rango en la cabecera
            badgeElement.innerText = `Placa: ${usuario} | Rango: ${rango || 'Agente'}`;
        }
        
        // Si es ciudadano, bloquear funciones policiales
        if(usuario === 'Ciudadano') {
            document.querySelectorAll('.police-only').forEach(el => el.classList.add('disabled'));
        }
    }
}

// --- BUSCADORES Y TABLAS ---

// Buscar Ciudadano
function buscarCiudadano() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const resultDiv = document.getElementById('search-results');
    
    if(!input) return;

    const persona = ciudadanosDB.find(c => c.dni.toLowerCase() === input || c.nombre.toLowerCase().includes(input));

    if (persona) {
        resultDiv.innerHTML = `
            <div style="background: #334155; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #3b82f6;">
                <h3 style="color: #3b82f6;">${persona.nombre}</h3>
                <p><strong>DNI:</strong> ${persona.dni}</p>
                <p><strong>Antecedentes:</strong> ${persona.historial}</p>
                <p><strong>Deudas Totales:</strong> <span style="color:${persona.deudas > 0 ? '#ef4444' : '#22c55e'}">${persona.deudas}€</span></p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color: #f59e0b; margin-top: 20px;">No se encontraron registros.</p>`;
    }
}

// Buscar solo Deudas
function buscarDeudas() {
    const input = document.getElementById('debt-input').value.toLowerCase();
    const resultDiv = document.getElementById('debt-results');
    const persona = ciudadanosDB.find(c => c.dni.toLowerCase() === input);

    if (persona) {
        resultDiv.innerHTML = `<h2 style="margin-top:20px; color:${persona.deudas > 0 ? 'red' : 'green'}">Deuda Pendiente: ${persona.deudas}€</h2>`;
    } else {
        resultDiv.innerHTML = `<p>DNI no encontrado.</p>`;
    }
}

// Cargar Lista de Agentes (Leída de la nueva constante AGENTES)
function cargarAgentes() {
    const tbody = document.getElementById('lista-agentes-body');
    if(!tbody) return;

    tbody.innerHTML = "";
    AGENTES.forEach(agente => {
        // Simulamos un estado aleatorio para el ejemplo (En servicio / Fuera)
        // O podrías ponerlos todos "En Servicio"
        const estado = "En Servicio"; 
        
        tbody.innerHTML += `
            <tr>
                <td>${agente.placa}</td>
                <td>${agente.rango}</td>
                <td style="color: #22c55e">${estado}</td>
            </tr>
        `;
    });
}

// --- SISTEMA DE INVESTIGACIÓN (PROTEGIDO) ---

function abrirInvestigaciones() {
    document.getElementById('modal-investigacion').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-investigacion').style.display = 'none';
}

function verificarAccesoInvestigacion() {
    const key = document.getElementById('llave-maestra').value;
    const usuarioActual = localStorage.getItem('usuarioActivo');
    const rangoActual = localStorage.getItem('rangoActivo');

    // LLAVE MAESTRA CORRECTA
    const llaveCorrecta = "CupulaFundadoraPeninsula0124";

    // Validamos:
    // 1. Que la llave sea correcta
    // 2. Que el usuario sea Fundador o Co-Fundador
    const esAltoMando = (rangoActual === "Fundador" || rangoActual === "Co-Fundador");

    if (key === llaveCorrecta && esAltoMando) {
        alert("ACCESO CONCEDIDO - BIENVENIDO A CÚPULA");
        cerrarModal();
        document.getElementById('contenido-secreto').style.display = 'block';
        document.getElementById('grid-principal').style.display = 'none';
    } else {
        alert("ACCESO DENEGADO: Llave incorrecta o rango insuficiente.");
    }
}
