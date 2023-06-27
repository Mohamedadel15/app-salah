// get time now
function getTimeNow() {
  const now = new Date();
  const month = now.toLocaleString("en-US", { month: "long" });
  document.querySelector(".header .container .time .hours").textContent =
    new Date().getHours();
  document.querySelector(".header .container .time .minutes").textContent =
    new Date().getMinutes();
  document.querySelector(".header .container .year .day").textContent =
    new Date().getDate();
  document.getElementById("month").textContent = month;
}

setInterval(getTimeNow, 1000);

//   change for input form

const selectList = document.getElementById("inputState");
const inputSearch = document.querySelector(
  ".search .container .row .input-group .form-control"
);
const btnSearch = document.getElementById("basic-addon1");

function changePlaceholder() {
  inputSearch.value = selectList.value;
  localStorage.setItem("select", selectList.value);
}

selectList.addEventListener("change", changePlaceholder);

// to make the result for all search and select store in the localStorage
inputSearch.value = localStorage.getItem("search");
selectList.value = localStorage.getItem("select");
//  ----------------------------------------------------------------
btnSearch.addEventListener("click", () => {
  let searchValue = inputSearch.value.toLowerCase().trim();
  localStorage.setItem("search", searchValue);
  getApiData(localStorage.getItem("search"));
  addPreloaderEvents()
});

//  to make localStorage work with directly
window.addEventListener("load", () => {
  getApiData(localStorage.getItem("search"));
});

// ---------------  ----------------    ------------
async function getApiData(cityName) {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByAddress/09-03-2015?address=${cityName}`
    );
    const data = await response.json();
    setNewTimeForCity(data.data);
    changeCityName(data.data);
    changeRegionName(data.data);
  } catch (error) {
    console.error(error);
  }
}

const setNewTimeForCity = function ({
  timings: { Fajr, Dhuhr, Asr, Maghrib, Isha },
}) {
  let arrObjectTime = [
    {
      0: Fajr,
      1: Dhuhr,
      2: Asr,
      3: Maghrib,
      4: Isha,
    },
  ];
  const timeOfSalh = document.querySelectorAll(".salah");
  for (let i = 0; i < 5; i++) {
    timeOfSalh[i].innerHTML = arrObjectTime[0][i];
  }
  getActive(timeOfSalh);
};

function changeCityName({ meta: { timezone } }) {
  document.getElementById("city").innerHTML = "";
  document.getElementById("city").textContent = `${timezone}`;
}

function changeRegionName({
  meta: {
    method: { name },
  },
}) {
  document.getElementById("regionName").textContent = "";
  document.getElementById("regionName").textContent = `${name}`;
}

//   ----------------------------------------------------------------

function getActive(timeOfSalh) {
  removeClass();
  formatTime();
  deleteClassHidden();
  let arr = [];
  for (let i = 0; i < 5; i++) {
    if (formatTime() > timeOfSalh[i].innerHTML) {
        if(formatTime() >= timeOfSalh[4].innerHTML){
            addClassHiddenAndClassActive(timeOfSalh[4].parentNode)
            return;
        }
      arr.push(timeOfSalh[i + 1]);
    }if (formatTime() < timeOfSalh[0].innerHTML) {
      addClassHiddenAndClassActive(timeOfSalh[0].parentNode);
      return;
    }
  }
  addClassHiddenAndClassActive(arr[arr.length - 1].parentNode);
}

function removeClass() {
  document.querySelectorAll(".Info .col-6").forEach((ele) => {
    ele.classList.remove("active");
  });
}

function formatTime() {
  const currentTime = new Date();
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function deleteClassHidden() {
  document.querySelectorAll(".coming").forEach((ele) => {
    ele.classList.add("hidden");
  });
}

function addClassHiddenAndClassActive(parent) {
  parent.classList.add("active");
  parent.children[0].classList.remove("hidden");
  checkClass(parent);
  
}

function checkClass(parent){
        const getYear = new Date().getFullYear();
        const getMonth = new Date().getMonth() +1;
        const getDay = new Date().getDate();
        function updateTimer() {
            const targetDate = new Date(`${getYear}-${getMonth}-${getDay} ${parent.children[2].innerHTML}`);
            console.log(targetDate);
            // Get the current date and time
            const currentDate = new Date();
          
            // Calculate the remaining time in milliseconds
            const remainingTime = targetDate - currentDate;
            // Calculate the remaining hours, minutes, and seconds
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
          
            // Display the remaining time in the timer element
            document.querySelector(".active #timer").innerHTML=`${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
        
        }
        setInterval(updateTimer, 1000)
}


//  add preloader events before the response complete 
 
function addPreloaderEvents(){
      setTimeout(()=>{
        document.querySelector(".spiners").classList.add("hidden")
    },1500 )

    document.querySelector(".spiners").classList.remove("hidden")
}


