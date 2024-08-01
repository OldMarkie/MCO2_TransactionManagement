from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector
from db import get_db_connection, execute_query, fetch_one

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Ensure you have a secret key for flash messages

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/insert', methods=['POST'])
def insert_movie():
    movie_id = request.form['movie_id']
    title = request.form['title']
    director_name = request.form['director_name']
    actor_name = request.form['actor_name']
    release_date = request.form['release_date']
    production_budget = request.form['production_budget']
    movie_rating = request.form['movie_rating']
    genre = request.form['genre']
    
    query = """INSERT INTO movie 
               (MovieID, Title, DirectorName, ActorName, ReleaseDate, ProductionBudget, MovieRating, Genre) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    values = (movie_id, title, director_name, actor_name, release_date, production_budget, movie_rating, genre)
    
    try:
        execute_query(query, values)
        flash('Movie added successfully!', 'success')
    except Exception as e:
        flash('An error occurred: {}'.format(str(e)), 'danger')
    
    return redirect(url_for('index'))

@app.route('/search', methods=['GET'])
def search_movie():
    movie_id = request.args.get('search_id')
    
    query = "SELECT * FROM movie WHERE MovieID = %s"
    movie = fetch_one(query, (movie_id,))
    
    if movie:
        return render_template('index.html', movie=movie)
    else:
        flash('Movie not found!', 'danger')
        return redirect(url_for('index'))

@app.route('/update', methods=['POST'])
def update_movie():
    movie_id = request.form['movie_id']
    title = request.form['title']
    director_name = request.form['director_name']
    actor_name = request.form['actor_name']
    release_date = request.form['release_date']
    production_budget = request.form['production_budget']
    movie_rating = request.form['movie_rating']
    genre = request.form['genre']
    
    query = """UPDATE movie 
               SET Title = %s, DirectorName = %s, ActorName = %s, ReleaseDate = %s, 
                   ProductionBudget = %s, MovieRating = %s, Genre = %s 
               WHERE MovieID = %s"""
    values = (title, director_name, actor_name, release_date, production_budget, movie_rating, genre, movie_id)
    
    try:
        execute_query(query, values)
        flash('Movie updated successfully!', 'success')
    except Exception as e:
        flash('An error occurred: {}'.format(str(e)), 'danger')
    
    return redirect(url_for('index'))

@app.route('/delete', methods=['POST'])
def delete_movie():
    movie_id = request.form['delete_id']
    
    query = "DELETE FROM movie WHERE MovieID = %s"
    
    try:
        execute_query(query, (movie_id,))
        flash('Movie deleted successfully!', 'success')
    except Exception as e:
        flash('An error occurred: {}'.format(str(e)), 'danger')
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
