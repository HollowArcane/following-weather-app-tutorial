async function getData(link)
{ return await (await fetch(link)).json(); }

const map = L.map('map').setView([51.505, -0.09], 1);

const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const options = {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}

L.tileLayer(tileURL, options).addTo(map);

getData("/api").then(data => {
    for(item of data)
    {
        const marker = L.marker([item.latitude, item.longitude]).addTo(map);
        
        const text = `The weather here at ${item.name} (${item.latitude}, ${item.longitude}) is ${item.weather} 
        
        The concentration of particulata mater (CO) is ${item.air_quality} μg/m3`;
        
        marker.bindPopup(text).openPopup();
    }
});