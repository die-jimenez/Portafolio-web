class MiniImageGallery {
    constructor() {

        //Imagen o video principal
        this.mediaDisplay = document.getElementById('mediaDisplay');
        //Solo imagen
        this.mainImageContainer = document.getElementById('mainImageContainer');
        this.mainImage = this.mainImageContainer?.querySelector('img');
        //Video + thumbnail
        this.videoContainer = document.getElementById('videoContainer');
        this.videoThumbnail = this.videoContainer?.querySelector('.video-overlay img');

        if (this.videoContainer) {
            this.initVideo();
        }
        this.updateMainImageVisibility();

        //Slider de miniaturas
        this.galleryTrack = document.getElementById('miniGalleryTrack');
        this.galleryItems = document.querySelectorAll('.mini-gallery-item');

        //Barra de scroll
        this.scrollbarThumb = document.getElementById('miniGalleryScrollbarThumb');
        this.scrollbarTrack = this.scrollbarThumb?.parentElement;
        this.prevBtn = document.getElementById('miniGalleryPrevBtn');
        this.nextBtn = document.getElementById('miniGalleryNextBtn');

        this.currentPosition = 0;
        this.itemWidth = 310;

        this.isDragging = false;
        this.startX = 0;
        this.startScrollPosition = 0;


        if (this.galleryTrack === null) {
            console.warn('No existe el slider de imagenes');
            return;
        }

        this.visibleWidth = this.calculateVisibleWidth();
        this.maxPosition = this.calculateMaxPosition();
        this.initScroll();
    }

    initScroll() {
        this.setupScrollbar();
        this.bindEvents();
        this.updateButtonStates();
        this.setupMainImageDisplay();

        window.addEventListener('resize', () => {
            this.visibleWidth = this.calculateVisibleWidth();
            this.maxPosition = this.calculateMaxPosition();
            this.setupScrollbar();
            this.updateButtonStates();
        });
    }

    initVideo() {
        this.setUpVideoToPlay();
    }

setUpVideoToPlay() {
    const _videoContainer = this.videoContainer;
    const overlay = _videoContainer?.querySelector('.video-overlay');
    const iframe = _videoContainer?.querySelector('.video-iframe');

    if (!overlay || !iframe) {
        console.warn('Estructura de video incompleta');
        return;
    }

    overlay.addEventListener('click', () => { 
        if (!iframe.hasAttribute('src')) {
            iframe.src = iframe.dataset.src;
        }
        _videoContainer?.classList.add('playing');
    });
}

resetVideo() {
    if (!this.videoContainer) return;

    const iframe = this.videoContainer.querySelector('.video-iframe');
    if (!iframe) return;

    // Esto resetea el iframe a su estado original.
    iframe.removeAttribute('src');

    this.videoContainer.classList.remove('playing');
}



    calculateVisibleWidth() {
        return this.galleryTrack.parentElement.offsetWidth;
    }

    calculateMaxPosition() {
        const totalItems = this.galleryTrack.children.length;
        const totalWidth = totalItems * this.itemWidth - 10;
        return Math.max(0, totalWidth - this.visibleWidth);
    }

    setupScrollbar() {
        const totalWidth = this.galleryTrack.children.length * this.itemWidth - 10;
        const thumbWidthPercent = (this.visibleWidth / totalWidth) * 100;
        this.scrollbarThumb.style.width = Math.min(100, Math.max(20, thumbWidthPercent)) + '%';
        this.updateScrollbarPosition();
    }

    bindEvents() {
        this.scrollbarThumb.addEventListener('mousedown', this.startDrag.bind(this));
        this.scrollbarTrack.addEventListener('click', this.trackClick.bind(this));

        this.prevBtn?.addEventListener('click', this.scrollPrev.bind(this));
        this.nextBtn?.addEventListener('click', this.scrollNext.bind(this));

        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));

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
        this.updateGalleryPosition(true);
        this.updateScrollbarPositionAnimated();
        this.updateButtonStates();
    }

    updateScrollbarPositionAnimated() {
        const trackWidth = this.scrollbarTrack.offsetWidth;
        const thumbWidth = this.scrollbarThumb.offsetWidth;
        const maxThumbPosition = trackWidth - thumbWidth;

        const scrollRatio = this.maxPosition > 0 ? this.currentPosition / this.maxPosition : 0;
        const thumbPosition = scrollRatio * maxThumbPosition;

        this.scrollbarThumb.style.transition = 'left 0.3s ease';
        this.scrollbarThumb.style.left = thumbPosition + 'px';

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

    setupMainImageDisplay() {
        if (!this.galleryItems?.length || !this.mediaDisplay) {
            console.warn('No se encontraron los elementos necesarios para media display');
            return;
        }

        this.updateMainImageVisibility();

        this.galleryItems.forEach(item => {
            if (!item.hasAttribute('data-type')) {
                item.setAttribute('data-type', 'image');
            }
            const type = item.getAttribute('data-type');

            if (type === 'video') {
                const playIcon = document.createElement('div');
                const textIcon = document.createElement('span');
                playIcon.className = 'mini-gallery-play-icon';
                textIcon.innerHTML = '▶';
                item.appendChild(playIcon);
                playIcon.appendChild(textIcon);
            }

            item.addEventListener('click', () => {
                const smallImg = item.querySelector('img');

                if (smallImg) {
                    const smallImgSrc = smallImg.getAttribute('src');

                    if (type === 'video') {
                        this.mediaDisplay.setAttribute('data-display', 'video');
                        this.videoThumbnail?.setAttribute('src', smallImgSrc);
                        this.updateMainImageVisibility();
                    }
                    else if (type === 'image') {
                        this.mediaDisplay.setAttribute('data-display', 'image');
                        this.mainImage?.setAttribute('src', smallImgSrc);
                        this.updateMainImageVisibility();
                        this.resetVideo();
                    }
                }
            });
        });
    }

    updateMainImageVisibility () {
        if (!this.mediaDisplay || !this.videoContainer || !this.mainImageContainer) return;
        
        if(!this.mediaDisplay.hasAttribute('data-display')){
            this.mediaDisplay.setAttribute('data-display', 'image');
        }
        const displayType = this.mediaDisplay.getAttribute('data-display');

        if (displayType === 'video') {
            this.videoContainer.style.display = 'block';
            this.mainImageContainer.style.display = 'none';
        } else if (displayType === 'image') {
            this.mainImageContainer.style.display = 'block';
            this.videoContainer.style.display = 'none';
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    new MiniImageGallery();
});