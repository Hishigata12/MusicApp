searchBtn = document.getElementById('search-btn')
searchBox = document.getElementById('search-box')
searchResults = document.getElementById('search-results-div')
searchResult = document.getElementById('search-result')
songList = document.getElementById('song-list')

let songs = []

searchBtn.addEventListener('click', function(e) {
    e.preventDefault()

    searchData = {
    search: searchBox.value
    }
    console.log(searchData)

    songData = getSongs()
    console.log(songData)
    titles = songData.map(item => item.title)
    searchResults.innerHTML = /*html*/`
    <h1>${titles}</h1>
    `
    // searchResult.textContent = searchBox.value
})

function getSongs() {
    getReq('/data/songs').then((data) => {
        console.log(data[0].title)
        titles = data.map(item => item.title)
        sources = data.map(item => item.source)
        data.sort((a, b) => a.title.localeCompare(b.title));
        console.log(data)
        displaySongs(data)
        createTable(data);
    })
}
getSongs()


function displaySongs(songs) {
    songList.innerHTML = ``
    for (let i = 0;i < songs.length; i++) {
        songList.innerHTML += /*html*/`
            <li>${songs[i]}</li>
            `
            console.log(songs[i])
    }
}

function createTable(data) {
    const fold = 'C:/Users/creat/Documents/Code/Music App/data/tabs/'
    const table = document.createElement('table'); // Create a table element
    const thead = document.createElement('thead'); // Create thead element
    const tbody = document.createElement('tbody'); // Create tbody element

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Title', 'Source', 'gp', 'pdf'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table body rows
    data.forEach(item => {
      const row = document.createElement('tr');
      t = Object.values(item)
      console.log(t)
      for (let i = 0; i < 4; i++) {
        if (i != 2 && i != 3) {
            const td = document.createElement('td');
            td.textContent = t[i];
            td.classList.add('song-name')
            if (i == 0) {
                td.textContent = ''
                link = document.createElement('a')
                link.textContent = t[i]
                link.href = t[4]
                link.target = '_blank'
                td.appendChild(link)
            }
            
            row.appendChild(td)
        }
        else if (i == 2) {
            const td = document.createElement('td')
            link = document.createElement('a')
            link.textContent = 'tab'
            link.classList.add('gp')
            link.href = t[2]
            link.target = '_blank'
            td.appendChild(link)
            row.appendChild(td)
        }
        else if (i == 3) {
            const td = document.createElement('td')
            link = document.createElement('a')
            imag = document.createElement('img')
            imag.classList.add('icon')
            imag.src = "/images/pdf.jpg"
            link.href = `/tabs/${t[3]}`
            link.target = '_blank'
            link.appendChild(imag)
            td.appendChild(link)
            row.appendChild(td)
        }
        
        
      }
    //   Object.values(item).forEach(text => {
    //     const td = document.createElement('td');
    //     td.textContent = text;
    //     row.appendChild(td);
    //   });
      tbody.appendChild(row);
    });

    // Append thead and tbody to the table
    table.appendChild(thead);
    table.appendChild(tbody);

    // Append table to the container in the DOM
    document.getElementById('table-container').appendChild(table);
}

// document.getElementById('pdf-input').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     console.log(file)
//     const fileReader = new FileReader();

//     fileReader.onload = function(e) {
//         const pdfData = new Uint8Array(e.target.result); // Convert file to byte array

//         // Load the PDF
//         pdfjsLib.getDocument({ data: pdfData }).promise.then(function(pdf) {
//         // Get the first page
//         pdf.getPage(1).then(function(page) {
//             const viewport = page.getViewport({ scale: 0.2 });
//             const canvas = document.getElementById('pdf-thumb');
//             const ctx = canvas.getContext('2d');

//             canvas.width = viewport.width;
//             canvas.height = viewport.height;

//             const renderContext = {
//             canvasContext: ctx,
//             viewport: viewport
//             };
//             page.render(renderContext);
//         });
//         });
//     };

//     fileReader.readAsArrayBuffer(file);
// });


  
