# movie-api
a rest api for my android application <br/>
[Movie App](http://github.com/serhat-demir/movie-app.git "Movie App")

## installation
note: before you run this project, you have to install node.js & mysql on your computer

clone repository: <br/>
`git clone https://github.com/serhat-demir/movie-api.git`

change directory: <br/>
`cd movie-api`

run project: <br/>
`node app.js`

## database schema
### users table
| column | type | description |
| --- | --- | --- |
| user_id | integer | pk, ai, not null |
| user_name | text | not null |
| user_password | text | not null |

### movies table
| column | type | description |
| --- | --- | --- |
| movie_id | integer | pk, ai, not null |
| movie_name | text | not null |
| movie_image | text | not null |
| movie_url | text | not null |
