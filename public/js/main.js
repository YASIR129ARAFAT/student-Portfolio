const submitbtn = document.getElementById("submitbtn");
const cityname = document.getElementById("cityname");
const city_name = document.getElementById("city_name");
const temp = document.getElementById("temp");
const temp_status = document.getElementById("temp_status");
const min_temp = document.getElementById("min_temp");
const pressure = document.getElementById("pressure");
const humidity = document.getElementById("humidity");
const max_temp = document.getElementById("max_temp");
const middlelayer=document.getElementById("middlelayer");
 const sunrise=document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
console.log("parwez");
const getinfo = async (event) => {
  event.preventDefault();
  let cityval = cityname.value;
  console.log("cityval");
  if (cityval === "") {
    city_name.innerText = `plz write the city name before you search`;
  } else {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityval}&appid=589630b36dd939167844e0b8eb0f7848`;
      const response = await fetch(url);
      const obj = await response.json();
      console.log(obj);
      const arrdata = [obj];

      city_name.innerText =
        `${arrdata[0].name} ,` + `${arrdata[0].sys.country}`;
      temp.innerText = arrdata[0].main.temp;
      min_temp.innerText = arrdata[0].main.temp_min;
      max_temp.innerText = arrdata[0].main.temp_max;
      pressure.innerText = arrdata[0].main.pressure;
      humidity.innerText = arrdata[0].main.humidity;
      const status_weather = arrdata[0].weather[0].main;
       console.log(new Date(arrdata[0].sys.sunrise));
      sunrise.innerText=new Date(arrdata[0].sys.sunrise);
      sunset.innerText = new Date(arrdata[0].sys.sunset);
      if (status_weather == "Clouds") {
        temp_status.innerHTML = `<i class="fa-solid fa-cloud" style="color: blue; margin: auto; font-size:40px">`;
      } else if (status_weather == "Clear") {
        temp_status.innerHTML = `<i class="fa-solid fa-sun" style="color: yellow; margin: auto; font-size:40px">`;
      } else if (status_weather == "Rain") {
        temp_status.innerHTML = `<i class="fa-solid fa-cloud-rain" style="color: blue; margin: auto; font-size:40px">`;
      } else {
        temp_status.innerHTML = `<i class="fa-solid fa-cloud" style="color: blue; margin: auto; font-size:40px">`;
      }
      console.log(status_weather);
      // console.log(arrdata[0].main.temp);
    } catch {
      city_name.innerText = `city name doesnt exist`;
    }
  }
};

submitbtn.addEventListener("click", getinfo);
// submitbtn.addEventListener("click", getinfo);
