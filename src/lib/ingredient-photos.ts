import type { MdLanguage } from '@/components/md/md-types';

export type IngredientPhoto = { src: string; author: string; source: string; license: string; licenseUrl: string };

// Reviewed photographs of the FOOD itself. Source and reusable license accompany every asset.
// Unavailable subjects deliberately have no image; never borrow a photograph of a recipe.
const PHOTOS: Record<string, IngredientPhoto> = {
  "aceite-de-canola": {
    "src": "/ingredientes/aceite-de-canola.webp",
    "author": "Veganbaking.net",
    "source": "https://commons.wikimedia.org/wiki/File:Canola_Oil_(4107885913)_Cropped.jpg",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "aceite-de-oliva": {
    "src": "/ingredientes/aceite-de-oliva.webp",
    "author": "Poyraz 72",
    "source": "https://commons.wikimedia.org/wiki/File:Oliven_V1.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "aceite-vegetal": {
    "src": "/ingredientes/aceite-vegetal.webp",
    "author": "Lemone",
    "source": "https://commons.wikimedia.org/wiki/File:Olive_oil_from_Oneglia.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "achiote": {
    "src": "/ingredientes/achiote.webp",
    "author": "Leonardo Ré-Jorge",
    "source": "https://commons.wikimedia.org/wiki/File:Bixa_orellana_fruit_open.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "agua-con-gas": {
    "src": "/ingredientes/agua-con-gas.webp",
    "author": "Nevit Dilmen (talk)",
    "source": "https://commons.wikimedia.org/wiki/File:Drinking_glass_00118.gif",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "almendras": {
    "src": "/ingredientes/almendras.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Almonds_-_in_shell,_shell_cracked_open,_shelled,_blanched.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "almidon-de-maiz": {
    "src": "/ingredientes/almidon-de-maiz.webp",
    "author": "Picasa author kalaya",
    "source": "https://commons.wikimedia.org/wiki/File:Cornstarch_mixed_with_water.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "arequipe": {
    "src": "/ingredientes/arequipe.webp",
    "author": "audinou from Paris, France",
    "source": "https://commons.wikimedia.org/wiki/File:DulceDeLeche.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "arroz-blanco-cocido": {
    "src": "/ingredientes/arroz-blanco-cocido.webp",
    "author": "Ocdp",
    "source": "https://commons.wikimedia.org/wiki/File:Meshi_001.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "arroz-integral": {
    "src": "/ingredientes/arroz-integral.webp",
    "author": "Wikimedia Commons contributors",
    "source": "https://commons.wikimedia.org/wiki/File:Reis_-_Sorte_C_voll.jpg",
    "license": "CC BY-SA 2.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/de/deed.en"
  },
  "arveja-amarilla": {
    "src": "/ingredientes/arveja-amarilla.webp",
    "author": "Sanjay Acharya",
    "source": "https://commons.wikimedia.org/wiki/File:Split_pea.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "azucar": {
    "src": "/ingredientes/azucar.webp",
    "author": "Romain Behar",
    "source": "https://commons.wikimedia.org/wiki/File:Sucre_blanc_cassonade_complet_rapadura.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "boniato": {
    "src": "/ingredientes/boniato.webp",
    "author": "Llez",
    "source": "https://commons.wikimedia.org/wiki/File:Ipomoea_batatas_006.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "brandy": {
    "src": "/ingredientes/brandy.webp",
    "author": "Didier Descouens",
    "source": "https://commons.wikimedia.org/wiki/File:Cognac_glass.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "calabacin": {
    "src": "/ingredientes/calabacin.webp",
    "author": "Evan-Amos",
    "source": "https://commons.wikimedia.org/wiki/File:CSA-Striped-Zucchini.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "canela-en-rama": {
    "src": "/ingredientes/canela-en-rama.webp",
    "author": "Simon A. Eugster",
    "source": "https://commons.wikimedia.org/wiki/File:Cinnamomum_verum_spices.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "canela-molida": {
    "src": "/ingredientes/canela-molida.webp",
    "author": "Simon A. Eugster",
    "source": "https://commons.wikimedia.org/wiki/File:Cinnamomum_verum_spices.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "carne-de-cerdo": {
    "src": "/ingredientes/carne-de-cerdo.webp",
    "author": "Rainer Zenz",
    "source": "https://commons.wikimedia.org/wiki/File:Schweinebauch-2.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "carne-desmechada": {
    "src": "/ingredientes/carne-desmechada.webp",
    "author": "David Boté Estrada from Suzhou, People's Republic of China",
    "source": "https://commons.wikimedia.org/wiki/File:Shredded_beef.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "carne-molida-de-res": {
    "src": "/ingredientes/carne-molida-de-res.webp",
    "author": "No machine-readable author provided. Rainer Zenz assumed (based on copyright claims).",
    "source": "https://commons.wikimedia.org/wiki/File:Hackfleisch-1.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "cascara-de-naranja-confitada": {
    "src": "/ingredientes/cascara-de-naranja-confitada.webp",
    "author": "Hopefully acceptable username",
    "source": "https://commons.wikimedia.org/wiki/File:Candied_Fruit_-_La_Boquer%C3%ADa.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "cebolla": {
    "src": "/ingredientes/cebolla.webp",
    "author": "Colin",
    "source": "https://commons.wikimedia.org/wiki/File:Mixed_onions.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "cebolla-larga": {
    "src": "/ingredientes/cebolla-larga.webp",
    "author": "Evan-Amos",
    "source": "https://commons.wikimedia.org/wiki/File:CSA-Red-Spring-Onions.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "cebolleta": {
    "src": "/ingredientes/cebolleta.webp",
    "author": "Evan-Amos",
    "source": "https://commons.wikimedia.org/wiki/File:CSA-Red-Spring-Onions.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "chalota": {
    "src": "/ingredientes/chalota.webp",
    "author": "No machine-readable author provided. Charles P. assumed (based on copyright claims).",
    "source": "https://commons.wikimedia.org/wiki/File:Shallots_-_sliced_and_whole.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "champiñones": {
    "src": "/ingredientes/champiñones.webp",
    "author": "chris_73",
    "source": "https://commons.wikimedia.org/wiki/File:ChampignonMushroom.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "chocolate-negro": {
    "src": "/ingredientes/chocolate-negro.webp",
    "author": "Mx. Granger",
    "source": "https://commons.wikimedia.org/wiki/File:Green_and_Black%27s_dark_chocolate_bar_2.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "ciruelas-pasas": {
    "src": "/ingredientes/ciruelas-pasas.webp",
    "author": "Emőke Dénes",
    "source": "https://commons.wikimedia.org/wiki/File:Rosales_-_Dried_Prunus_domestica_d.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "concentrado-de-tomate": {
    "src": "/ingredientes/concentrado-de-tomate.webp",
    "author": "SKopp",
    "source": "https://commons.wikimedia.org/wiki/File:Tomato_paste_on_spoon.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "crema-de-coco-endulzada": {
    "src": "/ingredientes/crema-de-coco-endulzada.webp",
    "author": "wfairchild",
    "source": "https://commons.wikimedia.org/wiki/File:Coconut_cream_(cropped).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "extracto-de-vainilla": {
    "src": "/ingredientes/extracto-de-vainilla.webp",
    "author": "Itineranttrader",
    "source": "https://commons.wikimedia.org/wiki/File:VanillaExtract.png",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "frambuesas": {
    "src": "/ingredientes/frambuesas.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Raspberry_-_halved_(Rubus_idaeus).jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "fresas": {
    "src": "/ingredientes/fresas.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Garden_strawberry_(Fragaria_%C3%97_ananassa)_single2.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "frijol-cargamanto": {
    "src": "/ingredientes/frijol-cargamanto.webp",
    "author": "Bean appreciator",
    "source": "https://commons.wikimedia.org/wiki/File:Roman_beans.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "frijoles-refritos": {
    "src": "/ingredientes/frijoles-refritos.webp",
    "author": "Karyn Christner",
    "source": "https://commons.wikimedia.org/wiki/File:Frijoles_refritos.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "frutas-deshidratadas": {
    "src": "/ingredientes/frutas-deshidratadas.webp",
    "author": "Gilabrand (talk)",
    "source": "https://commons.wikimedia.org/wiki/File:DriedfruitS.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "galletas-dulces-sencillas": {
    "src": "/ingredientes/galletas-dulces-sencillas.webp",
    "author": "GOLDIEM J",
    "source": "https://commons.wikimedia.org/wiki/File:Bourbon_and_Custard_Cream.jpeg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "guascas": {
    "src": "/ingredientes/guascas.webp",
    "author": "Juan Carlos Fonseca Mata",
    "source": "https://commons.wikimedia.org/wiki/File:Estrellitas_(Galinsoga_parviflora).jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "hielo": {
    "src": "/ingredientes/hielo.webp",
    "author": "Darren Hester",
    "source": "https://commons.wikimedia.org/wiki/File:Ice_cubes_openphoto.jpg",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "hojas-de-platano": {
    "src": "/ingredientes/hojas-de-platano.webp",
    "author": "Ted Garvin",
    "source": "https://commons.wikimedia.org/wiki/File:Banana-leaf-1.JPG",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "jugo-de-naranja": {
    "src": "/ingredientes/jugo-de-naranja.webp",
    "author": "rawpixel.com",
    "source": "https://commons.wikimedia.org/wiki/File:Orangejuice.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "ketchup": {
    "src": "/ingredientes/ketchup.webp",
    "author": "Kim Holger Kelting",
    "source": "https://commons.wikimedia.org/wiki/File:Ketchup_20160918_181342_(cropped).jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "laurel": {
    "src": "/ingredientes/laurel.webp",
    "author": "Miansari66",
    "source": "https://commons.wikimedia.org/wiki/File:Bay_Leaves.JPG",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "leche": {
    "src": "/ingredientes/leche.webp",
    "author": "NIAID",
    "source": "https://commons.wikimedia.org/wiki/File:Glass_of_Milk_(33657535532).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "leche-condensada": {
    "src": "/ingredientes/leche-condensada.webp",
    "author": "Superbass",
    "source": "https://commons.wikimedia.org/wiki/File:2016-03-26-Gezuckerte_Kondensmilch-4699.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "leche-de-almendras": {
    "src": "/ingredientes/leche-de-almendras.webp",
    "author": "Amazing Almonds",
    "source": "https://commons.wikimedia.org/wiki/File:Home-made_almond_milk,_November_2012.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "lentejas": {
    "src": "/ingredientes/lentejas.webp",
    "author": "User:Justinc",
    "source": "https://commons.wikimedia.org/wiki/File:3_types_of_lentil.png",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "mango": {
    "src": "/ingredientes/mango.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Mangos_-_single_and_halved.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "manteca-de-cerdo": {
    "src": "/ingredientes/manteca-de-cerdo.webp",
    "author": "No machine-readable author provided. Peter G Werner~commonswiki assumed (based on copyright claims).",
    "source": "https://commons.wikimedia.org/wiki/File:Homelard.jpg",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "mantequilla": {
    "src": "/ingredientes/mantequilla.webp",
    "author": "Matěj Baťha",
    "source": "https://commons.wikimedia.org/wiki/File:%C5%A0v%C3%A9dsk%C3%BD_kol%C3%A1%C4%8D_naruby_904_(cropped).JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "mayonesa": {
    "src": "/ingredientes/mayonesa.webp",
    "author": "jules",
    "source": "https://commons.wikimedia.org/wiki/File:Mayonnaise_(1).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "mazorca": {
    "src": "/ingredientes/mazorca.webp",
    "author": "Jonathunder",
    "source": "https://commons.wikimedia.org/wiki/File:CookedCornOnTheCob.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "melaza-de-cana": {
    "src": "/ingredientes/melaza-de-cana.webp",
    "author": "Badagnani",
    "source": "https://commons.wikimedia.org/wiki/File:Blackstrapmolasses.JPG",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "miel": {
    "src": "/ingredientes/miel.webp",
    "author": "Scott Bauer, USDA ARS",
    "source": "https://commons.wikimedia.org/wiki/File:Runny_hunny.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "mirin": {
    "src": "/ingredientes/mirin.webp",
    "author": "Badagnani",
    "source": "https://commons.wikimedia.org/wiki/File:Mirinbowl.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "mostaza-dijon": {
    "src": "/ingredientes/mostaza-dijon.webp",
    "author": "Rainer Zenz.",
    "source": "https://commons.wikimedia.org/wiki/File:Dijon_mustard_on_a_spoon_-_20051218.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "nueces": {
    "src": "/ingredientes/nueces.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Walnuts_-_whole_and_open_with_halved_kernel.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "pan-blanco": {
    "src": "/ingredientes/pan-blanco.webp",
    "author": "Rainer Zenz",
    "source": "https://commons.wikimedia.org/wiki/File:Wei%C3%9Fbrot-1.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "panceta-de-cerdo": {
    "src": "/ingredientes/panceta-de-cerdo.webp",
    "author": "Rainer Zenz",
    "source": "https://commons.wikimedia.org/wiki/File:Schweinebauch-2.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "panela": {
    "src": "/ingredientes/panela.webp",
    "author": "Camilo Sanchez at en.wikipedia",
    "source": "https://commons.wikimedia.org/wiki/File:Panela.JPG",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "papas": {
    "src": "/ingredientes/papas.webp",
    "author": "Scott Bauer, USDA ARS",
    "source": "https://commons.wikimedia.org/wiki/File:Patates.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "pasta-para-canelones": {
    "src": "/ingredientes/pasta-para-canelones.webp",
    "author": "Popo le Chien",
    "source": "https://commons.wikimedia.org/wiki/File:Cannelloni2.png",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "pimenton": {
    "src": "/ingredientes/pimenton.webp",
    "author": "Kham Tran - www.khamtran.com",
    "source": "https://commons.wikimedia.org/wiki/File:Green-Yellow-Red-Pepper-2009.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "pimenton-dulce": {
    "src": "/ingredientes/pimenton-dulce.webp",
    "author": "Marcosgarrido88",
    "source": "https://commons.wikimedia.org/wiki/File:Piment%C3%B3n_Tap_de_Cort%C3%AD_(cropped).jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "queso-mozzarella": {
    "src": "/ingredientes/queso-mozzarella.webp",
    "author": "Popo le Chien",
    "source": "https://commons.wikimedia.org/wiki/File:Mozzarella_di_bufala3.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "queso-parmesano": {
    "src": "/ingredientes/queso-parmesano.webp",
    "author": "Naturpuur",
    "source": "https://commons.wikimedia.org/wiki/File:Parmigiano_Reggiano,_Italien,_Europ%C3%A4ische_Union.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "queso-rallado": {
    "src": "/ingredientes/queso-rallado.webp",
    "author": "cyclonebill",
    "source": "https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Parmesan.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "queso-ricotta": {
    "src": "/ingredientes/queso-ricotta.webp",
    "author": "8w9d",
    "source": "https://commons.wikimedia.org/wiki/File:Ricotte_fresche.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "sake": {
    "src": "/ingredientes/sake.webp",
    "author": "Intforce",
    "source": "https://commons.wikimedia.org/wiki/File:Overflowing_sake_glass_in_masu.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "salsa-de-soja": {
    "src": "/ingredientes/salsa-de-soja.webp",
    "author": "국립국어원",
    "source": "https://commons.wikimedia.org/wiki/File:Soy_sauce_2.jpg",
    "license": "CC BY-SA 2.0 kr",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/kr/deed.en"
  },
  "salsa-de-tomate": {
    "src": "/ingredientes/salsa-de-tomate.webp",
    "author": "Dennis Klein klein2",
    "source": "https://commons.wikimedia.org/wiki/File:Fresh_Tomato_Sauce_(Unsplash).jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "salsa-worcestershire": {
    "src": "/ingredientes/salsa-worcestershire.webp",
    "author": "Ocdp",
    "source": "https://commons.wikimedia.org/wiki/File:Worcester_Sauce_001.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "sandia": {
    "src": "/ingredientes/sandia.webp",
    "author": "Fred Hsu (Wikipedia:User:Fred Hsu on en.wikipedia)",
    "source": "https://commons.wikimedia.org/wiki/File:Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "semillas-de-chia": {
    "src": "/ingredientes/semillas-de-chia.webp",
    "author": "Keegan Fields",
    "source": "https://commons.wikimedia.org/wiki/File:Seed_of_chia_(Salvia_hispanica)Salvia_hispanica_group.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "semillas-de-granada": {
    "src": "/ingredientes/semillas-de-granada.webp",
    "author": "Augustus Binu : flickr",
    "source": "https://commons.wikimedia.org/wiki/File:Pomegranate_Juice_(2019).jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "tahini": {
    "src": "/ingredientes/tahini.webp",
    "author": "Gilabrand",
    "source": "https://commons.wikimedia.org/wiki/File:Tahina.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "tocineta": {
    "src": "/ingredientes/tocineta.webp",
    "author": "Made20rder555",
    "source": "https://commons.wikimedia.org/wiki/File:Made20bacon.png",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "tofu": {
    "src": "/ingredientes/tofu.webp",
    "author": "DryPot",
    "source": "https://commons.wikimedia.org/wiki/File:Japanese_SilkyTofu_(Kinugoshi_Tofu).JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "tomate": {
    "src": "/ingredientes/tomate.webp",
    "author": "Softeis",
    "source": "https://commons.wikimedia.org/wiki/File:Tomato_je.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "tomates-cherry": {
    "src": "/ingredientes/tomates-cherry.webp",
    "author": "Luc Viatour",
    "source": "https://commons.wikimedia.org/wiki/File:Tomates_cerises_Luc_Viatour.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "tomates-secos": {
    "src": "/ingredientes/tomates-secos.webp",
    "author": "Andrew Deacon",
    "source": "https://commons.wikimedia.org/wiki/File:Sun-dried_tomatoes.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "tortillas-de-harina": {
    "src": "/ingredientes/tortillas-de-harina.webp",
    "author": "Wikimedia Commons contributors",
    "source": "https://commons.wikimedia.org/wiki/File:NCI_flour_tortillas.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "uvas": {
    "src": "/ingredientes/uvas.webp",
    "author": "Vyacheslav Argenberg",
    "source": "https://commons.wikimedia.org/wiki/File:Grapes,_Rostov-on-Don,_Russia.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "uvas-pasas": {
    "src": "/ingredientes/uvas-pasas.webp",
    "author": "Paweł Kuźniar (Jojo_1, Jojo)",
    "source": "https://commons.wikimedia.org/wiki/File:Raisins_01.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "vinagre-de-manzana": {
    "src": "/ingredientes/vinagre-de-manzana.webp",
    "author": "Veganbaking.net from USA",
    "source": "https://commons.wikimedia.org/wiki/File:Apple_Cider_Vinegar_(4108653248).jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "vino-blanco": {
    "src": "/ingredientes/vino-blanco.webp",
    "author": "André Karwath aka Aka",
    "source": "https://commons.wikimedia.org/wiki/File:White_Wine_Glas.jpg",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "vino-tinto": {
    "src": "/ingredientes/vino-tinto.webp",
    "author": "André Karwath aka Aka",
    "source": "https://commons.wikimedia.org/wiki/File:Red_Wine_Glass.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "yema-de-huevo": {
    "src": "/ingredientes/yema-de-huevo.webp",
    "author": "by jefras a.k.a Joăo Estęvăo A. de Freitas. \"There are no usage restrictions for this photo.\"",
    "source": "https://commons.wikimedia.org/wiki/File:Raw_egg.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "zanahoria": {
    "src": "/ingredientes/zanahoria.webp",
    "author": "Evan-Amos",
    "source": "https://commons.wikimedia.org/wiki/File:Vegetable-Carrot-Bundle-wStalks.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "zumo-de-pina": {
    "src": "/ingredientes/zumo-de-pina.webp",
    "author": "El Mono Español",
    "source": "https://commons.wikimedia.org/wiki/File:Batido_de_pi%C3%B1a.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "aceite-de-girasol": {
    "src": "/ingredientes/aceite-de-girasol.webp",
    "author": "Exgsp Gmbh LLC BOTTLE 1 liter Sunflower refined oil",
    "source": "https://commons.wikimedia.org/wiki/File:Bottle_1_liter_Sunflower_refined_oil.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "agua": {
    "src": "/ingredientes/agua.webp",
    "author": "Wikimedia Commons contributors",
    "source": "https://commons.wikimedia.org/wiki/File:Water_glass_MET_ES704.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "agua-fria": {
    "src": "/ingredientes/agua-fria.webp",
    "author": "Wikimedia Commons contributors",
    "source": "https://commons.wikimedia.org/wiki/File:Water_glass_MET_ES704.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "aguacate": {
    "src": "/ingredientes/aguacate.webp",
    "author": "Denis kasozi",
    "source": "https://commons.wikimedia.org/wiki/File:Ugandan_avocado_fruit_cut_on_the_plate.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "ajo": {
    "src": "/ingredientes/ajo.webp",
    "author": "Dubravko Sorić SoraZG on Flickr",
    "source": "https://commons.wikimedia.org/wiki/File:Opened_garlic_bulb_with_garlic_clove.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "alcaparras": {
    "src": "/ingredientes/alcaparras.webp",
    "author": "Rainer Zenz at German Wikipedia",
    "source": "https://commons.wikimedia.org/wiki/File:Kapern.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "alcaravea": {
    "src": "/ingredientes/alcaravea.webp",
    "author": "OttawaAC",
    "source": "https://commons.wikimedia.org/wiki/File:Caraway_Seed.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "arandanos": {
    "src": "/ingredientes/arandanos.webp",
    "author": "Brigitte Tohm brigittetohm",
    "source": "https://commons.wikimedia.org/wiki/File:Bowl_of_Blueberries_(Unsplash).jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "arroz": {
    "src": "/ingredientes/arroz.webp",
    "author": "VinhNguyen.1257",
    "source": "https://commons.wikimedia.org/wiki/File:Uncooked_ST25_rice_on_bamboo_surface.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bacalao": {
    "src": "/ingredientes/bacalao.webp",
    "author": "Tiia Monto",
    "source": "https://commons.wikimedia.org/wiki/File:Cod_fillet.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "banana": {
    "src": "/ingredientes/banana.webp",
    "author": "KingHill Mount Z",
    "source": "https://commons.wikimedia.org/wiki/File:HK_food_%E6%B5%B7%E5%8D%97%E6%9C%AC%E5%9C%B0%E9%A6%99%E8%95%89_Hainan_local_yellow_banana_fruit_October_2026_N13P_01.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "berenjena": {
    "src": "/ingredientes/berenjena.webp",
    "author": "Grey Geezer",
    "source": "https://commons.wikimedia.org/wiki/File:Aubergine-Varianten.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "bicarbonato-de-sodio": {
    "src": "/ingredientes/bicarbonato-de-sodio.webp",
    "author": "Thavox",
    "source": "https://commons.wikimedia.org/wiki/File:Sodium_bicarbonate.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "brevas": {
    "src": "/ingredientes/brevas.webp",
    "author": "Garitzko",
    "source": "https://commons.wikimedia.org/wiki/File:Ficus_carica_whole_fruits_and_fruit_cut_open.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "cacao-en-polvo": {
    "src": "/ingredientes/cacao-en-polvo.webp",
    "author": "blair",
    "source": "https://commons.wikimedia.org/wiki/File:Cocoa_powder.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "carne-molida": {
    "src": "/ingredientes/carne-molida.webp",
    "author": "Gajda-13 at Danish Wikipedia",
    "source": "https://commons.wikimedia.org/wiki/File:Hakket-oksekoed.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "chile-molido": {
    "src": "/ingredientes/chile-molido.webp",
    "author": "User JoeCarrasco on en.wikipedia",
    "source": "https://commons.wikimedia.org/wiki/File:BolivianChilePowder2.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "cilantro": {
    "src": "/ingredientes/cilantro.webp",
    "author": "Rupeshm364",
    "source": "https://commons.wikimedia.org/wiki/File:Coriander_Leaves.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "clavo-de-olor": {
    "src": "/ingredientes/clavo-de-olor.webp",
    "author": "Jacek Halicki",
    "source": "https://commons.wikimedia.org/wiki/File:2023_Go%C5%BAdziki.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "comino": {
    "src": "/ingredientes/comino.webp",
    "author": "Sanjay Acharya",
    "source": "https://commons.wikimedia.org/wiki/File:Seeds_of_Cumin.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "crema-agria": {
    "src": "/ingredientes/crema-agria.webp",
    "author": "jules",
    "source": "https://commons.wikimedia.org/wiki/File:Sour_Cream.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "curcuma": {
    "src": "/ingredientes/curcuma.webp",
    "author": "formulatehealth",
    "source": "https://commons.wikimedia.org/wiki/File:Turmeric_Root_and_Turmeric_Powder.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "espinacas": {
    "src": "/ingredientes/espinacas.webp",
    "author": "Andikan Efiok Eduok",
    "source": "https://commons.wikimedia.org/wiki/File:Okazi_leave_(Afang)_removed_from_it%27s_stem.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "espresso": {
    "src": "/ingredientes/espresso.webp",
    "author": "Jubair1985",
    "source": "https://commons.wikimedia.org/wiki/File:Espresso_Coffee_01.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "galletas": {
    "src": "/ingredientes/galletas.webp",
    "author": "Evan-Amos",
    "source": "https://commons.wikimedia.org/wiki/File:Choc-Chip-Cookie.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "garbanzos": {
    "src": "/ingredientes/garbanzos.webp",
    "author": "No machine-readable author provided. Yuvalif assumed (based on copyright claims).",
    "source": "https://commons.wikimedia.org/wiki/File:Dry_chickpea.JPG",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "granola": {
    "src": "/ingredientes/granola.webp",
    "author": "No machine-readable author provided. Miskatonic assumed (based on copyright claims).",
    "source": "https://commons.wikimedia.org/wiki/File:Granola03242006.JPG",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "guisantes": {
    "src": "/ingredientes/guisantes.webp",
    "author": "Ruth Hartnup from Vancouver, Canada",
    "source": "https://commons.wikimedia.org/wiki/File:Peas_(484346231).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "harina-de-trigo": {
    "src": "/ingredientes/harina-de-trigo.webp",
    "author": "Veganbaking.net from USA",
    "source": "https://commons.wikimedia.org/wiki/File:All-Purpose_Flour_(4107895947).jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "huevos-de-codorniz": {
    "src": "/ingredientes/huevos-de-codorniz.webp",
    "author": "Fumikas Sagisavas",
    "source": "https://commons.wikimedia.org/wiki/File:Shell_quail_egg.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "kiwi": {
    "src": "/ingredientes/kiwi.webp",
    "author": "Luc Viatour",
    "source": "https://commons.wikimedia.org/wiki/File:Kiwi_(Actinidia_chinensis)_1_Luc_Viatour.jpg",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "limon": {
    "src": "/ingredientes/limon.webp",
    "author": "ulleo from Pixabay",
    "source": "https://commons.wikimedia.org/wiki/File:Lemon_Grey_2252546.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "manzana": {
    "src": "/ingredientes/manzana.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Golden_Delicious_apples.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "maracuya": {
    "src": "/ingredientes/maracuya.webp",
    "author": "Nana Pearls",
    "source": "https://commons.wikimedia.org/wiki/File:Cut_and_uncut_passion_fruits.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "menta": {
    "src": "/ingredientes/menta.webp",
    "author": "Fernando Losada Rodríguez",
    "source": "https://commons.wikimedia.org/wiki/File:Mentha_sp.001_-_A_Pobra_do_Carami%C3%B1al.JPG",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "moras": {
    "src": "/ingredientes/moras.webp",
    "author": "Ivar Leidus",
    "source": "https://commons.wikimedia.org/wiki/File:Blackberries_(Rubus_fruticosus).jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "oregano-seco": {
    "src": "/ingredientes/oregano-seco.webp",
    "author": "GLheimer",
    "source": "https://commons.wikimedia.org/wiki/File:Dried_oregano.tif",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "pan-rallado": {
    "src": "/ingredientes/pan-rallado.webp",
    "author": "Yvwv",
    "source": "https://commons.wikimedia.org/wiki/File:Breadcrumb.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "papa-criolla": {
    "src": "/ingredientes/papa-criolla.webp",
    "author": "Nick29",
    "source": "https://commons.wikimedia.org/wiki/File:Papacriollacolombiana.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "papaya-verde": {
    "src": "/ingredientes/papaya-verde.webp",
    "author": "Joydeep",
    "source": "https://commons.wikimedia.org/wiki/File:Carica_papaya_14_7_2012.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "pepino": {
    "src": "/ingredientes/pepino.webp",
    "author": "Jason Zhang",
    "source": "https://commons.wikimedia.org/wiki/File:Ryerson_Market_cucumbers_on_sale.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "perejil": {
    "src": "/ingredientes/perejil.webp",
    "author": "SarKaLay စာကလေး",
    "source": "https://commons.wikimedia.org/wiki/File:Parsley_leaves_(89358).jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "pimienta-de-jamaica": {
    "src": "/ingredientes/pimienta-de-jamaica.webp",
    "author": "Jonathunder",
    "source": "https://commons.wikimedia.org/wiki/File:AllspiceBowl.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "pimienta-negra": {
    "src": "/ingredientes/pimienta-negra.webp",
    "author": "Ryan Snyder",
    "source": "https://commons.wikimedia.org/wiki/File:Black_Peppercorns_(4422070187).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "pimiento-rojo": {
    "src": "/ingredientes/pimiento-rojo.webp",
    "author": "AntanO",
    "source": "https://commons.wikimedia.org/wiki/File:Red_bell_pepper.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "platano": {
    "src": "/ingredientes/platano.webp",
    "author": "Vis M",
    "source": "https://commons.wikimedia.org/wiki/File:Ripe_plantains.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "queso-fresco": {
    "src": "/ingredientes/queso-fresco.webp",
    "author": "Geoff",
    "source": "https://commons.wikimedia.org/wiki/File:Queso_fresco.JPG",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "quinoa": {
    "src": "/ingredientes/quinoa.webp",
    "author": "Pom²",
    "source": "https://commons.wikimedia.org/wiki/File:Quinoa_closeup.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "repollo": {
    "src": "/ingredientes/repollo.webp",
    "author": "Iwai-Dialax",
    "source": "https://commons.wikimedia.org/wiki/File:Cabbage_Vegetable.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0"
  },
  "sal": {
    "src": "/ingredientes/sal.webp",
    "author": "Lexlex",
    "source": "https://commons.wikimedia.org/wiki/File:Comparison_of_Table_Salt_with_Kitchen_Salt.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "semillas-de-sesamo": {
    "src": "/ingredientes/semillas-de-sesamo.webp",
    "author": "Sanjay ach",
    "source": "https://commons.wikimedia.org/wiki/File:Sa_white_sesame_seeds.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "bondiola-de-cerdo": {
    "src": "/ingredientes/bondiola-de-cerdo.webp",
    "author": "Pannet",
    "source": "https://commons.wikimedia.org/wiki/File:Pork_neck_02.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "camarones": {
    "src": "/ingredientes/camarones.webp",
    "author": "Perplexing",
    "source": "https://commons.wikimedia.org/wiki/File:Raw_Shrimp.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "cebollino": {
    "src": "/ingredientes/cebollino.webp",
    "author": "Daderot",
    "source": "https://commons.wikimedia.org/wiki/File:Chives_-_Harbourside_Market,_Wellington,_New_Zealand_-_DSC09867.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "huevo": {
    "src": "/ingredientes/huevo.webp",
    "author": "Batholith (talk)",
    "source": "https://commons.wikimedia.org/wiki/File:Chicken_eggs_20101113.jpg",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia"
  },
  "jengibre": {
    "src": "/ingredientes/jengibre.webp",
    "author": "Mark Turnauckas",
    "source": "https://commons.wikimedia.org/wiki/File:Ginger_Root_(179871501).jpeg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "levadura-seca": {
    "src": "/ingredientes/levadura-seca.webp",
    "author": "Your Best Digs",
    "source": "https://commons.wikimedia.org/wiki/File:Spoon_with_active_dry_yeast_for_baking_bread.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "papa-blanca": {
    "src": "/ingredientes/papa-blanca.webp",
    "author": "Tomwsulcer",
    "source": "https://commons.wikimedia.org/wiki/File:Hillview_Farms_white_potatoes.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "papa-sabanera": {
    "src": "/ingredientes/papa-sabanera.webp",
    "author": "Caldobasico",
    "source": "https://commons.wikimedia.org/wiki/File:Papa_sabanera_1.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "pimiento-verde": {
    "src": "/ingredientes/pimiento-verde.webp",
    "author": "Sebastián Rojas",
    "source": "https://commons.wikimedia.org/wiki/File:Green_Pepper_(22404683).jpeg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "pina": {
    "src": "/ingredientes/pina.webp",
    "author": "Shixart1985",
    "source": "https://commons.wikimedia.org/wiki/File:Hand_slicing_a_pineapple_into_rings_on_a_cutting_board_in_a_kitchen.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "ternera": {
    "src": "/ingredientes/ternera.webp",
    "author": "Javier Lastras",
    "source": "https://commons.wikimedia.org/wiki/File:Raw_veal_liver,_2010.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "yogur-griego": {
    "src": "/ingredientes/yogur-griego.webp",
    "author": "Famartin",
    "source": "https://commons.wikimedia.org/wiki/File:2020-02-19_16_31_03_A_cup_of_Chobani_Greek_Yogurt_with_Blueberry_on_the_Bottom_before_being_mixed_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "frijoles-negros": {
    "src": "/ingredientes/frijoles-negros.webp",
    "author": "Judgefloro",
    "source": "https://commons.wikimedia.org/wiki/File:2022Preserved_black_beans_Tahure_04.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "pulpa-de-acai": {
    "src": "/ingredientes/pulpa-de-acai.webp",
    "author": "Jorge Láscar from Bogotá, Colombia",
    "source": "https://commons.wikimedia.org/wiki/File:A%C3%A7ai.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0"
  },
  "vinagre-blanco": {
    "src": "/ingredientes/vinagre-blanco.webp",
    "author": "François Nguyen",
    "source": "https://commons.wikimedia.org/wiki/File:Waste_liquid_containing_sodium_carbonate,_copper_sulfate_and_white_vinegar.webm",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  }
};

export function ingredientPhoto(slug: string): IngredientPhoto | undefined { return PHOTOS[slug]; }
export const photoCreditsLabel: Record<MdLanguage,string> = {"es": "Créditos de las fotografías", "en": "Photo credits", "de": "Bildnachweise", "fr": "Crédits photographiques", "it": "Crediti fotografici", "ja": "写真のクレジット", "pt": "Créditos das fotografias"};
