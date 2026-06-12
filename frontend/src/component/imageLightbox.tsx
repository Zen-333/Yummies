import { useEffect } from "react"
import "../styles/imageLightbox.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"

interface ImageLightboxProps {
    images: string[]
    currentIndex: number
    onClose: () => void
    onNext: () => void
    onPrev: () => void
}

function ImageLightbox({ images, currentIndex, onClose, onNext, onPrev }: ImageLightboxProps) {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowRight") onNext()
            if (e.key === "ArrowLeft") onPrev()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onClose, onNext, onPrev])

    return (
        <div className="lightbox__overlay" onClick={onClose}>

            <button className="lightbox__close btn" onClick={onClose}>
                <FontAwesomeIcon icon={faX} />
            </button>

            {images.length > 1 && (
                <button
                    className="lightbox__nav lightbox__nav--prev btn"
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            )}

            <div className="lightbox__img-container" onClick={(e) => e.stopPropagation()}>
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1} of ${images.length}`}
                    className="lightbox__img"
                />
            </div>

            {images.length > 1 && (
                <button
                    className="lightbox__nav lightbox__nav--next btn"
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            )}

            {images.length > 1 && (
                <div className="lightbox__counter">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

        </div>
    )
}

export default ImageLightbox