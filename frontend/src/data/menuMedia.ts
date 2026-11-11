export interface MenuPhotoAsset {
  src: string;
  credit?: string;
  creditUrl?: string;
}

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=900&q=82`;

export const menuPhotoByName: Record<string, MenuPhotoAsset> = {
  'Nasi Goreng': { src: unsplash('photo-1512058564366-18510be2db19') },
  'Ayam Geprek': { src: unsplash('photo-1626082927389-6cd097cdc6ec') },
  'Es Teh Manis': { src: unsplash('photo-1556679343-c7306c1976bc') },
  'Jus Alpukat': { src: unsplash('photo-1623065422902-30a2d299bbe4') },
  'Tinutuan (Bubur Manado)': {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Tinutuan_bubur_Manado.JPG/500px-Tinutuan_bubur_Manado.JPG',
    credit: 'Midori · CC BY-SA 3.0',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Tinutuan_bubur_Manado.JPG',
  },
  'Ayam Woku': { src: unsplash('photo-1604908176997-125f25cc6f3d') },
  'Kentang Goreng': { src: unsplash('photo-1573080496219-bb080dd4f877') },
  'Roti Bakar': { src: unsplash('photo-1484723091739-30a097e8f929') },
  'Mie Ayam': { src: unsplash('photo-1569718212165-3a8278d5f624') },
  'Es Jeruk': { src: unsplash('photo-1600271886742-f049cd451bba') },
};

export function getMenuPhoto(name: string): MenuPhotoAsset | null {
  return menuPhotoByName[name] ?? null;
}