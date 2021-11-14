/* Global variables */
const url = `/public/img/portrait/mini/`;
const urlGithub = `https://youlijie.github.io/ThibaultWerle_6_20082021`;
const urlGithubPath = `/ThibaultWerle_6_20082021`;
//const urlGithub = ``;
//const urlGithubPath = ``;

let activeTags = [];
let originalLikesFromJson = [];
let dataBase = undefined;
let dataCreatorGallery;

/**********************************************************
 *
 *          Functions for Index.html
 *
 **********************************************************/
/* Use data from dataBase to create all photographers Card on HomePage  */
function displayAllCreatorItems() {
  //delete all photographers Cards to avoid duplicate photographer card
  document.querySelector(".creators").innerHTML = "";
  dataBase.photographers
    .filter((photographer) => (activeTags.length > 0 ? photographer.tags.some((tag) => activeTags.includes(tag)) : true))
    .map((photographer) => {
      document.querySelector(".creators").innerHTML += `<div class="card">
    <a href="photographer-page.html?id=${photographer.id}" class="card-img">
      <img src="${urlGithub}${url}${photographer.portrait}" alt="">
            <h2 class="card-img-title">${photographer.name}</h2>
        </a>
        <div class="card-body">
            <p class="card-body-city">${photographer.city}, ${photographer.country}</p>
            <p class="card-body-tagline">${photographer.tagline}</p>
            <p class="card-body-price">${photographer.price}€/jour</p>
        </div>
        <ul class="card-tags">${photographer.tags
          .map(
            (tag) => `<li class="tag"><button onclick="toggleButtonFilterByTag(event)"class="${activeTags.includes(tag) ? "selected" : ""}"
              >${tag}</button
            ></li>`
          )
          .join("")}
          </ul>
      </div>`;
    });
}

/* onclick function to display Photographer by tag  */
function toggleButtonFilterByTag(e) {
  const tag = e.target.innerText.toLowerCase();
  const buttonHeaderToSelect = document.querySelectorAll("header button");

  if (e.target.classList.contains("selected") === false) {
    activeTags = [...activeTags, tag];
    e.target.classList.add("selected");

    //adding class selected to header tag button if tag selected on photographer Card tags
    for (let i = 0; i < buttonHeaderToSelect.length; i++) {
      if (buttonHeaderToSelect[i].innerText.toLowerCase() === tag) {
        buttonHeaderToSelect[i].classList.add("selected");
      }
    }
  } else {
    e.target.classList.remove("selected");
    e.target.parentElement.classList.remove("selected");
    const buttonHeaderSelected = document.querySelectorAll("header button.selected");

    //remove class selected to header tag button if tag deselected on photographer Card tags
    for (let i = 0; i < buttonHeaderSelected.length; i++) {
      if (buttonHeaderSelected[i].innerText.toLowerCase() === tag) {
        buttonHeaderSelected[i].classList.remove("selected");
      }
    }
    activeTags = [...activeTags].filter((elt) => elt !== tag);
  }
  displayAllCreatorItems();
}

/* Scroll on HomePage(index.html) to display a link to main tag */
function displayLinkNav() {
  //DOM Element
  const linkNavElt = document.getElementById("link-nav");
  const headerElt = document.querySelector(".header");

  if (window.scrollY >= headerElt.offsetHeight - 20) {
    linkNavElt.style.top = "6px";
  }
  if (window.scrollY < headerElt.offsetHeight - 20) {
    linkNavElt.style.top = "-200px";
  }
}

function renderHomePage() {
  if (window.location.pathname === `${urlGithubPath}/index.html` || window.location.pathname === `${urlGithubPath}/`) {
    displayAllCreatorItems();
    document.addEventListener("scroll", displayLinkNav);
  }
}

/**********************************************************
 *
 *          Functions for photographer-page.html
 *
 **********************************************************/

/***   create creator(=photographer) Header Card   ***/
function displayCreatorCard(data) {
  document.querySelector(".photographer-page").innerHTML += `<header class="ph-header" aria-label="photographer information">
        <div class="ph-infos">
          <h1 class="ph-name" id="ph-title">${data.name}</h1>
          <span class="ph-city" id="ph-city">${data.city}, ${data.country}</span>
          <span class="ph-tagline" id="ph-tagline">${data.tagline}</span>
          <ul class="card-tags">${data.tags.map((tag) => `<li class="tag"><button>${tag}</button></li>`).join("")}
          </ul>
        </div>
        <button type="button" class="ph-contact" id="ph-contact" title="Contact Me">Contactez-moi</button>
        <img src="${urlGithub}${url}${data.portrait}" alt="" id="ph-portrait" />
      </header>
      <section class="ph-works" aria-label="photographer works">
        <div class="works-sort">
          <span id="sort-label" class="sort-label">Trier par</span>
          <div class="sort-wrapper">
            <button aria-haspopup="listbox" aria-expanded="false" aria-labelledby="sort-label sort-btn" id="sort-btn" class="sort-btn">
              Popularité
              <span class="fas fa-chevron-down sort-arrow"></span>
            </button>
            <ul id="sort-list" tabindex="0" role="listbox" aria-labelledby="sort-label" class="sort-list hidden">
              <li id="sort-1" role="option" tabindex="0">Popularité<span class="fas fa-chevron-up sort-arrow"></span></li>
              <li id="sort-2" role="option" tabindex="0">Date</li>
              <li id="sort-3" role="option" tabindex="0">Titre</li>
            </ul>
          </div>
        </div>
        <div class="works-elts" id="works-elts"></div>
      </section>
      <aside class="ph-data">
        <span id="total-likes"></span>
        <span>${data.price}€ / jour</span>
      </aside>`;

  /******   insert photographer Name into Contact Form ********/
  const photographerFormName = document.getElementById("ph-form-name");
  photographerFormName.innerText = `${data.name}`;
}

/******************************************************************
 *  Class and Factory Pattern to display Element
 *****************************************************************/

/****************************************************************************************
 * Class ImageMedia and VideoMedia
 * @param {object} data from dataCreatorGallery filter by photographer id
 *
 * display method @return {HTMLElement} for photographer page into works-elts section
 * displayLightbox method @return {HTMLElement} into Lightbox
 *
 *******************************************************************************************/

class ImageMedia {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
    this.src = data.image;
    this.likes = data.likes;
    this.price = data.price;
    this.title = data.title;
  }

  display() {
    const originalWorkEltLikes = originalLikesFromJson.filter((workElt) => workElt.id === this.id);
    return `<div class="work-elt">
    <a href="#" title="${this.title}, closeup view" onclick="toggleLightbox(event)">
      <img src="${urlGithub}/public/data/image/mini/${this.src}" alt="${this.title}, closeup view" role="button" data-id="${this.id}">
    </a>
    <div class="work-elt-infos">
      <h2 class="work-title">${this.title}</h2>
      <span class="work-price">${this.price} €</span>
      <span class="work-like" id="${this.id}">${this.likes}<span class="${
      this.likes > originalWorkEltLikes[0].likes ? "fas fa-heart" : "far fa-heart"
    }" aria-label="likes" role="button" tabindex="0"></span></span>
    </div>`;
  }
  displayLightbox() {
    return `<img src="${urlGithub}/public/data/image/${this.src}" alt="${this.title}">
    <h3>${this.title}</h3>`;
  }
}

class VideoMedia {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
    this.likes = data.likes;
    this.price = data.price;
    this.title = data.title;
    this.src = data.video;
  }

  display() {
    const originalWorkEltLikes = originalLikesFromJson.filter((workElt) => workElt.id === this.id);
    return `<div class="work-elt">
    <a href="#" title="${this.title}, closeup view" onclick="toggleLightbox(event)">
      <video class="video-elt" role="button" data-id="${this.id}">${this.title}, closeup view
        <source src="${urlGithub}/public/data/video/${this.src}"></video>
    </a>
    <div class="work-elt-infos">
      <h2 class="work-title">${this.title}</h2>
      <span class="work-price">${this.price} €</span>
      <span class="work-like" id="${this.id}">${this.likes}<span class="${
      this.likes > originalWorkEltLikes[0].likes ? "fas fa-heart" : "far fa-heart"
    }" aria-label="likes" role="button" tabindex="0"></span></span>
    </div>
    </div>`;
  }
  displayLightbox() {
    return `<video class="video-elt" title="${this.title}" controls="true">
        <source src="${urlGithub}/public/data/video/${this.src}"></video>
        <h3>${this.title}</h3>`;
  }
}

/****************************************************************************************
 * @param {string} type  and {object} data from dataCreatorGallery
 *
 *****************************************************************************************/

function factoryForMedia(type, data) {
  switch (type) {
    case "image":
      return new ImageMedia(data);
    case "video":
      return new VideoMedia(data);
  }
}

/******************************************************************************
 * create creator(=photographer) Gallery
 * @param {object} data from dataCreatorGallery filter by photographer id
 *
 * @return {HTMLElement}
 *******************************************************************************/

function displayCreatorGallery(data) {
  data.map((elt) => {
    const type = elt.video ? "video" : "image";
    const media = factoryForMedia(type, elt);
    document.querySelector(".works-elts").innerHTML += media.display();
  });
}

/**********************************************************
 *          Function for Contact Form
 **********************************************************/

function openFormModal(formBody, overlay, keyboardAccessToForm) {
  formBody.style.display = "block";
  formBody.setAttribute("aria-hidden", "false");
  overlay.style.display = "flex";
  overlay.setAttribute("aria-hidden", "false");
  keyboardAccessToForm();
}

function closeFormModal(formBody, overlay, contactBtn) {
  formBody.style.display = "none";
  formBody.setAttribute("aria-hidden", "true");
  overlay.style.display = "none";
  overlay.setAttribute("aria-hidden", "true");
  contactBtn.focus();
}

//close Form Modal by pressing Escape Key
const keyboardFormModal = (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    closeFormModal($formBody, $overlay, $contactBtn);
  }
};

function keyboardAccessToForm() {
  $firstnameInput.focus();
  $formBody.addEventListener("keydown", keyboardFormModal);
}

/**********************************************************
 *   Function trigger by onSubmit button in Contact Form
 *   Display inputs on console log and close form
 **********************************************************/
function validate(e) {
  e.preventDefault();
  //DOM element
  //create data Object to receive all entries from form and permit to send data with easy way to back end
  const form = document.getElementById("contact-form");
  const formData = new FormData(form);
  const entries = formData.entries();
  const data = Object.fromEntries(entries);
  //display inputs from Form into console to check values
  console.log(data);

  //reset Contact Form before closing it
  form.reset();
  closeFormModal($formBody, $overlay, $contactBtn);
}

/**********************************************************
 *    Functions for sorting photographer work element
 **********************************************************/
function deleteGallery() {
  document.querySelector(".works-elts").innerHTML = "";
}

function hideSortList() {
  $dropdownMenu.style.display = "none";
  $dropdownLink.style.display = "flex";
  $dropdownLink.setAttribute("aria-expanded", "false");
}

function sortByLikes() {
  dataCreatorGallery.sort((a, b) => b.likes - a.likes);
  displayCreatorGallery(dataCreatorGallery);
}

function sortByDate() {
  dataCreatorGallery.sort((a, b) => new Date(b.date) - new Date(a.date));
  displayCreatorGallery(dataCreatorGallery);
}

function sortByTitle() {
  dataCreatorGallery.sort((a, b) => a.title.localeCompare(b.title));
  displayCreatorGallery(dataCreatorGallery);
}

function modifyDropdownBtnTitle(title) {
  $dropdownLink.innerHTML = `${title}<span class="fas fa-chevron-down sort-arrow"></span>`;
}

function toggleSortingMenu() {
  if (!$dropdownMenu.getAttribute("style") || $dropdownMenu.getAttribute("style") === "display: none;") {
    $dropdownMenu.style.display = "block";
    $dropdownLink.setAttribute("aria-expanded", "true");
    $popularitySortLi.focus();
    //use keyboard to move into Menu
    $dropdownMenu.addEventListener("keydown", keyboardNav);
    $dropdownLink.style.display = "none";
  } else {
    $dropdownMenu.style.display = "none";
    $dropdownLink.setAttribute("aria-expanded", "false");
  }
}

/**********************************************************
 *          Keyboard navigation on Sort Menu
 **********************************************************/

const keyboardNav = (e) => {
  const activeElt = document.activeElement;
  const totalLikes = document.getElementById("total-likes");

  if (e.key === "ArrowDown" || e.key === "Down") {
    e.preventDefault();
    if (activeElt === $popularitySortLi) $dateSortLi.focus();
    if (activeElt === $dateSortLi) $titleSortLI.focus();
    if (activeElt === $titleSortLI) $popularitySortLi.focus();
  }
  if (e.key === "ArrowUp" || e.key === "Up") {
    e.preventDefault();
    if (activeElt === $popularitySortLi) $titleSortLI.focus();
    if (activeElt === $dateSortLi) $popularitySortLi.focus();
    if (activeElt === $titleSortLI) $dateSortLi.focus();
  }
  if (e.key === "Enter") {
    e.preventDefault();
    hideSortList();
    deleteGallery();
    if (activeElt === $popularitySortLi) {
      sortByLikes();
      //modify title into dropdownBtn
      modifyDropdownBtnTitle("Popularité");
      //modify likes after sorting
      updateTotalLikes(totalLikes);
      listeningHeartPress(totalLikes);
    }
    if (activeElt === $dateSortLi) {
      sortByDate();
      //modify title into dropdownBtn
      modifyDropdownBtnTitle("Date");
      //modify likes after sorting
      updateTotalLikes(totalLikes);
      listeningHeartPress(totalLikes);
    }
    if (activeElt === $titleSortLI) {
      sortByTitle();
      //modify title into dropdownBtn
      modifyDropdownBtnTitle("Titre");
      //modify likes after sorting
      updateTotalLikes(totalLikes);
      listeningHeartPress(totalLikes);
    }
    $dropdownLink.focus();
  }

  if (e.key === "Escape" || e.key === "Esc" || (e.key === "Shift" && e.key === "Tab")) {
    e.preventDefault();
    hideSortList();
    $dropdownLink.focus();
  }
};

/**********************************************************
 *          Keyboard navigation on Work Elements Section
 **********************************************************/
const keyboardWorkNav = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (e.target.hasAttribute("onclick")) {
      toggleLightbox(e);
    }
  }
};

/**********************************************************
 *          Function for LightBox
 **********************************************************/

function openLightbox() {
  //display lightbox and modify aria attribute
  $lightbox.style.display = "block";
  $lightbox.setAttribute("aria-hidden", "false");
  $lightboxOverlay.style.display = "block";
  $lightboxOverlay.setAttribute("aria-hidden", "false");
  //aria attibute for lightbox button
  $lightboxCloseBtn.setAttribute("aria-hidden", "false");
  $lightboxNextBtn.setAttribute("aria-hidden", "false");
  $lightboxPrevBtn.setAttribute("aria-hidden", "false");
  $body.style.overflow = "hidden";
}

function closeLightbox() {
  // none display for lightbox and modify aria attribute
  $lightbox.style.display = "none";
  $lightbox.setAttribute("aria-hidden", "true");
  $lightboxOverlay.style.display = "none";
  $lightboxOverlay.setAttribute("aria-hidden", "true");
  //aria attribute for lightbox button
  $lightboxCloseBtn.setAttribute("aria-hidden", "true");
  $lightboxNextBtn.setAttribute("aria-hidden", "true");
  $lightboxPrevBtn.setAttribute("aria-hidden", "true");
  $body.style.overflow = "auto";
}

function displayLightboxMedia(data) {
  const type = data.video ? "video" : "image";
  const media = factoryForMedia(type, data);
  document.getElementById("lightbox-content").innerHTML = media.displayLightbox();
}

function toggleLightbox(e) {
  //DOM Element
  $lightbox = document.getElementById("lightbox");
  $lightboxOverlay = document.getElementById("lightbox-cover");
  $lightboxContent = document.getElementById("lightbox-content");
  $lightboxCloseBtn = document.querySelector(".lightbox-close");
  $lightboxNextBtn = document.getElementById("lightbox-next");
  $lightboxPrevBtn = document.getElementById("lightbox-prev");
  $body = document.getElementsByTagName("body")[0];

  openLightbox();
  //variable use to stock the index number of work element into dataCreatorGallery
  let indexNumber = "";

  //console.log(dataCreatorGallery, e.target);
  dataCreatorGallery.map((elt, index) => {
    //data from keyboard press
    if (e.target.hasAttribute("onclick")) {
      if (elt.id === parseInt(e.target.children[0].dataset.id)) {
        displayLightboxMedia(dataCreatorGallery[index]);
        indexNumber = index;
        return indexNumber;
      }
    } else if (elt.id === parseInt(e.target.dataset.id)) {
      displayLightboxMedia(dataCreatorGallery[index]);
      indexNumber = index;
      return indexNumber;
    }
  });

  /******   function to display Next Image       ****/
  function next() {
    if (indexNumber === dataCreatorGallery.length - 1) {
      indexNumber = 0;
      displayLightboxMedia(dataCreatorGallery[indexNumber]);
    } else {
      indexNumber = indexNumber + 1;
      displayLightboxMedia(dataCreatorGallery[indexNumber]);
    }
  }

  /******   function to display Previous Image       ****/
  function prev() {
    if (indexNumber === 0) {
      indexNumber = dataCreatorGallery.length - 1;
      displayLightboxMedia(dataCreatorGallery[indexNumber]);
    } else {
      indexNumber = indexNumber - 1;
      displayLightboxMedia(dataCreatorGallery[indexNumber]);
    }
  }

  /******   Navigation by keyboard press on Lightbox       ****/
  const keyboardLightboxNav = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    }
    if (e.key === "ArrowLeft" || e.key === "Left") {
      e.preventDefault();
      prev();
    }
    if (e.key === "ArrowRight" || e.key === "Right") {
      e.preventDefault();
      next();
    }
  };

  /******   EventListener on Lightbox       ****/
  $lightboxCloseBtn.addEventListener("click", closeLightbox);
  $lightboxNextBtn.addEventListener("click", next);
  $lightboxPrevBtn.addEventListener("click", prev);
  document.addEventListener("keyup", keyboardLightboxNav);
}

/**********************************************************
 *    Function to display Total Likes and Update it
 **********************************************************/

/******************************************************
 * @param {object} data and {DOM element}
 * from dataCreatorGallery filter by photographer id
 * @return {HTMLElement}
 *****************************************************/

function displayTotalLikes(data, totalLikes) {
  let numberOfTotalLikes = 0;
  data.forEach((elt) => {
    numberOfTotalLikes += elt.likes;
  });
  totalLikes.innerHTML = numberOfTotalLikes + '<i class="fas fa-heart" aria-label="likes"></i>';
}

/****************************
 * @param {DOM element}
 * @return {HTMLElement}
 ****************************/

function updateTotalLikes(totalLikes) {
  let numberOfTotalLikes = 0;
  $heartLink = document.querySelectorAll("span.fa-heart");
  $heartLink.forEach((item) => {
    numberOfTotalLikes += parseInt(item.parentElement.innerText);
  });
  totalLikes.childNodes[0].nodeValue = numberOfTotalLikes;
  //totalLikes.innerHTML = numberOfTotalLikes + '<i class="fas fa-heart" aria-label="likes"></i>';
}

/**********************************************************
 *    Function to increment Likes
 **********************************************************/

function incrementLikes(e, totalLikes) {
  //get id of work element
  const id = parseInt(e.target.parentElement.id);
  const currentWorkElt = dataCreatorGallery.filter((workElt) => workElt.id === id);
  const originalWorkEltLikes = originalLikesFromJson.filter((workElt) => workElt.id === id);
  //get DOM element by id
  const likeId = document.getElementById(id);
  //console.log(currentWorkElt[0].likes, originalWorkEltLikes[0].likes);

  if (currentWorkElt[0].likes === originalWorkEltLikes[0].likes) {
    //adding +1 likes
    currentWorkElt[0].likes += 1;
    //display likes
    likeId.childNodes[0].nodeValue = currentWorkElt[0].likes;
    //modify style of heart after click
    likeId.childNodes[1].setAttribute("class", "fas fa-heart");
  } else if (currentWorkElt[0].likes === originalWorkEltLikes[0].likes + 1) {
    //removing 1 likes
    currentWorkElt[0].likes = originalWorkEltLikes[0].likes;
    //display likes
    likeId.childNodes[0].nodeValue = currentWorkElt[0].likes;
    //modify style of heart after click
    likeId.childNodes[1].setAttribute("class", "far fa-heart");
  }

  updateTotalLikes(totalLikes);
}

/**********************************************************
 *          Keyboard navigation on heart Element
 *********************************************************/

const keyboardHeartNav = (e, totalLikes) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (e.target.classList.contains("fa-heart")) {
      incrementLikes(e, totalLikes);
    }
  }
};

function listeningHeartPress(totalLikes) {
  $heartLink = document.querySelectorAll("span.fa-heart");
  $heartLink.forEach((item) => {
    item.addEventListener("keydown", (e) => {
      keyboardHeartNav(e, totalLikes);
    });
    item.addEventListener("click", (e) => {
      incrementLikes(e, totalLikes);
    });
  });
}

/**********************************************************
 *    Function to render photographer-page.html
 **********************************************************/

function RenderPhotographerWorkOverview() {
  if (window.location.pathname === `${urlGithubPath}/photographer-page.html`) {
    const id = parseInt(window.location.search.replace("?id=", ""));
    //console.log(id, dataBase);

    //filter photographer informations from dataBase by photographer id
    const dataCreator = dataBase.photographers.filter((photographer) => photographer.id === id)[0];
    //filter photographer work elements (image & video) from dataBase by photographer id
    dataCreatorGallery = dataBase.media.filter((media) => media.photographerId === id);
    //console.log(dataCreatorGallery);

    displayCreatorCard(dataCreator);

    /**********************************************************
     *   DOM Element and Eventlistener for Contact Form
     **********************************************************/
    //DOM Element
    $overlay = document.getElementById("overlay");
    $formBody = document.getElementById("form-body");
    $contactBtn = document.getElementById("ph-contact");
    $firstnameInput = document.getElementById("first-name");
    const formCloseBtn = document.getElementById("close-btn");
    const totalLikes = document.getElementById("total-likes");

    $contactBtn.addEventListener("click", () => openFormModal($formBody, overlay, keyboardAccessToForm));
    formCloseBtn.addEventListener("click", () => closeFormModal($formBody, $overlay, $contactBtn));

    /*******************************************************************
     * Menu and Link for Sorting Photographer Work (image & Video)
     *******************************************************************/
    $dropdownMenu = document.querySelector(".sort-list");
    $dropdownLink = document.querySelector(".sort-btn");

    $dropdownLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSortingMenu();
    });

    displayCreatorGallery(dataCreatorGallery);
    displayTotalLikes(dataCreatorGallery, totalLikes);

    /*******************************************************************
     * EventListener by Keyboard press on photographers Work Elements
     *******************************************************************/

    $workElts = document.querySelector(".works-elts");
    $workElts.addEventListener("keydown", keyboardWorkNav);

    /************************************************************************************
     *  Eventlistener on Keyboard Press or Click to increment Likes and TotalLikes
     *************************************************************************************/
    listeningHeartPress(totalLikes);

    /*******************************************************************
     * SORT LI ELEMENT FUNCTION FOR PHOTOGRAPHER WORK
     *******************************************************************/

    $popularitySortLi = document.getElementById("sort-1");
    $dateSortLi = document.getElementById("sort-2");
    $titleSortLI = document.getElementById("sort-3");

    $popularitySortLi.addEventListener("click", (e) => {
      e.preventDefault();
      //hide btn that display dropdown menu
      hideSortList();
      //delete all gallery before sorting it
      deleteGallery();
      //sort data by likes descending order
      sortByLikes();
      //modify title into dropdownBtn
      modifyDropdownBtnTitle("Popularité");
      //modify likes after sorting
      updateTotalLikes(totalLikes);
      listeningHeartPress(totalLikes);
    });
    $dateSortLi.addEventListener("click", (e) => {
      e.preventDefault();
      //hide btn that display dropdown menu
      hideSortList();
      //delete all gallery before sorting it
      deleteGallery();
      //sort data by date recent to old
      sortByDate();
      //modify title into dropdownBtn
      modifyDropdownBtnTitle("Date");
      //modify likes after sorting
      updateTotalLikes(totalLikes);
      listeningHeartPress(totalLikes);
    });
    $titleSortLI.addEventListener("click", (e) => {
      e.preventDefault();
      //hide btn that display dropdown menu
      hideSortList();
      //delete all gallery before sorting it
      deleteGallery();
      //sort data by title
      sortByTitle();
      //modify title into dropdownBtn
      modifyDropdownBtnTitle("Titre");
      //modify likes after sorting
      updateTotalLikes(totalLikes);
      listeningHeartPress(totalLikes);
    });

    /******************************************************************************
     *  Eventlistener on Keyboard Press 'Enter' to display Element on Lightbox
     *****************************************************************************/
    $alink = document.querySelectorAll("a > img, video");
    $alink.forEach((item) => item.addEventListener("keydown", keyboardWorkNav));
  }
}

/**********************************************************
 *
 *          Fetching data from Json file
 *
 **********************************************************/

fetch(`${urlGithub}/Json.json`)
  .then((res) => res.json())
  .then((data) => {
    dataBase = data;
    originalLikesFromJson = dataBase.media.map((item) => {
      return { id: item.id, likes: item.likes };
    });

    renderHomePage();

    RenderPhotographerWorkOverview();
  })
  .catch((err) => console.log(err));
