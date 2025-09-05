const URL = "https://api.unsplash.com";
const image = document.getElementById("imagesdiv");
const load_more = document.getElementById("load");
const msg = document.getElementById("msg");
const search = document.getElementById("Search");
const mode_switch = document.getElementById("switch");
const collection = image.getElementsByClassName("IMG_container");
const wait = 700;
let timer;
let query = "";
let darkmode = localStorage.getItem("darkmode");

let page_set = 1;
const shown_ids = new Set();

// -------------------------------------------------------------------- DARK MODE SWITCH ------------------------------------------------- //

const EnableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};

const DisableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
};

if (darkmode === "active") {
  EnableDarkMode();
}

mode_switch.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");
  darkmode != "active" ? EnableDarkMode() : DisableDarkMode();
  mode_switch.classList.toggle("switched");
});

// --------------------------------------------------------------------------------------------------------------------------------------- //

function Redirect(url) {
  window.location.replace(url);
}

async function FetchAll(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "",
      },
    });
    const data = await response.json();

    if (data.errors) {
      console.log(data.errors[0]);
      msg.textContent = "Error Loading images! Refresh";
      load_more.style = "display:none";
    }

    // console.log(data);
    return data;
  } catch (er) {
    console.log(er);
  }
}

function DataFilter(Data) {
  const uniqe = Data.filter((item) => {
    if (shown_ids.has(item.id)) {
      return false;
    }
    shown_ids.add(item.id);
    return true;
  });

  return uniqe;
}

function DisplayPhotosHomePage(data) {
  const uniqueData = DataFilter(data);
  // console.log(uniqueData);
  try {
    uniqueData.map((dat) => {
      const image = dat.urls.small;
      const link = dat.urls.full;
      const usrimgurl = dat.user.profile_image.large;
      const usrnme = dat.user.username;
      const hire = dat.user.for_hire;
      const insta = dat.user.instagram_username;
      const place = dat.user.location;
      // show_IMG(image);
      show_IMG(image, link, usrimgurl, usrnme, hire, insta, place);
    });
  } catch (e) {
    console.log(e);
    show_IMG(data.urls.small);
  }
}

function show_IMG(src, link, usrIMGurl, usrnme, hire, insta, place) {
  figurediv = document.createElement("figure");
  figurediv.className = "FIG_container";

  usr = document.createElement("p");
  usr.innerHTML = usrnme;
  usr.className = "usrnme";

  hirediv = document.createElement("p");
  hirediv.className = "hire";

  figcaption = document.createElement("figcaption");
  figcaption.appendChild(usr);

  placediv = document.createElement("p");
  placediv.className = "place";
  if (place) {
    placediv.innerHTML = place;
  } else {
    placediv.innerHTML = "Unknown";
  }

  figurediv.appendChild(placediv);

  if (hire === true) {
    hirediv.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z"/></svg>Avilable for hire';
    figcaption.appendChild(hirediv);
  } else if (hire === false) {
    hirediv.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m586-486 78-78-56-58-79 79 57 57Zm248 248-88-88-6-70 74-84-74-86 10-112-110-24-58-96-102 44-104-44-37 64-59-59 64-107 136 58 136-58 76 128 144 32-14 148 98 112-98 112 12 130Zm-456 76 102-44 104 44 38-64-148-148-36 36-142-142 56-56 86 84-21 21-203-203 6 68-74 86 74 84-10 114 110 24 58 96ZM344-60l-76-128-144-32 14-148-98-112 98-112-12-130-70-70 56-56 736 736-56 56-112-112-64 108-136-58-136 58Zm185-483Zm-145 79Z"/></svg>';
    figcaption.appendChild(hirediv);
  }
  // figcaption.style.color = color;

  a = document.createElement("a");
  a.target = "_blank";
  a.className = "download";
  a.href = link;
  a.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>';
  // console.log(a);

  usrimg = document.createElement("img");
  usrimg.src = usrIMGurl;
  usrimg.className = "profile_pic";

  profile = document.createElement("a");
  profile.target = "_blank";
  profile.href = `https://www.instagram.com/${insta}`;
  profile.appendChild(usrimg);

  let img = document.createElement("img");
  img.src = src;
  img.className = "MAINIMAGE";

  figurediv.appendChild(a);
  figurediv.appendChild(profile);
  figurediv.appendChild(img);
  figurediv.appendChild(figcaption);
  image.appendChild(figurediv);
}

load_more.addEventListener("click", () => {
  page_set += 1;
  if (query) {
    FetchAll(
      `${URL}/search/collections?page=${page_set}&query=${encodeURIComponent(
        query
      )}&per_page=15`
    ).then((res) => getSearchIMG(res));
  } else {
    FetchAll(URL + `/photos?page=${page_set}`).then((res) =>
      DisplayPhotosHomePage(res)
    );
  }
});

search.addEventListener("keyup", (event) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    image.innerHTML = "";
    Search(event.target.value);
  }, wait);
});

function Search(qu) {
  page_set = 1;
  query += qu;
  // console.log(qu);
  if (query) {
    shown_ids.clear();
    FetchAll(
      `${URL}/search/collections?page=${page_set}&query=${encodeURIComponent(
        qu
      )}&per_page=15`
    ).then((res) => getSearchIMG(res));
  }
  if (qu === "") {
    query = "";
    shown_ids.clear();
    FetchAll(URL + `/photos?page=${page_set}`).then((result) => {
      DisplayPhotosHomePage(result);
    });
  }
}

function getSearchIMG(obj) {
  uniqueobj = DataFilter(obj.results);
  arlen = uniqueobj.length;
  console.log(uniqueobj);
  uniqueobj.map((data) => {
    const imglnk = data.cover_photo.urls.small;
    const dllink = data.cover_photo.urls.full;
    const usrimg = data.cover_photo.user.profile_image.large;
    const usrnme = data.cover_photo.user.username;
    const hire = data.cover_photo.user.for_hire;
    const insta = data.cover_photo.user.instagram_username;
    const location = data.cover_photo.user.location;

    show_IMG(imglnk, dllink, usrimg, usrnme, hire, insta, location);
  });
}

window.onload = FetchAll(URL + `/photos?page=${page_set}`).then((result) => {
  // console.log(result);
  DisplayPhotosHomePage(result);
});

// console.log(query);
