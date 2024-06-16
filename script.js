const apiKey = '9c2b82bd';
const search_keyword = document.getElementById('search-movie');
const search_list = document.getElementById('search-list');

// Load Omdb Api data according to Search Result
async function loadOmdbApi(search_val){
    const url = `https://www.omdbapi.com/?s=${search_val}&page=1&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if(data.Response === "True") {
        showMovieList(data.Search);
    }
}

function searchMovie(){
    let search_val = search_keyword.value.trim();
    loadOmdbApi(search_val);
}

// Search Card Results 
function showMovieList(movies) {
    search_list.innerHTML = "";
    movies.forEach(movie => {
        let moviePoster = movie.Poster !== "N/A" ? movie.Poster : "./image/no-poster-available.jpg";
        let movieDiv = `
            <div class="col-sm-4">
                <div class="container-card shadow-lg" onclick="showMovieDetails('${movie.imdbID}')">
                    <div class="card-body">
                    <div class="image-container mb-3">
                        <img src="${moviePoster}" alt="${movie.Title}">
                    </div>
                    
                        <h5 class="card-title">${movie.Title}</h5>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span>${movie.Year}</span>
                            <a onclick="event.stopPropagation(); addToWatchlist('${movie.imdbID}')" class="badge bg-dark p-2"><i class="fa-regular fa-plus"></i> Favourite </a>
                        </div>
                    </div>
                </div>
                <br>
            </div>
        `;
        search_list.innerHTML += movieDiv;
    });
}
// End 

// Add To WatchList
function addToWatchlist(movieID) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    if (favoriteMovies.includes(movieID)) {
        favoriteMovies = favoriteMovies.filter(id => id !== movieID);
    } else {
        favoriteMovies.push(movieID);
        alert("Movie Added to My favourite movies list Successfully");
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}
// End 

// Load Api data for a specific movie ID
async function loadApi(movieID){
    const url = `https://www.omdbapi.com/?i=${movieID}&page=1&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// Load Watchlist Page Function
function loadWatchList() {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    if(favoriteMovies.length > 0) {
        const fav_search_list = document.getElementById('fav-search-list');
        fav_search_list.innerHTML = "";

        favoriteMovies.forEach(movieID => {
            loadApi(movieID).then(movieData => {

                let moviePoster = movieData.Poster !== "N/A" ? movieData.Poster : "./image/no-poster-available.jpg";
                let favMovieListItem = `
                    <div class="col-sm-4">
                        <div class="container-card shadow-lg" onclick="showMovieDetails('${movieData.imdbID}')">
                         <div class="card-body">
                            <div class="image-container mb-3">
                                <img src="${moviePoster}" alt="${movieData.Title}">
                            </div>
                           
                                <h5 class="card-title">${movieData.Title}</h5>
                                <div class="d-flex justify-content-between align-items-center mt-2">
                                    <span>${movieData.Year}</span>
                                    <a onclick="event.stopPropagation(); removeFav('${movieData.imdbID}')" class="badge bg-danger p-2"><i class="fa-regular fa-trash-can"></i>   
                                    Remove</a>
                                </div>
                            </div>
                        </div>
                        <br>
                    </div>
                `;
                fav_search_list.innerHTML += favMovieListItem;
            });
        });
    }
}

// Remove From Watchlist
function removeFav(movie_id) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const index = favoriteMovies.indexOf(movie_id);
    if (index > -1) {
        favoriteMovies.splice(index, 1);
    }
    alert("Movie Remove from Watchlist Successfully.");
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    location.reload();    
}

// Function to show movie details
function showMovieDetails(movieId) {
    window.location.href = `movie.html?movie_id=${movieId}`;
}

// Function to load movie details
async function loadMovieDetails() {
    document.getElementById("loaderDiv").style.display = "none";
    document.getElementById("movieDetails").style.display = "block";

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movie_id');

    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = "";

    try {
        const movieData = await fetchMovieData(movieId);
        let moviePoster = movieData.Poster !== "N/A" ? movieData.Poster : "./image/no-poster-available.jpg";
        
        const movieHTML = `
            <div class="movie-card-div col-sm-9">
            <div class="row rounded-card shadow-lg">
                <div class="col-md-4">
                    <img src="${moviePoster}" class="img-section" alt="${movieData.Title} Poster">
                </div>
                <div class="col-md-8 details">
                    <div class="card-body">
                        <h3 class="card-title">${movieData.Title}</h3>
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="card-text mb-0"><i class="fa-solid fa-star"></i> ${movieData.imdbRating}</p>
                            <div>
                                <a onclick="event.stopPropagation(); addToWatchlist('${movieData.imdbID}')" class="badge bg-dark p-2 m-2 text-end"><i class="fa-regular fa-plus"></i> Watchlist</a>
                            </div>
                        </div>
                        <p class="card-text mb-2"><strong>Director:</strong> <span>${movieData.Director}</span></p>
                        <p class="card-text mb-2"><strong>Writer:</strong> <span>${movieData.Writer}</span></p>
                        <p class="card-text mb-2"><strong>Actors:</strong> <span>${movieData.Actors}</span></p>
                        <p class="card-text mb-2"><strong>Genre:</strong> <span>${movieData.Genre}</span></p>
                        <p class="card-text mb-2"><strong>Released:</strong> <span>${movieData.Released}</span></p>
                        <p class="card-text mb-2"><strong>Runtime:</strong> <span>${movieData.Runtime}</span></p>
                        <p class="card-text mb-3"><strong>Plot:</strong> <span>${movieData.Plot}</span></p>
                        <p class="card-text"><i class="fa-solid fa-award"></i> <span>${movieData.Awards}</span></p>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        movieDetailsContainer.innerHTML = movieHTML;
    } catch (error) {
        console.error("Error fetching movie data:", error);
        movieDetailsContainer.innerHTML = `<p>Failed to load movie details. Please try again later.</p>`;
    }
}

// Function to fetch movie data (replace this with your actual API call)
async function fetchMovieData(movieId) {
    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}
