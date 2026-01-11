import express from 'express';
import { Movie, db_connect, User } from './db.js';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { verifyToken } from './auth.js';
import { jwtDecode } from 'jwt-decode';
import { review } from './aiController.js';


const app = express();
const PORT = 3000;
db_connect();
app.use(cors());
app.use(express.json())

app.get('/api/movies', async (req, res) => {
    await Movie.find().select('-_id -votes').then((data) => {
        res.json(data);
    });
});

app.get('/api/movies/:name', async (req, res) => {

    const movieName = req.params.name;
    await Movie.find({ title: { $regex: movieName, $options: 'i' } }).select('-_id -votes').then((data) => {
        res.json(data);
    });
});

app.post('/api/register', async (req, res) => {
    const { userName, password, type } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username: userName,
        password: hash,
        role: type
    })
    await newUser.save();
    res.status(200).json({
        succes: "User registered"
    })
})

app.post('/api/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ username: userName });
        if (!user) {
            return res.status(401).json({ error: 'userAuthentication failed' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'passAuthentication failed' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role }, 'secret',
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/add-movie', verifyToken, async (req, res) => {
    try {
        const { title, year, rating, genre, director } = req.body;
        if (!title || !year) {
            return res.status(400).json({ error: 'title and year are required' });
        }
        
        const newMovie = new Movie({
            title,
            year,
            rating,
            genre,
            director
        });
        const saved = await newMovie.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add movie', details: err.message });
    }
});

//delete-movie
app.delete('/api/delete-movie/:name', verifyToken, async (req, res) => {
    try {
        const movieName = req.params.name;
        const movie = await Movie.find({ title: movieName });
        const mongodb_response = await Movie.deleteOne(movie[0]._id)
        const response = {
            status: "success",
            deleted_item: movie,
            mongodb_response: mongodb_response
        }
        res.status(204).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete movie', details: error.message });
    }
})
//get registered users.
app.get('/api/get-users', verifyToken, async (req, res) => {
    await User.find({}).select('username role -_id').then((data) => {
        res.json(data);
    });
});
//update movie info
app.patch('/api/update-movie/:name',verifyToken,async(req,res)=>{
    try{
        const movieName = req.params.name;
        console.log(req.body);
        const movie = await Movie.findOneAndUpdate({ title: movieName }, req.body, { returnNewDocument: true });
        res.status(200).json(movie);
    }
    catch(error){
        res.status(500).json({ error: 'Failed to update movie', details: error.message });
    }
})
//get profile
app.get('/api/get-profile', async (req, res) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing Authorization header' });
    }
    token = token.split(' ')[1]
    const decodedToken = jwtDecode(token);
    await User.findById(decodedToken.userId).select('username  role -_id').then((data) => {
        res.json(data);
    });
});
//gemini route
app.get('/api/movie-review/:name',async (req,res)=>{
    try {
        let token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing Authorization header' });
        }
        token = token.split(' ')[1]
        const decodedToken = jwt.verify(token, 'secret');
        await User.findById(decodedToken.userId);
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }finally{
        const movieName = req.params.name;
        await Movie.findOne({ title: { $regex: movieName, $options: 'i' } }).select('-_id -votes').then(async (data) => {
            const respone_review =  await review(data);
            res.json({
                review:respone_review
            })
        });
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});