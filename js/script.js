//grab UI elements
const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");
const alertMessage = document.getElementById("alertMessage");

// Build Api connector
const apiUrl = "https://api.lyrics.ovh";

//search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

//Show a song and artist in DOM
function showData(data) {
  result.innerHTML = `
        <ul class="songs">
           ${data.data
             .map(
               song => `
           <li>
           <span><strong>${song.artist.name}</strong> = ${song.title}</span>
           <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics </button>
           </li>
           `
             )
             .join("")}
        </ul>
    `;

    if(data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
            ${data.next ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = ``;
    }
}

//get more songs for page loader
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

//get Lyrics event listener
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    if(data.error) {
        const message = 'This song does not contain lyrics. Please try another song.'
        errorAlert(message);
    } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `
        <h2><strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>`;
    }
    more.innerHTML= '';
    
}

//Event listener
form.addEventListener("submit", e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
      const message = "Please type in a search term."
    errorAlert(message);
  } else {
    searchSongs(searchTerm);
  }
});

//get lyrics button event
result.addEventListener('click', e => {
    const clickedEl = e.target;

    if(clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle)
    }
})

//error alert message
function errorAlert(message) {
    alertMessage.innerHTML = message;
    setTimeout(() => {
      alertMessage.innerHTML = ``;
    }, 3000);
}