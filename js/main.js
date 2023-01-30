// Page number
const page = 1;

// Items per page
const perPage = 10;

//load movieData
function loadMovieData() 
{
    fetch(`https://calm-plum-dugong-slip.cyclic.app/api/movies/?page=${page}&perPage=${perPage}`)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            saleData = myJson;
            let rows = saleTableTemplate(saleData);
            $("#sale-table tbody").html(rows);
            $("#current-page").html(page);
        })
}

function loadMovieData(title = null) {
    if (title) {
        fetch(`https://calm-plum-dugong-slip.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`).then((res) => {
            return res.json()
        }).then((data) => {
            var pagination = document.querySelector('.pagination');
            pagination.classList.add("d-none");
            createMovieTable(data);
            setPageCount();
            createClickEventForRow();
            getPreviousPage();
            getNextPage();
            formSearchBtn();
            formClearBtn();
        })
    } else {
        fetch(`https://calm-plum-dugong-slip.cyclic.app/api/movies?page=${page}&perPage=${perPage}`).then((res) => {
            return res.json();
        }).then((data) => {
            createMovieTable(data);
            setPageCount();
            createClickEventForRow();
            getPreviousPage();
            getNextPage();
            formSearchBtn();
            formClearBtn();
        })        
    }
}

function createTrElement(movieData) {
    let rowElement = `${
        movieData.map(movie => (`
        <tr movie-id=${movie._id}>
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot ? movie.plot : 'N/A'}</td>
            <td>${movie.rated ? movie.rated : 'N/A'}</td>
            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
        </tr>
        `)).join('')
    }`

    return rowElement;
}

function createMovieTable(movieData) {
    let rowElement = createTrElement(movieData);
    let tableBody = document.querySelector('#moviesTable tbody');
    tableBody.innerHTML = rowElement;
}

function setPageCount() {
    document.querySelector('#current-page').innerHTML = page;
}

function createClickEventForRow() {
    let movieRows = document.querySelectorAll('tbody tr');
    movieRows.forEach(row => {
        row.addEventListener("click", () => {
            let movie_id = row.getAttribute('movie-id');
            fetch(`https://calm-plum-dugong-slip.cyclic.app/api/movies/${movie_id}`).then((res) => {
                return res.json();
            }).then((movie) => {
                document.querySelector('.modal-title').innerHTML = movie.title;
                if (movie.poster) {
                    document.querySelector('.modal-body').innerHTML = `
                        <img class="img-fluid w-100" src= ${movie.poster}><br><br>
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.plot ? movie.plot : 'N/A'}</p>
                        <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating}
                        (${movie.imdb.votes} votes)`
                } 
                else {
                    document.querySelector('.modal-body').innerHTML = `
                        <strong>Directed By:</strong> ${movie.directors.join(', ')}<br><br>
                        <p>${movie.plot ? movie.plot : 'N/A'}</p>
                        <strong>Cast:</strong> ${movie.cast ? movie.cast.join(', ') : 'N/A'}<br><br>
                        <strong>Awards:</strong> ${movie.awards.text}<br>
                        <strong>IMDB Rating:</strong> ${movie.imdb.rating}
                        (${movie.imdb.votes} votes)`
                }

                let movieModal = new bootstrap.Modal(document.querySelector('#detailsModal'), {
                    backdrop: 'static',
                    keyboard: false
                });
                movieModal.show();
            })
        })
    })
}
// For some reason the value of page increases and decreases exponetially, I'm not sure what could cause the issue other thank the event handling maybe
function getPreviousPage() {
    let pre = document.querySelector('#previous-page');
    bt.addEventListener('click', () => {
        if (page > 1) {
            page -= 1;
        }
        loadMovieData();
    })
}

function getNextPage() {
    let pre = document.querySelector('#next-page');
    bt.addEventListener('click', () => {
        page += 1;
        loadMovieData();
    })
}

function formSearchBtn() {
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        loadMovieData(document.querySelector('#title').value);
    });
}

function formClearBtn() {
    document.querySelector('#clearForm').addEventListener("click", () => {
        document.querySelector('#title').value = '';
        loadMovieData();
    })
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
});