async function getData(link)
{ return await (await fetch(link)).json(); }

async function postData(data, link)
{
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }
    
    console.log(options);
    return await (await fetch(link, options)).json();
}

async function getPosition(position)
{
    const data =  await getData(`/api/${position.coords.latitude}/${position.coords.longitude}`);
    
    return data;
}

async function saveData(data)
{
    return await postData({
        name: data.weather.name,
        latitude: data.weather.coord.lat,
        longitude: data.weather.coord.lon,
        weather: data.weather.weather[0].description,
        air_quality: data.air_quality.list[0].components.co
    }, "/api");
}

function updateParagraph(data)
{
    const citySpan = document.getElementById("city");
    const latSpan = document.getElementById("lat");
    const lonSpan = document.getElementById("lon");
    const weatherSpan = document.getElementById("weather");
    const temperatureSpan = document.getElementById("temperature");
    const coQuantitySpan = document.getElementById("co-quantity");
    
    citySpan.textContent = data.weather.name;
    latSpan.textContent = data.weather.coord.lat;
    lonSpan.textContent = data.weather.coord.lon;
    weatherSpan.textContent = data.weather.weather[0].description;
    temperatureSpan.textContent = data.weather.main.temp;
    coQuantitySpan.textContent = data.air_quality.list[0].components.co;
}

if("geolocation" in navigator)
{
    console.log("Geolocation is available!! Yay ｀(^ ▼^)´");
    
    navigator.geolocation.getCurrentPosition(async position => {
        let data = await getPosition(position);
        updateParagraph(data);
        console.log(await saveData(data));
    });
    
}
else
{ console.log("Geolocation is not available... (˃̣̣̥⌓˂̣̣̥ )"); }

