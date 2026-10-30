import { pinterestSaveUrl } from '@/lib/pinterest';

/**
 * Botón "Guardar en Pinterest". Es un enlace normal al formulario oficial de Pinterest:
 * no carga pinit.js ni ningún otro script de terceros (decisión del sitio: solo AdSense),
 * así que no rastrea a nadie hasta que la persona decide hacer clic.
 * Pinterest recibe la URL canónica, la foto de portada y la descripción del pin.
 */
export default function PinterestSaveButton({ url, image, description, label }: {
  url: string;
  image: string | null;
  description: string;
  label: string;
}) {
  if (!image) return null;
  return (
    <a
      className="md-button-quiet md-pinterest-save"
      href={pinterestSaveUrl({ url, image, description })}
      target="_blank"
      rel="noopener noreferrer nofollow"
      data-pin-do="none"
    >
      {label}
    </a>
  );
}
