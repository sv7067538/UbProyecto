import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCsDElmrzEQhL9ixh96GtM5gzMId1-lfXw",
  authDomain: "ubiproject-9f449.firebaseapp.com",
  databaseURL: "https://ubiproject-9f449-default-rtdb.firebaseio.com",
  projectId: "ubiproject-9f449",
  storageBucket: "ubiproject-9f449.firebasestorage.app",
  messagingSenderId: "144931965439",
  appId: "1:144931965439:web:3dc773d85cfb222fbe7fca"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ubicacionRef = ref(db, 'ubicaciones');

// Configuración de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic3Y3MDY3NTM4IiwiYSI6ImNtOG03NGU0YTA1anIyaW85cWw0eGR1dnYifQ.DrXnjKpB3yXawHKS6_1uKA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0], // Coordenadas iniciales (0,0)
  zoom: 14
});

// Crear el marcador en el mapa
const marker = new mapboxgl.Marker()
  .setLngLat([0, 0]) // Coordenadas iniciales
  .addTo(map);

// Leer datos de Firebase en tiempo real
onValue(ubicacionRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const lat = data.lat;
    const lon = data.lon;
    const hora = new Date(data.hora).toLocaleString();

    // Actualizar el marcador con las nuevas coordenadas
    marker.setLngLat([lon, lat]);

    // Mover el mapa a la nueva ubicación
    map.flyTo({
      center: [lon, lat],
      essential: true, // Esto asegura que el movimiento del mapa sea inmediato y no suave
      zoom: 14
    });

    // Mostrar información en el panel
    document.getElementById('latitud').textContent = lat.toFixed(6);
    document.getElementById('longitud').textContent = lon.toFixed(6);
    document.getElementById('hora').textContent = hora;

    // Hacer visible el panel de información
    document.getElementById('locationPanel').style.display = 'block';
  }
});

// Función para obtener la ubicación del celular
function obtenerUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const horaActual = new Date().toLocaleString();
      actualizarUbicacion(lat, lon, horaActual);
    }, function(error) {
      console.error("Error al obtener la ubicación:", error);
    });
  } else {
    alert("La geolocalización no es compatible con este navegador.");
  }
}

// Función para actualizar la ubicación en Firebase
function actualizarUbicacion(lat, lon, horaActual) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    console.error('Coordenadas inválidas:', lat, lon);
    return;
  }

  // Actualizamos los datos de la ubicación en Firebase
  set(ubicacionRef, {
    lat: lat,
    lon: lon,
    hora: horaActual
  })
  .then(() => {
    console.log('Ubicación actualizada correctamente');
  })
  .catch((error) => {
    console.error('Error al actualizar la ubicación:', error);
  });
}

// Llamar a la función para obtener la ubicación cuando cargue el documento
document.addEventListener('DOMContentLoaded', function() {
  obtenerUbicacion(); // Llama a esta función si deseas obtener la ubicación automáticamente al cargar la página.
});
