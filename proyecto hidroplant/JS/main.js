// ============================================
// HIDROPLANT - JavaScript Principal
// ============================================

// ========== VARIABLES GLOBALES ==========
let carrito = JSON.parse(localStorage.getItem('carritoHidroplant')) || [];
let favoritosSet = new Set(JSON.parse(localStorage.getItem('favoritosHidroplant')) || []);

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacion();
    inicializarCarrito();
    inicializarProductos();
    inicializarScrollTop();
    inicializarAnimaciones();
    inicializarFormularios();
    actualizarBadgeCarrito();
});

// ========== NAVEGACIÓN ==========
function inicializarNavegacion() {
    const btnMenuMobile = document.querySelector('.btn-menu-mobile');
    const menuPrincipal = document.querySelector('.menu-principal');
    const header = document.querySelector('#header-principal');
    
    // Menú móvil
    if (btnMenuMobile) {
        btnMenuMobile.addEventListener('click', () => {
            menuPrincipal.classList.toggle('active');
            btnMenuMobile.querySelector('i').classList.toggle('fa-bars');
            btnMenuMobile.querySelector('i').classList.toggle('fa-times');
        });
        
        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.menu-principal a').forEach(link => {
            link.addEventListener('click', () => {
                menuPrincipal.classList.remove('active');
                btnMenuMobile.querySelector('i').classList.add('fa-bars');
                btnMenuMobile.querySelector('i').classList.remove('fa-times');
            });
        });
    }
    
    // Header sticky con efecto
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Auto-hide en scroll down
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ========== CARRITO DE COMPRAS ==========
function inicializarCarrito() {
    // Agregar al carrito
    document.querySelectorAll('.btn-agregar, .btn-icon .fa-shopping-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productoCard = e.target.closest('.producto-card');
            if (productoCard) {
                agregarAlCarrito(productoCard);
            }
        });
    });
    
    // Abrir carrito
    const iconoCarrito = document.querySelector('.icono-carrito');
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCarrito();
        });
    }
}

function agregarAlCarrito(productoCard) {
    const nombre = productoCard.querySelector('h3').textContent;
    const precioTexto = productoCard.querySelector('.precio').textContent;
    const precio = parseInt(precioTexto.replace(/[$.]/g, ''));
    const categoria = productoCard.querySelector('.categoria').textContent.trim();
    
    const producto = {
        id: Date.now(),
        nombre,
        precio,
        categoria,
        cantidad: 1
    };
    
    // Verificar si ya existe
    const existe = carrito.find(item => item.nombre === nombre);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push(producto);
    }
    
    guardarCarrito();
    actualizarBadgeCarrito();
    mostrarNotificacion(`✅ ${nombre} agregado al carrito`, 'success');
}

function guardarCarrito() {
    localStorage.setItem('carritoHidroplant', JSON.stringify(carrito));
}

function actualizarBadgeCarrito() {
    const badge = document.querySelector('.badge-carrito');
    if (badge) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function mostrarCarrito() {
    // Crear modal del carrito
    const modal = document.createElement('div');
    modal.className = 'modal-carrito';
    modal.innerHTML = `
        <div class="modal-contenido">
            <div class="modal-header">
                <h3><i class="fas fa-shopping-cart"></i> Mi Carrito</h3>
                <button class="btn-cerrar-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                ${carrito.length === 0 ? 
                    '<p class="carrito-vacio"><i class="fas fa-shopping-bag"></i><br>Tu carrito está vacío</p>' :
                    generarHTMLCarrito()
                }
            </div>
            ${carrito.length > 0 ? `
                <div class="modal-footer">
                    <div class="total-carrito">
                        <span>Total:</span>
                        <strong>$${calcularTotal().toLocaleString()}</strong>
                    </div>
                    <button class="btn btn-primary btn-finalizar">
                        <i class="fas fa-credit-card"></i> Finalizar Compra
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Cerrar modal
    modal.querySelector('.btn-cerrar-modal').addEventListener('click', () => cerrarModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal(modal);
    });
    
    // Botones del carrito
    modal.querySelectorAll('.btn-eliminar-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.btn-eliminar-item').dataset.id);
            eliminarDelCarrito(id, modal);
        });
    });
    
    modal.querySelectorAll('.btn-cantidad').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.closest('.item-carrito').dataset.id);
            const accion = e.target.classList.contains('btn-mas') ? 'aumentar' : 'disminuir';
            modificarCantidad(id, accion, modal);
        });
    });
    
    // Finalizar compra
    const btnFinalizar = modal.querySelector('.btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            window.location.href = 'tienda.html?checkout=true';
        });
    }
}

function generarHTMLCarrito() {
    return `
        <div class="lista-carrito">
            ${carrito.map(item => `
                <div class="item-carrito" data-id="${item.id}">
                    <div class="item-info">
                        <h4>${item.nombre}</h4>
                        <p class="item-categoria">${item.categoria}</p>
                        <p class="item-precio">$${item.precio.toLocaleString()}</p>
                    </div>
                    <div class="item-controles">
                        <div class="cantidad-controles">
                            <button class="btn-cantidad btn-menos"><i class="fas fa-minus"></i></button>
                            <span class="cantidad-valor">${item.cantidad}</span>
                            <button class="btn-cantidad btn-mas"><i class="fas fa-plus"></i></button>
                        </div>
                        <button class="btn-eliminar-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function calcularTotal() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function eliminarDelCarrito(id, modal) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarBadgeCarrito();
    cerrarModal(modal);
    mostrarNotificacion('Producto eliminado del carrito', 'info');
}

function modificarCantidad(id, accion, modal) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        if (accion === 'aumentar') {
            item.cantidad++;
        } else if (accion === 'disminuir' && item.cantidad > 1) {
            item.cantidad--;
        }
        guardarCarrito();
        actualizarBadgeCarrito();
        
        // Actualizar solo el modal
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = generarHTMLCarrito();
        const totalElement = modal.querySelector('.total-carrito strong');
        if (totalElement) {
            totalElement.textContent = `$${calcularTotal().toLocaleString()}`;
        }
        
        // Re-agregar event listeners
        modal.querySelectorAll('.btn-eliminar-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.btn-eliminar-item').dataset.id);
                eliminarDelCarrito(id, modal);
            });
        });
        
        modal.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.item-carrito').dataset.id);
                const accion = e.target.classList.contains('btn-mas') ? 'aumentar' : 'disminuir';
                modificarCantidad(id, accion, modal);
            });
        });
    }
}

function cerrarModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

// ========== FAVORITOS ==========
function inicializarProductos() {
    // Favoritos
    document.querySelectorAll('.btn-icon .fa-heart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleFavorito(e.target);
        });
    });
    
    // Vista rápida
    document.querySelectorAll('.btn-icon .fa-eye').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productoCard = e.target.closest('.producto-card');
            if (productoCard) {
                mostrarVistaRapida(productoCard);
            }
        });
    });
}

function toggleFavorito(iconoHeart) {
    const productoCard = iconoHeart.closest('.producto-card');
    const nombre = productoCard.querySelector('h3').textContent;
    
    if (favoritosSet.has(nombre)) {
        favoritosSet.delete(nombre);
        iconoHeart.classList.remove('favorito');
        iconoHeart.classList.remove('fas');
        iconoHeart.classList.add('far');
        mostrarNotificacion('Eliminado de favoritos', 'info');
    } else {
        favoritosSet.add(nombre);
        iconoHeart.classList.add('favorito');
        iconoHeart.classList.remove('far');
        iconoHeart.classList.add('fas');
        mostrarNotificacion('❤️ Agregado a favoritos', 'success');
    }
    
    localStorage.setItem('favoritosHidroplant', JSON.stringify([...favoritosSet]));
}

function mostrarVistaRapida(productoCard) {
    const nombre = productoCard.querySelector('h3').textContent;
    const descripcion = productoCard.querySelector('.descripcion').textContent;
    const precio = productoCard.querySelector('.precio').textContent;
    const categoria = productoCard.querySelector('.categoria').textContent;
    const rating = productoCard.querySelectorAll('.rating .fas.fa-star').length;
    
    const modal = document.createElement('div');
    modal.className = 'modal-carrito modal-vista-rapida';
    modal.innerHTML = `
        <div class="modal-contenido">
            <button class="btn-cerrar-modal"><i class="fas fa-times"></i></button>
            <div class="vista-rapida-grid">
                <div class="vista-imagen">
                    <div class="imagen-placeholder grande">
                        <i class="fas fa-spa"></i>
                    </div>
                </div>
                <div class="vista-info">
                    <span class="categoria">${categoria}</span>
                    <h2>${nombre}</h2>
                    <div class="rating">
                        ${'<i class="fas fa-star"></i>'.repeat(rating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - rating)}
                    </div>
                    <p class="descripcion">${descripcion}</p>
                    <div class="precio-grande">${precio}</div>
                    <div class="vista-acciones">
                        <button class="btn btn-primary btn-agregar-vista">
                            <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="vista-detalles">
                        <h4><i class="fas fa-check-circle"></i> Beneficios</h4>
                        <ul>
                            <li>100% natural y orgánico</li>
                            <li>Libre de crueldad animal</li>
                            <li>Ingredientes del Eje Cafetero</li>
                            <li>Elaborado artesanalmente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.btn-cerrar-modal').addEventListener('click', () => cerrarModal(modal));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal(modal);
    });
    
    modal.querySelector('.btn-agregar-vista').addEventListener('click', () => {
        agregarAlCarrito(productoCard);
        cerrarModal(modal);
    });
}

// ========== SCROLL TO TOP ==========
function inicializarScrollTop() {
    const btnScrollTop = document.querySelector('#btn-scroll-top');
    
    if (btnScrollTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                btnScrollTop.classList.add('visible');
            } else {
                btnScrollTop.classList.remove('visible');
            }
        });
        
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========== ANIMACIONES ==========
function inicializarAnimaciones() {
    // Intersection Observer para animaciones al scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observar elementos
    document.querySelectorAll('.producto-card, .categoria-card, .testimonio-card, .blog-card').forEach(el => {
        observer.observe(el);
    });
    
    // Scroll suave para links ancla
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ========== FORMULARIOS ==========
function inicializarFormularios() {
    // Newsletter
    const formNewsletter = document.querySelector('.newsletter-form form');
    if (formNewsletter) {
        formNewsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = formNewsletter.querySelector('input[type="email"]').value;
            
            if (validarEmail(email)) {
                mostrarNotificacion('¡Gracias por suscribirte! 🎉 Revisa tu correo', 'success');
                formNewsletter.reset();
            } else {
                mostrarNotificacion('Por favor ingresa un correo válido', 'error');
            }
        });
    }
    
    // Formulario de contacto (si existe)
    const formContacto = document.querySelector('#form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = formContacto.querySelector('[name="nombre"]').value;
            const email = formContacto.querySelector('[name="email"]').value;
            const mensaje = formContacto.querySelector('[name="mensaje"]').value;
            
            if (nombre && validarEmail(email) && mensaje) {
                mostrarNotificacion('✅ Mensaje enviado correctamente. Te responderemos pronto!', 'success');
                formContacto.reset();
            } else {
                mostrarNotificacion('Por favor completa todos los campos correctamente', 'error');
            }
        });
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ========== NOTIFICACIONES ==========
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    
    const iconos = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    notificacion.innerHTML = `
        <i class="fas ${iconos[tipo]}"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => notificacion.classList.add('show'), 10);
    
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// ========== FILTROS DE PRODUCTOS (Para página de productos) ==========
function inicializarFiltros() {
    const btnsFiltro = document.querySelectorAll('.filtro-btn');
    
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            btnsFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const categoria = btn.dataset.categoria;
            filtrarProductos(categoria);
        });
    });
}

function filtrarProductos(categoria) {
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const categoriaProducto = producto.querySelector('.categoria').textContent.trim().toLowerCase();
        
        if (categoria === 'todos' || categoriaProducto.includes(categoria.toLowerCase())) {
            producto.style.display = 'block';
            setTimeout(() => producto.classList.add('animate-in'), 10);
        } else {
            producto.style.display = 'none';
        }
    });
}

// ========== BÚSQUEDA (Para página de productos) ==========
function inicializarBusqueda() {
    const inputBusqueda = document.querySelector('#busqueda-productos');
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase();
            buscarProductos(termino);
        });
    }
}

function buscarProductos(termino) {
    const productos = document.querySelectorAll('.producto-card');
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        const descripcion = producto.querySelector('.descripcion').textContent.toLowerCase();
        
        if (nombre.includes(termino) || descripcion.includes(termino)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

// ========== UTILIDADES ==========
// Formatear precio
function formatearPrecio(numero) {
    return `$${numero.toLocaleString()}`;
}

// Generar ID único
function generarID() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// ========== EFECTOS ESPECIALES ==========
// Efecto parallax en hero
window.addEventListener('scroll', () => {
    const heroImagen = document.querySelector('.hero-imagen');
    if (heroImagen) {
        const scrolled = window.pageYOffset;
        heroImagen.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Badges flotantes animados
const floatingBadges = document.querySelectorAll('.floating-badge');
floatingBadges.forEach((badge, index) => {
    setInterval(() => {
        badge.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 10}px)`;
    }, 50);
});

// ========== INICIALIZAR FUNCIONES ESPECÍFICAS SEGÚN LA PÁGINA ==========
if (window.location.pathname.includes('productos.html') || window.location.pathname.includes('tienda.html')) {
    inicializarFiltros();
    inicializarBusqueda();
}

console.log('✨ Hidroplant - Sistema inicializado correctamente');