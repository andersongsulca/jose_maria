/* ===== SCAE - Sistema Empresarial de Asistencia Escolar ===== */
/* ===== Huaccana, Chincheros, Apurímac - Perú ===== */

// ==================== 1. BASE DE DATOS INICIAL ====================
const DEFAULT_DB = {
  users: [
    { id: 'U001', name: 'Wilfredo Quispe Hancco', email: 'director@colegio.edu', password: 'admin123', role: 'director', dni: '40123456', phone: '+51 987 654 321', createdAt: '2024-01-01' },
    { id: 'U002', name: 'Santos Mamani Ccorimanya', email: 'prof.mamani@colegio.edu', password: 'doc123', role: 'docente', dni: '41234567', specialty: 'Matemáticas', phone: '+51 987 654 301', status: 'activo', createdAt: '2024-01-15' },
    { id: 'U003', name: 'Victoria Cárdenas Huamán', email: 'prof.cardenas@colegio.edu', password: 'doc123', role: 'docente', dni: '42345678', specialty: 'Comunicación', phone: '+51 987 654 302', status: 'activo', createdAt: '2024-01-20' },
    { id: 'U004', name: 'Pedro Huayta Pari', email: 'prof.huayta@colegio.edu', password: 'doc123', role: 'docente', dni: '43456789', specialty: 'Ciencias Sociales', phone: '+51 987 654 303', status: 'activo', createdAt: '2024-01-25' },
    { id: 'U005', name: 'Lucía Cusihuamán Ccama', email: 'prof.cusihuaman@colegio.edu', password: 'doc123', role: 'docente', dni: '44567890', specialty: 'Ciencias Naturales', phone: '+51 987 654 304', status: 'activo', createdAt: '2024-02-01' },
    { id: 'U006', name: 'Juana Ccorimanya Quispe', email: 'carmen.lopez@colegio.edu', password: 'apo123', role: 'apoderado', dni: '45678901', phone: '+51 987 654 305', createdAt: '2024-02-01' },
    { id: 'U007', name: 'Felipe Quispe Hancco', email: 'felipe.quispe@colegio.edu', password: 'apo123', role: 'apoderado', dni: '46789012', phone: '+51 987 654 306', createdAt: '2024-02-05' }
  ],
  students: [
    { id: 'E001', name: 'Yeltsin Quispe Ccorimanya', dni: '73456789', curso: '1A', apoderadoId: 'U006', status: 'activo', createdAt: '2024-02-01' },
    { id: 'E002', name: 'Katerin Quispe Ccorimanya', dni: '74567890', curso: '1A', apoderadoId: 'U006', status: 'activo', createdAt: '2024-02-01' },
    { id: 'E003', name: 'Jhordy Hancco Quispe', dni: '75678901', curso: '2A', apoderadoId: 'U007', status: 'activo', createdAt: '2024-02-05' },
    { id: 'E004', name: 'Yulisa Hancco Quispe', dni: '76789012', curso: '2A', apoderadoId: 'U007', status: 'activo', createdAt: '2024-02-05' },
    { id: 'E005', name: 'Brayan Mamani Cárdenas', dni: '77890123', curso: '1B', apoderadoId: null, status: 'activo', createdAt: '2024-02-10' },
    { id: 'E006', name: 'Kely Cárdenas Huamán', dni: '78901234', curso: '1B', apoderadoId: null, status: 'activo', createdAt: '2024-02-10' },
    { id: 'E007', name: 'Wilder Huayta Pari', dni: '79012345', curso: '2B', apoderadoId: null, status: 'activo', createdAt: '2024-02-15' },
    { id: 'E008', name: 'Nilda Cusihuamán Ccama', dni: '80123456', curso: '2B', apoderadoId: null, status: 'activo', createdAt: '2024-02-15' }
  ],
  courses: [
    { code: '1A', name: '1ro de Secundaria - A', aula: '101', tutor: 'U002' },
    { code: '1B', name: '1ro de Secundaria - B', aula: '102', tutor: 'U003' },
    { code: '2A', name: '2do de Secundaria - A', aula: '201', tutor: 'U002' },
    { code: '2B', name: '2do de Secundaria - B', aula: '202', tutor: 'U004' }
  ],
  attendance: {},
  settings: {
    schoolName: 'I.E.S. José María Flores',
    currentYear: '2026',
    entryTime: '07:45',
    lateTolerance: 15
  }
};

// Cargar DB desde localStorage o usar default
let DB = JSON.parse(localStorage.getItem('scae_db')) || JSON.parse(JSON.stringify(DEFAULT_DB));
function saveDB() {
  localStorage.setItem('scae_db', JSON.stringify(DB));
}

// Estado
let currentUser = null;
let currentRole = 'director';

// ==================== 2. UTILIDADES ====================
const $ = id => document.getElementById(id);
const generateId = (prefix) => prefix + Date.now().toString(36).toUpperCase();
const today = () => new Date().toISOString().split('T')[0];
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
const getInitials = (name) => name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

// Toast Notifications (mejoradas)
function showToast(message, type = 'success') {
  const container = $('toast-container');
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>',
    warning: '<svg class="toast-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${icons[type]}<span class="toast-message">${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Modal System
function openModal(title, contentHtml, onConfirm) {
  const modalContainer = $('modalContainer');
  modalContainer.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="btn-close" onclick="closeModal()">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div class="modal-body">${contentHtml}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Guardar</button>
      </div>
    </div>
  `;
  modalContainer.classList.add('show');
  
  $('modalConfirmBtn').addEventListener('click', () => {
    const result = onConfirm();
    if (result !== false) closeModal();
  });
}

function closeModal() {
  $('modalContainer').classList.remove('show');
  $('modalContainer').innerHTML = '';
}

// Cerrar modal al hacer clic fuera
$('modalContainer').addEventListener('click', (e) => {
  if (e.target === $('modalContainer')) closeModal();
});

// ==================== 3. AUTENTICACIÓN ====================
function selectRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });
}

function handleLogin(e) {
  e.preventDefault();
  const email = $('email').value.trim().toLowerCase();
  const password = $('password').value.trim();
  const btn = $('btnLogin');
  const btnText = $('btnLoginText');
  const btnIcon = $('btnLoginIcon');
  
  // Evitar doble clic
  if (btn.disabled) return;
  
  // Estado de carga
  btn.disabled = true;
  btnText.textContent = 'Verificando...';
  btnIcon.style.display = 'none';

  setTimeout(() => {
    const user = DB.users.find(u => u.email === email && u.password === password && u.role === currentRole);
    
    if (user) {
      currentUser = user;
      showToast(`Bienvenido, ${user.name.split(' ')[0]}`, 'success');
      $('login').style.display = 'none';
      $('app').classList.add('show');
      initializeApp();
    } else {
      showToast('Credenciales incorrectas o rol no coincide', 'error');
    }
    
    // ✅ IMPORTANTE: Resetear el botón SIEMPRE
    btn.disabled = false;
    btnText.textContent = 'Iniciar Sesión';
    btnIcon.style.display = 'block';
  }, 900);
}

function logout() {
  currentUser = null;
  $('app').classList.remove('show');
  $('login').style.display = 'flex';
  
  // ✅ Resetear formulario completamente
  $('email').value = '';
  $('password').value = '';
  $('btnLogin').disabled = false;
  $('btnLoginText').textContent = 'Iniciar Sesión';
  $('btnLoginIcon').style.display = 'block';
  
  // Resetear rol a director
  selectRole('director');
  
  showToast('Sesión cerrada correctamente', 'info');
}

// ==================== 4. INICIALIZACIÓN ====================
function initializeApp() {
  $('userName').textContent = currentUser.name;
  $('userRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
  $('userAvatar').textContent = getInitials(currentUser.name);
  
  renderSidebar();
  
  if (currentUser.role === 'director') navigateTo('dashboard');
  else if (currentUser.role === 'docente') navigateTo('inicio');
  else if (currentUser.role === 'apoderado') navigateTo('inicio-apoderado');
}

function renderSidebar() {
  const nav = $('sidebarNav');
  let html = '';
  
  if (currentUser.role === 'director') {
    html = `
      <div class="nav-section">
        <div class="nav-section-title">Principal</div>
        <div class="nav-item active" onclick="navigateTo('dashboard')" data-view="dashboard">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
          Dashboard
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Gestión Académica</div>
        <div class="nav-item" onclick="navigateTo('docentes')" data-view="docentes">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Docentes
        </div>
        <div class="nav-item" onclick="navigateTo('estudiantes')" data-view="estudiantes">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          Estudiantes
        </div>
        <div class="nav-item" onclick="navigateTo('reportes')" data-view="reportes">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
          Reportes
        </div>
      </div>
    `;
  } else if (currentUser.role === 'docente') {
    html = `
      <div class="nav-section">
        <div class="nav-section-title">Docente</div>
        <div class="nav-item active" onclick="navigateTo('inicio')" data-view="inicio">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          Inicio
        </div>
        <div class="nav-item" onclick="navigateTo('asistencia')" data-view="asistencia">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          Tomar Asistencia
        </div>
        <div class="nav-item" onclick="navigateTo('perfil-docente')" data-view="perfil-docente">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Mi Perfil
        </div>
      </div>
    `;
  } else if (currentUser.role === 'apoderado') {
    html = `
      <div class="nav-section">
        <div class="nav-section-title">Apoderado</div>
        <div class="nav-item active" onclick="navigateTo('inicio-apoderado')" data-view="inicio-apoderado">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          Resumen
        </div>
        <div class="nav-item" onclick="navigateTo('mis-hijos')" data-view="mis-hijos">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          Mis Hijos
        </div>
        <div class="nav-item" onclick="navigateTo('historial-asistencia')" data-view="historial-asistencia">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
          Historial
        </div>
      </div>
    `;
  }
  
  nav.innerHTML = html;
}

function navigateTo(view) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === view);
  });
  
  const content = $('contentWrapper');
  const title = view.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  $('breadcrumb').innerHTML = `<span class="breadcrumb-item">${title}</span>`;
  
  content.style.opacity = '0';
  setTimeout(() => {
    if (currentUser.role === 'director') renderDirectorView(view, content);
    else if (currentUser.role === 'docente') renderTeacherView(view, content);
    else if (currentUser.role === 'apoderado') renderParentView(view, content);
    
    content.style.opacity = '1';
  }, 150);
}

// ==================== 5. VISTAS DEL DIRECTOR ====================
function renderDirectorView(view, container) {
  if (view === 'dashboard') {
    const totalDocentes = DB.users.filter(u => u.role === 'docente').length;
    const totalEstudiantes = DB.students.length;
    const asistenciaHoy = Object.keys(DB.attendance).filter(k => k.includes(today())).length;
    
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon blue"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
            <span class="stat-trend positive">Activos</span>
          </div>
          <div class="stat-value">${totalDocentes}</div>
          <div class="stat-label">Docentes Registrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon green"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>
          </div>
          <div class="stat-value">${totalEstudiantes}</div>
          <div class="stat-label">Estudiantes Matriculados</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon orange"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></div>
          </div>
          <div class="stat-value">${asistenciaHoy}</div>
          <div class="stat-label">Asistencias de Hoy</div>
        </div>
      </div>
      
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Actividad Reciente del Sistema</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Acción</th><th>Usuario</th><th>Fecha</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr><td>Inicio de sesión</td><td>${currentUser.name}</td><td>${formatDate(today())}</td><td><span class="badge badge-success">Exitoso</span></td></tr>
            <tr><td>Sistema actualizado</td><td>Administrador</td><td>${formatDate(today())}</td><td><span class="badge badge-neutral">Completado</span></td></tr>
          </tbody>
        </table>
      </div>
    `;
  }
  
  else if (view === 'docentes') {
    const docentes = DB.users.filter(u => u.role === 'docente');
    container.innerHTML = `
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Gestión de Docentes</h3>
          <div class="table-actions">
            <div class="search-box">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input type="text" placeholder="Buscar docente..." onkeyup="filterTable(this, 'tablaDocentes')">
            </div>
            <button class="btn btn-primary" onclick="openTeacherModal()">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nuevo Docente
            </button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table" id="tablaDocentes">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Especialidad</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              ${docentes.map(d => `
                <tr>
                  <td><strong>${d.id}</strong></td>
                  <td><strong>${d.name}</strong><br><small style="color:var(--neutral-500)">DNI: ${d.dni}</small></td>
                  <td>${d.email}</td>
                  <td>${d.specialty || '<span style="color:var(--neutral-400)">Sin asignar</span>'}</td>
                  <td>${d.phone || '-'}</td>
                  <td><span class="badge ${d.status === 'activo' ? 'badge-success' : 'badge-danger'}">${d.status}</span></td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="editTeacher('${d.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTeacher('${d.id}')">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  else if (view === 'estudiantes') {
    container.innerHTML = `
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Gestión de Estudiantes</h3>
          <div class="table-actions">
            <div class="search-box">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input type="text" placeholder="Buscar estudiante..." onkeyup="filterTable(this, 'tablaEstudiantes')">
            </div>
            <button class="btn btn-primary" onclick="openStudentModal()">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Nuevo Estudiante
            </button>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table" id="tablaEstudiantes">
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>DNI</th><th>Curso</th><th>Apoderado</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              ${DB.students.map(e => {
                const apoderado = DB.users.find(u => u.id === e.apoderadoId);
                return `
                <tr>
                  <td><strong>${e.id}</strong></td>
                  <td><strong>${e.name}</strong></td>
                  <td>${e.dni}</td>
                  <td><span class="badge badge-neutral">${e.curso}</span></td>
                  <td>${apoderado ? apoderado.name : '<span style="color:var(--neutral-400)">Sin asignar</span>'}</td>
                  <td><span class="badge ${e.status === 'activo' ? 'badge-success' : 'badge-danger'}">${e.status}</span></td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="editStudent('${e.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStudent('${e.id}')">Eliminar</button>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  else if (view === 'reportes') {
    container.innerHTML = `
      <div class="data-table-container" style="padding: 3rem; text-align: center;">
        <svg viewBox="0 0 24 24" width="64" height="64" style="color: var(--neutral-300); margin-bottom: 1rem;"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
        <h3 style="color: var(--neutral-700); margin-bottom: 0.5rem;">Módulo de Reportes</h3>
        <p style="color: var(--neutral-500); max-width: 500px; margin: 0 auto 1.5rem;">Genera informes detallados de asistencia mensual, rendimiento académico y estadísticas de docentes.</p>
        <button class="btn btn-primary" onclick="showToast('Generando reporte PDF...', 'info')">Descargar Reporte Mensual</button>
      </div>
    `;
  }
}

// ==================== 6. CRUD DOCENTES ====================
function openTeacherModal(teacherId = null) {
  const teacher = teacherId ? DB.users.find(u => u.id === teacherId) : null;
  const title = teacher ? 'Editar Docente' : 'Registrar Nuevo Docente';
  
  const html = `
    <div class="form-grid">
      <div class="form-group">
        <label>Nombre Completo *</label>
        <input type="text" id="tName" value="${teacher ? teacher.name : ''}" placeholder="Ej: Santos Mamani Ccorimanya" required>
      </div>
      <div class="form-group">
        <label>DNI *</label>
        <input type="text" id="tDni" value="${teacher ? teacher.dni : ''}" maxlength="8" placeholder="8 dígitos" required>
      </div>
      <div class="form-group">
        <label>Correo Electrónico *</label>
        <input type="email" id="tEmail" value="${teacher ? teacher.email : ''}" placeholder="usuario@colegio.edu" required>
      </div>
      <div class="form-group">
        <label>Contraseña *</label>
        <input type="text" id="tPassword" value="${teacher ? teacher.password : 'doc123'}" placeholder="Mínimo 6 caracteres" required>
      </div>
      <div class="form-group">
        <label>Especialidad</label>
        <input type="text" id="tSpecialty" value="${teacher ? (teacher.specialty || '') : ''}" placeholder="Ej: Matemáticas">
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input type="text" id="tPhone" value="${teacher ? (teacher.phone || '') : ''}" placeholder="+51 9XX XXX XXX">
      </div>
    </div>
  `;
  
  openModal(title, html, () => {
    const name = $('tName').value.trim();
    const dni = $('tDni').value.trim();
    const email = $('tEmail').value.trim().toLowerCase();
    const password = $('tPassword').value.trim();
    const specialty = $('tSpecialty').value.trim();
    const phone = $('tPhone').value.trim();
    
    if (!name || !dni || !email || !password) {
      showToast('Complete todos los campos obligatorios (*)', 'error');
      return false;
    }
    if (!/^\d{8}$/.test(dni)) {
      showToast('El DNI debe tener exactamente 8 dígitos', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Ingrese un correo electrónico válido', 'error');
      return false;
    }
    
    const emailExists = DB.users.some(u => u.email === email && u.id !== teacherId);
    if (emailExists) {
      showToast('Este correo electrónico ya está registrado en el sistema', 'error');
      return false;
    }
    
    if (teacher) {
      Object.assign(teacher, { name, dni, email, password, specialty, phone });
      showToast('Docente actualizado correctamente', 'success');
    } else {
      DB.users.push({
        id: generateId('U'),
        name, dni, email, password, specialty, phone,
        role: 'docente',
        status: 'activo',
        createdAt: today()
      });
      showToast('Docente registrado y correo habilitado exitosamente', 'success');
    }
    
    saveDB();
    navigateTo('docentes');
    return true;
  });
}

function editTeacher(id) { openTeacherModal(id); }

function deleteTeacher(id) {
  if (confirm('¿Está seguro de eliminar este docente? Esta acción no se puede deshacer.')) {
    DB.users = DB.users.filter(u => u.id !== id);
    saveDB();
    showToast('Docente eliminado correctamente', 'success');
    navigateTo('docentes');
  }
}

// ==================== 7. CRUD ESTUDIANTES ====================
function openStudentModal(studentId = null) {
  const student = studentId ? DB.students.find(s => s.id === studentId) : null;
  const title = student ? 'Editar Estudiante' : 'Registrar Nuevo Estudiante';
  
  const apoderados = DB.users.filter(u => u.role === 'apoderado');
  
  const html = `
    <div class="form-grid">
      <div class="form-group">
        <label>Nombre Completo *</label>
        <input type="text" id="sName" value="${student ? student.name : ''}" placeholder="Nombres y apellidos" required>
      </div>
      <div class="form-group">
        <label>DNI del Estudiante *</label>
        <input type="text" id="sDni" value="${student ? student.dni : ''}" maxlength="8" placeholder="8 dígitos" required>
      </div>
      <div class="form-group">
        <label>Curso / Grado *</label>
        <select id="sCurso" required>
          <option value="">-- Seleccione --</option>
          ${DB.courses.map(c => `<option value="${c.code}" ${student && student.curso === c.code ? 'selected' : ''}>${c.name} (Aula ${c.aula})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Apoderado Asignado</label>
        <select id="sApoderado">
          <option value="">-- Sin asignar --</option>
          ${apoderados.map(a => `<option value="${a.id}" ${student && student.apoderadoId === a.id ? 'selected' : ''}>${a.name}</option>`).join('')}
        </select>
      </div>
    </div>
  `;
  
  openModal(title, html, () => {
    const name = $('sName').value.trim();
    const dni = $('sDni').value.trim();
    const curso = $('sCurso').value;
    const apoderadoId = $('sApoderado').value || null;
    
    if (!name || !dni || !curso) {
      showToast('Complete los campos obligatorios (*)', 'error');
      return false;
    }
    if (!/^\d{8}$/.test(dni)) {
      showToast('El DNI debe tener exactamente 8 dígitos', 'error');
      return false;
    }
    
    if (student) {
      Object.assign(student, { name, dni, curso, apoderadoId });
      showToast('Estudiante actualizado correctamente', 'success');
    } else {
      DB.students.push({
        id: generateId('E'),
        name, dni, curso, apoderadoId,
        status: 'activo',
        createdAt: today()
      });
      showToast('Estudiante matriculado exitosamente', 'success');
    }
    
    saveDB();
    navigateTo('estudiantes');
    return true;
  });
}

function editStudent(id) { openStudentModal(id); }

function deleteStudent(id) {
  if (confirm('¿Eliminar este estudiante? Se perderá su historial de asistencia.')) {
    DB.students = DB.students.filter(s => s.id !== id);
    Object.keys(DB.attendance).forEach(key => {
      if (key.startsWith(id + '_')) delete DB.attendance[key];
    });
    saveDB();
    showToast('Estudiante eliminado correctamente', 'success');
    navigateTo('estudiantes');
  }
}

// ==================== 8. VISTAS DEL DOCENTE ====================
function renderTeacherView(view, container) {
  if (view === 'inicio') {
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon blue"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg></div>
          </div>
          <div class="stat-value">${DB.courses.length}</div>
          <div class="stat-label">Cursos Disponibles</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon green"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
          </div>
          <div class="stat-value">${DB.students.length}</div>
          <div class="stat-label">Estudiantes Totales</div>
        </div>
      </div>
      <div class="data-table-container" style="padding: 3rem; text-align: center;">
        <h3 style="color: var(--neutral-700); margin-bottom: 0.5rem;">Panel de Docente</h3>
        <p style="color: var(--neutral-500); margin: 1rem 0 1.5rem;">Seleccione "Tomar Asistencia" en el menú lateral para registrar la asistencia de sus cursos.</p>
        <button class="btn btn-primary" onclick="navigateTo('asistencia')">Ir a Tomar Asistencia</button>
      </div>
    `;
  }
  
  else if (view === 'asistencia') {
    const cursos = DB.courses;
    container.innerHTML = `
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Tomar Asistencia - ${formatDate(today())}</h3>
        </div>
        <div style="padding: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
            <div class="form-group" style="margin:0;">
              <label>Seleccionar Curso</label>
              <select id="attCourse" style="width:100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--neutral-200); border-radius: var(--radius-md); font-family: inherit; font-size: 14px;" onchange="loadStudentsForAttendance()">
                <option value="">-- Seleccione un curso --</option>
                ${cursos.map(c => `<option value="${c.code}">${c.name} (Aula ${c.aula})</option>`).join('')}
              </select>
            </div>
          </div>
          <div id="attendanceList"></div>
        </div>
      </div>
    `;
  }
  
  else if (view === 'perfil-docente') {
    container.innerHTML = `
      <div class="data-table-container" style="max-width: 600px; margin: 0 auto;">
        <div class="table-header">
          <h3 class="table-title">Mi Perfil</h3>
        </div>
        <div style="padding: 2rem;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="width: 80px; height: 80px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; margin: 0 auto 1rem;">${getInitials(currentUser.name)}</div>
            <h3>${currentUser.name}</h3>
            <p style="color: var(--neutral-500);">${currentUser.specialty || 'Docente'}</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="form-group" style="margin:0;"><label>Email</label><input type="text" value="${currentUser.email}" readonly style="width:100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-50);"></div>
            <div class="form-group" style="margin:0;"><label>DNI</label><input type="text" value="${currentUser.dni}" readonly style="width:100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-50);"></div>
            <div class="form-group" style="margin:0;"><label>Teléfono</label><input type="text" value="${currentUser.phone || 'No registrado'}" readonly style="width:100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-50);"></div>
            <div class="form-group" style="margin:0;"><label>Fecha de Registro</label><input type="text" value="${formatDate(currentUser.createdAt)}" readonly style="width:100%; padding: 0.625rem 0.875rem; border: 1.5px solid var(--neutral-200); border-radius: var(--radius-md); background: var(--neutral-50);"></div>
          </div>
        </div>
      </div>
    `;
  }
}

function loadStudentsForAttendance() {
  const cursoCode = $('attCourse').value;
  const listDiv = $('attendanceList');
  
  if (!cursoCode) {
    listDiv.innerHTML = '';
    return;
  }
  
  const students = DB.students.filter(s => s.curso === cursoCode && s.status === 'activo');
  const dateKey = today();
  
  if (students.length === 0) {
    listDiv.innerHTML = '<p style="text-align: center; color: var(--neutral-500); padding: 2rem;">No hay estudiantes activos en este curso.</p>';
    return;
  }
  
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem 1rem; background: var(--neutral-50); border-radius: var(--radius-md);">
      <span style="font-weight: 600;">${students.length} estudiantes encontrados</span>
      <button class="btn btn-sm btn-secondary" onclick="markAllAttendance('presente')">Marcar todos Presente</button>
    </div>
    <table class="data-table">
      <thead>
        <tr><th>Estudiante</th><th>DNI</th><th>Estado</th></tr>
      </thead>
      <tbody>
  `;
  
  students.forEach(s => {
    const currentStatus = DB.attendance[`${s.id}_${dateKey}`] || '';
    html += `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.dni}</td>
        <td>
          <select class="att-select" data-student="${s.id}" onchange="updateAttColor(this)">
            <option value="" ${!currentStatus ? 'selected' : ''}>-- Seleccionar --</option>
            <option value="presente" ${currentStatus === 'presente' ? 'selected' : ''}>✓ Presente</option>
            <option value="tardanza" ${currentStatus === 'tardanza' ? 'selected' : ''}>⏱ Tardanza</option>
            <option value="ausente" ${currentStatus === 'ausente' ? 'selected' : ''}>✗ Ausente</option>
          </select>
        </td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
    <div style="margin-top: 1.5rem; text-align: right;">
      <button class="btn btn-primary" onclick="saveAttendance()">
        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
        Guardar Asistencia
      </button>
    </div>
  `;
  
  listDiv.innerHTML = html;
  
  // Aplicar colores iniciales
  document.querySelectorAll('.att-select').forEach(updateAttColor);
}

function updateAttColor(select) {
  const colors = {
    'presente': 'var(--success)',
    'tardanza': 'var(--warning)',
    'ausente': 'var(--danger)',
    '': 'var(--neutral-600)'
  };
  select.style.color = colors[select.value] || colors[''];
  select.style.borderColor = select.value ? colors[select.value] : 'var(--neutral-200)';
}

function markAllAttendance(status) {
  document.querySelectorAll('.att-select').forEach(select => {
    select.value = status;
    updateAttColor(select);
  });
  showToast(`Todos marcados como: ${status.toUpperCase()}`, 'info');
}

function saveAttendance() {
  const selects = document.querySelectorAll('.att-select');
  let allMarked = true;
  let count = 0;
  
  selects.forEach(select => {
    const studentId = select.dataset.student;
    const status = select.value;
    
    if (!status) {
      allMarked = false;
      select.style.borderColor = 'var(--danger)';
    } else {
      DB.attendance[`${studentId}_${today()}`] = status;
      count++;
      select.style.borderColor = 'var(--neutral-200)';
    }
  });
  
  if (!allMarked) {
    showToast('Marque el estado de todos los estudiantes', 'error');
    return;
  }
  
  saveDB();
  showToast(`Asistencia guardada correctamente (${count} estudiantes)`, 'success');
  setTimeout(() => navigateTo('inicio'), 1000);
}

// ==================== 9. VISTAS DEL APODERADO ====================
function renderParentView(view, container) {
  const myChildren = DB.students.filter(s => s.apoderadoId === currentUser.id);
  
  if (view === 'inicio-apoderado') {
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <div class="stat-icon blue"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>
          </div>
          <div class="stat-value">${myChildren.length}</div>
          <div class="stat-label">Hijos Matriculados</div>
        </div>
      </div>
      
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Resumen de Asistencia de Hoy</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Estudiante</th><th>Curso</th><th>Estado Hoy</th></tr>
          </thead>
          <tbody>
            ${myChildren.length === 0 ? '<tr><td colspan="3" style="text-align:center; padding: 2rem; color: var(--neutral-500);">No tiene hijos asignados a su cuenta.</td></tr>' : 
              myChildren.map(child => {
                const status = DB.attendance[`${child.id}_${today()}`] || 'No registrada';
                const badgeClass = status === 'presente' ? 'badge-success' : status === 'tardanza' ? 'badge-warning' : status === 'ausente' ? 'badge-danger' : 'badge-neutral';
                const statusText = status === 'presente' ? 'Presente' : status === 'tardanza' ? 'Tardanza' : status === 'ausente' ? 'Ausente' : 'Pendiente';
                return `
                  <tr>
                    <td><strong>${child.name}</strong></td>
                    <td>${child.curso}</td>
                    <td><span class="badge ${badgeClass}">${statusText}</span></td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  else if (view === 'mis-hijos') {
    container.innerHTML = `
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Mis Hijos</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Nombre</th><th>DNI</th><th>Curso</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${myChildren.map(c => `
              <tr>
                <td><strong>${c.name}</strong></td>
                <td>${c.dni}</td>
                <td><span class="badge badge-neutral">${c.curso}</span></td>
                <td><span class="badge badge-success">${c.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  else if (view === 'historial-asistencia') {
    container.innerHTML = `
      <div class="data-table-container">
        <div class="table-header">
          <h3 class="table-title">Historial de Asistencia (Últimos 7 días)</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr><th>Fecha</th><th>Estudiante</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${(() => {
              let rows = [];
              const dates = [];
              for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                dates.push(d.toISOString().split('T')[0]);
              }
              
              myChildren.forEach(child => {
                dates.forEach(date => {
                  const status = DB.attendance[`${child.id}_${date}`];
                  if (status) {
                    const badgeClass = status === 'presente' ? 'badge-success' : status === 'tardanza' ? 'badge-warning' : 'badge-danger';
                    const statusText = status === 'presente' ? 'Presente' : status === 'tardanza' ? 'Tardanza' : 'Ausente';
                    rows.push(`
                      <tr>
                        <td>${formatDate(date)}</td>
                        <td>${child.name}</td>
                        <td><span class="badge ${badgeClass}">${statusText}</span></td>
                      </tr>
                    `);
                  }
                });
              });
              
              return rows.length > 0 ? rows.join('') : '<tr><td colspan="3" style="text-align:center; padding: 2rem; color: var(--neutral-500);">No hay registros de asistencia recientes.</td></tr>';
            })()}
          </tbody>
        </table>
      </div>
    `;
  }
}

// ==================== 10. UTILIDADES GLOBALES ====================
function filterTable(input, tableId) {
  const filter = input.value.toLowerCase();
  const table = $(tableId);
  const tr = table.getElementsByTagName('tr');
  
  for (let i = 1; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName('td');
    let found = false;
    for (let j = 0; j < td.length; j++) {
      if (td[j]) {
        const txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          found = true;
          break;
        }
      }
    }
    tr[i].style.display = found ? '' : 'none';
  }
}

function toggleSidebar() {
  $('sidebar').classList.toggle('show');
}

function showNotifications() {
  showToast('No tiene notificaciones nuevas', 'info');
}

function showHelp() {
  showToast('Soporte técnico: soporte@colegio.edu', 'info');
}

// ==================== 11. INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
  if ($('email')) $('email').focus();
});