// Api Key for OMDB Api
const apiKey = '9c2b82bd';

const search_keyword = document.getElementById('search-movie');
const search_list = document.getElementById('search-list');

// Function to load OMDB API data based on search value
async function loadOmdbApi(search_val){
    if(search_val)
    {
        const url = `https://www.omdbapi.com/?s=${search_val}&page=1&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if(data.Response === "True") {
            search_list.classList.remove('d-none');
            showMovieList(data.Search);
        }
        else
        {
            search_list.innerHTML = '<h2 class="text-center bg-white p-4 mt-4 shadow rounded">No movies found.</h2>';
        }
    }
    else
    {
        search_list.innerHTML = '<h2 class="text-center bg-white p-4 mt-4 shadow rounded">Movie search results are displayed here.</h2>';
    }
}

// Function to handle movie search
function searchMovie(){
    let search_val = search_keyword.value.trim();
    loadOmdbApi(search_val);
}

// Function to display search results
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
                            <a onclick="event.stopPropagation(); addToFavourite('${movie.imdbID}')" class="badge bg-dark p-2"><i class="fa fa-plus"></i> Favourite </a>
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

// Function to add movie to favorites
function addToFavourite(movieID) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

    if (favoriteMovies.includes(movieID)) 
    {
        // Remove from favorites if already added
        favoriteMovies = favoriteMovies.filter(id => id !== movieID);
    } 
    else 
    {
        // Add to favorites if not already added
        favoriteMovies.push(movieID);
        alert("Movie Added to favourite movies list Successfully");
    }

    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}
// End 

// Function to load API data for a specific movie ID
async function loadApi(movieID)
{
    const url = `https://www.omdbapi.com/?i=${movieID}&page=1&apikey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// Function to load favorite movies page
function loadFavourite(){
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const fav_search_list = document.getElementById('fav-search-list');
    fav_search_list.innerHTML = "";

    if (favoriteMovies.length > 0) {
        favoriteMovies.forEach(movieID => {
            // Fetch movie data for each favorite movie
            loadApi(movieID).then(movieData => {

                let moviePoster = movieData.Poster !== "N/A" ? movieData.Poster : "./image/no-poster-available.jpg";
                
                // Create HTML for each favorite movie card
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
                                    <a onclick="event.stopPropagation(); removeFav('${movieData.imdbID}')" class="badge bg-danger p-2">
                                        <i class="fa fa-trash"></i> Remove
                                    </a>
                                </div>
                            </div>
                        </div>
                        <br>
                    </div>
                `;
                
                fav_search_list.innerHTML += favMovieListItem;  // Append favorite movie card to list
            });
        });
    } 
    else {
        // Display message if no favorite movies found
        let favMovieListItem = `<h2 class="text-center bg-white p-4 mt-4 shadow rounded">No favorite movies added yet.</h2>`;
        fav_search_list.innerHTML += favMovieListItem;
    }
}

// Function to remove movie from favorites
function removeFav(movie_id) {

    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const index = favoriteMovies.indexOf(movie_id);
    if (index > -1) {
        favoriteMovies.splice(index, 1); // Remove movie from favorites list
    }
    alert("Movie removed from favorites successfully.");
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies)); // Update localStorage
    location.reload();    

}

// Function to navigate to movie details page
function showMovieDetails(movieId) {
    window.location.href = `movie.html?movie_id=${movieId}`;  // Redirect to movie details page
}

// Function to load movie details on movie details page
async function loadMovieDetails() {

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movie_id'); // Get movie id from URL parameters
    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = "";

    try {
        const movieData = await fetchMovieData(movieId); // Fetch movie data using API
        let moviePoster = movieData.Poster !== "N/A" ? movieData.Poster : "./image/no-poster-available.jpg";
        
        // Create HTML for movie details
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
                            <p class="card-text mb-0"><i class="fa fa-star"></i> ${movieData.imdbRating}</p>
                            <div>
                                <a onclick="event.stopPropagation(); addToFavourite('${movieData.imdbID}')" class="badge bg-dark p-2 m-2 text-end"><i class="fa fa-plus"></i> Favourite</a>
                            </div>
                        </div>
                        <p class="card-text mb-2"><strong>Director:</strong> <span>${movieData.Director}</span></p>
                        <p class="card-text mb-2"><strong>Writer:</strong> <span>${movieData.Writer}</span></p>
                        <p class="card-text mb-2"><strong>Actors:</strong> <span>${movieData.Actors}</span></p><p></p>
                        <p class="card-text mb-2"><strong>Genre:</strong> <span>${movieData.Genre}</span></p>
                        <p class="card-text mb-2"><strong>Released:</strong> <span>${movieData.Released}</span></p>
                        <p class="card-text mb-2"><strong>Runtime:</strong> <span>${movieData.Runtime}</span></p><p></p>
                        <p class="card-text mb-3"><strong>Plot:</strong> <span>${movieData.Plot}</span></p>
                        <p class="card-text"><i class="fa fa-trophy"></i> <span>${movieData.Awards}</span></p>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        movieDetailsContainer.innerHTML = movieHTML; // Display movie details
    } catch (error) {
        console.error("Error fetching movie data:", error);
        movieDetailsContainer.innerHTML = `<p>Failed to load movie details. Please try again later.</p>`;
    }
}

// Function to fetch movie data 
async function fetchMovieData(movieId) {
    const response = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}
