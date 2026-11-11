import { getMenuPhoto } from '../data/menuMedia';

const featuredItems = ['Nasi Goreng', 'Ayam Geprek', 'Es Teh Manis'];

export function AuthFoodGallery() {
  return (
    <div className="auth-food-gallery" aria-label="Pilihan menu kantin">
      {featuredItems.map((name) => {
        const photo = getMenuPhoto(name);
        if (!photo) return null;

        return (
          <figure className="auth-food-gallery__item" key={name}>
            <div className="auth-food-gallery__image-wrap">
              <img src={photo.src} alt={`Foto representatif ${name}`} loading="eager" decoding="async" />
            </div>
            <figcaption>{name}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}