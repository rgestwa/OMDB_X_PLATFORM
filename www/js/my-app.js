// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});


$$(document).on('deviceready', function() {
   
    $('#movieForm').on("submit", function(e){
        
        var searchMovie = $('#movieName').val();
        
        fetchMovies(searchMovie);
        console.log(searchMovie);
        
        e.preventDefault();
    });
    
});







function fetchMovies(searchMovie){
    
    $.ajax({
        method: "GET",
        url: "http://www.omdbapi.com/?apikey=80fe09c6&s=" + searchMovie
        
    }).done(function(data){
        console.log(data);
		
		if(data.Response == "False"){
			//send alert
    		myApp.alert('Please type a valid title', 'Uh-oh!');
		}
		
		var movieArray = data.Search;
		
		var movieList = "";
		
		$.each(movieArray, function(index, movie){
			   movieList += `<li>
      <a href="movie.html" class="item-link item-content"
		onclick="clickedMovie('${movie.imdbID}')">
        <div class="item-media"><img src="${movie.Poster}" height="50"></div>
        <div class="item-inner">
          <div class="item-title-row">
            <div class="item-title">${movie.Title}</div>
            <div class="item-after">${movie.Year}</div>
          </div>
          
          
        </div>
      </a>
    </li>`;
			
			$('#moviesList').html(movieList);
			   });
		
    });
    
    
}


function clickedMovie(id){
	console.log(id);
	
	sessionStorage.setItem("movieID", id);
}




myApp.onPageInit('movie', function (page) {
	var mID = sessionStorage.getItem("movieID");
	movieDetails(mID);

})


function movieDetails(mID){
	$.ajax({
        method: "GET",
        url: "http://www.omdbapi.com/?apikey=80fe09c6&i=" + mID
        
    }).done(function(response){
        console.log(response);
		
		//TODO: add runtime, imdb rating, awards
		
		var mDetails = `<div class="card demo-card-header-pic">
  <img src="${response.Poster}" style="width:100%;">
  <div class="card-content">
    <div class="card-content-inner">
      <p class="color-gray">IMDB Rating: ${response.imdbRating}</p>
      <p style="width:100%;">${response.Plot} ${response.Runtime}</p>
    </div>
	<div class="card-content-inner">
<p>${response.Awards}</p>
</div>
  </div>
  <div class="card-footer">
    <p class="card-content">${response.Director}</p>
    <p class="card-content">${response.Year}</p>
  </div>
</div>

`;
		
		$('#movieD').html(mDetails);
		
	});
}