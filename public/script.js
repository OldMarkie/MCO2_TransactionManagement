$(document).ready(function() {
    // Handle form submission for inserting a new movie
    $('#insertForm').on('submit', function(event) {
        event.preventDefault();
        const data = {
            title: $('#title').val(),
            director: $('#director').val(),
            actor: $('#actor').val(),
            releaseDate: $('#releaseDate').val(),
            budget: $('#budget').val(),
            rating: $('#rating').val(),
            genre: $('#genre').val()
        };
        $.ajax({
            url: '/api/movies',
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                alert('Movie inserted successfully!');
            },
            error: function(err) {
                alert('Error inserting movie.');
            }
        });
    });

    // Handle form submission for updating an existing movie
    $('#updateForm').on('submit', function(event) {
        event.preventDefault();
        const id = $('#updateId').val();
        const data = {
            title: $('#updateTitle').val(),
            director: $('#updateDirector').val(),
            actor: $('#updateActor').val(),
            releaseDate: $('#updateReleaseDate').val(),
            budget: $('#updateBudget').val(),
            rating: $('#updateRating').val(),
            genre: $('#updateGenre').val()
        };
        $.ajax({
            url: `/api/movies/${id}`,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                alert('Movie updated successfully!');
            },
            error: function(err) {
                alert('Error updating movie.');
            }
        });
    });

    // Handle form submission for searching movies
    $('#searchForm').on('submit', function(event) {
        event.preventDefault();
        const searchTerm = $('#searchTerm').val();
        $.ajax({
            url: `/api/movies?search=${searchTerm}`,
            method: 'GET',
            success: function(response) {
                $('#reports').empty();
                
                // Display search results
                if (response.length > 0) {
                    let resultsHtml = '<ul class="list-group">';
                    response.forEach(movie => {
                        resultsHtml += `
                            <li class="list-group-item">
                                <h5>${movie.title}</h5>
                                <p><strong>Director:</strong> ${movie.director}</p>
                                <p><strong>Actor:</strong> ${movie.actor}</p>
                                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                                <p><strong>Budget:</strong> ${movie.budget}</p>
                                <p><strong>Rating:</strong> ${movie.rating}</p>
                                <p><strong>Genre:</strong> ${movie.genre}</p>
                            </li>
                        `;
                    });
                    resultsHtml += '</ul>';
                    $('#reports').html(resultsHtml);
                } else {
                    $('#reports').html('<p>No movies found.</p>');
                }
            },
            error: function(err) {
                alert('Error searching movies.');
            }
        });
    });
});
