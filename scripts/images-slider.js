class MiniImageGallery {
            constructor() {
                this.galleryTrack = document.getElementById('miniGalleryTrack');
                this.scrollbarThumb = document.getElementById('miniGalleryScrollbarThumb');
                this.scrollbarTrack = this.scrollbarThumb.parentElement;
                this.prevBtn = document.getElementById('miniGalleryPrevBtn');
                this.nextBtn = document.getElementById('miniGalleryNextBtn');
                
                this.currentPosition = 0;
                this.itemWidth = 310; // 300px imagen + 10px gap
                this.visibleWidth = this.calculateVisibleWidth();
                this.maxPosition = this.calculateMaxPosition();
                // Los botones ahora avanzan de a 1 imagen
                
                this.isDragging = false;
                this.startX = 0;
                this.startScrollPosition = 0;
                
                this.init();
            }
            
            init() {
                this.setupScrollbar();
                this.bindEvents();
                this.updateButtonStates();
                
                // Recalcular cuando cambie el tamaño de ventana
                window.addEventListener('resize', () => {
                    this.visibleWidth = this.calculateVisibleWidth();
                    this.maxPosition = this.calculateMaxPosition();
                    this.setupScrollbar();
                    this.updateButtonStates();
                });
            }
            
            calculateVisibleWidth() {
                return this.galleryTrack.parentElement.offsetWidth;
            }
            
            calculateMaxPosition() {
                const totalItems = this.galleryTrack.children.length;
                const totalWidth = totalItems * this.itemWidth - 10; // Restamos el último gap
                return Math.max(0, totalWidth - this.visibleWidth);
            }
            
            setupScrollbar() {
                // Calculamos el ancho del thumb basado en la proporción visible
                const totalWidth = this.galleryTrack.children.length * this.itemWidth - 10;
                const thumbWidthPercent = (this.visibleWidth / totalWidth) * 100;
                this.scrollbarThumb.style.width = Math.min(100, Math.max(20, thumbWidthPercent)) + '%';
                
                this.updateScrollbarPosition();
            }
            
            bindEvents() {
                // Eventos del scrollbar
                this.scrollbarThumb.addEventListener('mousedown', this.startDrag.bind(this));
                this.scrollbarTrack.addEventListener('click', this.trackClick.bind(this));
                
                // Eventos de los botones de navegación
                this.prevBtn.addEventListener('click', this.scrollPrev.bind(this));
                this.nextBtn.addEventListener('click', this.scrollNext.bind(this));
                
                // Eventos globales para el drag
                document.addEventListener('mousemove', this.drag.bind(this));
                document.addEventListener('mouseup', this.endDrag.bind(this));
                
                // Prevenir selección de texto durante el drag
                this.scrollbarThumb.addEventListener('selectstart', (e) => e.preventDefault());
            }
            
            scrollPrev() {
                const newPosition = Math.max(0, this.currentPosition - this.itemWidth);
                this.animateToPosition(newPosition);
            }
            
            scrollNext() {
                const newPosition = Math.min(this.maxPosition, this.currentPosition + this.itemWidth);
                this.animateToPosition(newPosition);
            }
            
            animateToPosition(targetPosition) {
                this.currentPosition = targetPosition;
                this.updateGalleryPosition(true); // true para habilitar transición
                this.updateScrollbarPositionAnimated();
                this.updateButtonStates();
            }
            
            updateScrollbarPositionAnimated() {
                const trackWidth = this.scrollbarTrack.offsetWidth;
                const thumbWidth = this.scrollbarThumb.offsetWidth;
                const maxThumbPosition = trackWidth - thumbWidth;
                
                const scrollRatio = this.maxPosition > 0 ? this.currentPosition / this.maxPosition : 0;
                const thumbPosition = scrollRatio * maxThumbPosition;
                
                // Agregar transición suave al thumb
                this.scrollbarThumb.style.transition = 'left 0.3s ease';
                this.scrollbarThumb.style.left = thumbPosition + 'px';
                
                // Remover la transición después de la animación para no interferir con el drag
                setTimeout(() => {
                    this.scrollbarThumb.style.transition = '';
                }, 300);
            }
            
            updateButtonStates() {
                this.prevBtn.disabled = this.currentPosition <= 0;
                this.nextBtn.disabled = this.currentPosition >= this.maxPosition;
            }
            
            startDrag(e) {
                this.isDragging = true;
                this.startX = e.clientX;
                this.startScrollPosition = this.currentPosition;
                e.preventDefault();
            }
            
            drag(e) {
                if (!this.isDragging) return;
                
                e.preventDefault();
                const deltaX = e.clientX - this.startX;
                const trackWidth = this.scrollbarTrack.offsetWidth;
                const thumbWidth = this.scrollbarThumb.offsetWidth;
                const maxThumbPosition = trackWidth - thumbWidth;
                
                // Convertimos el movimiento del mouse a posición de scroll
                const scrollRatio = deltaX / maxThumbPosition;
                const newPosition = this.startScrollPosition + (scrollRatio * this.maxPosition);
                
                this.currentPosition = Math.max(0, Math.min(this.maxPosition, newPosition));
                this.updateGalleryPosition();
                this.updateScrollbarPosition();
                this.updateButtonStates();
            }
            
            endDrag() {
                this.isDragging = false;
            }
            
            trackClick(e) {
                if (e.target === this.scrollbarThumb) return;
                
                const rect = this.scrollbarTrack.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const trackWidth = this.scrollbarTrack.offsetWidth;
                const thumbWidth = this.scrollbarThumb.offsetWidth;
                
                // Calculamos la nueva posición basada en el click
                const clickRatio = (clickX - thumbWidth / 2) / (trackWidth - thumbWidth);
                this.currentPosition = Math.max(0, Math.min(this.maxPosition, clickRatio * this.maxPosition));
                
                this.updateGalleryPosition(true);
                this.updateScrollbarPosition();
                this.updateButtonStates();
            }
            
            updateGalleryPosition(enableTransition = false) {
                this.galleryTrack.style.transform = `translateX(-${this.currentPosition}px)`;
                this.galleryTrack.style.transition = (this.isDragging || !enableTransition) ? 'none' : 'transform 0.3s ease';
            }
            
            updateScrollbarPosition() {
                const trackWidth = this.scrollbarTrack.offsetWidth;
                const thumbWidth = this.scrollbarThumb.offsetWidth;
                const maxThumbPosition = trackWidth - thumbWidth;
                
                const scrollRatio = this.maxPosition > 0 ? this.currentPosition / this.maxPosition : 0;
                const thumbPosition = scrollRatio * maxThumbPosition;
                
                this.scrollbarThumb.style.left = thumbPosition + 'px';
            }
        }

        // Inicializar la galería cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            new MiniImageGallery();
        });