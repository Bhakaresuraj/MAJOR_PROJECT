async function loadMap() {

  // Get location from EJS
  const place =
    document.getElementById("location").innerText;

  // Call geocoding function
  const coordinates =
    await getCoordinates(place);

  console.log(coordinates);

  // Create map
  const map = new maplibregl.Map({

    container: 'map',
    style: {
      version: 8,

      sources: {

        satellite: {

          type: "raster",

          tiles: [

            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

          ],

          tileSize: 256,

          attribution:
            "Esri"

        }

      },

      layers: [

        {

          id: "satellite",

          type: "raster",

          source: "satellite"

        }

      ]

    },
    center: [
      coordinates.lon,
      coordinates.lat
    ],

    zoom: 0

  });

  const el = document.createElement("div");

  el.className = "custom-marker";

  el.innerHTML = `<i class="fa-solid fa-location-dot"></i>`;

  // Create marker
  new maplibregl.Marker({
    element: el
  })

    .setLngLat([
      coordinates.lon,
      coordinates.lat
    ])

    .setPopup(
      new maplibregl.Popup({
        offset: 25
      })

        .setHTML(`
    <div class="custom-popup">
        <h4><b>${place}</b></h4>
         <p>Exact location will be provided after booking</p>
    </div>
`)
    )

    .addTo(map);

}


loadMap();
async function getCoordinates(place) {

  const response = await fetch(

    `https://nominatim.openstreetmap.org/search?q=${place}&format=json`

  );
  const data = await response.json();

  return {

    lat: data[0].lat,
    lon: data[0].lon

  };

}