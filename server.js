import express from 'express';
import { Movie,db_connect,User} from './db.js';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import { verifyToken } from './auth.js';
db_connect();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json())
app.get('/api/movies', async (req, res) => {

    await Movie.find().then((data) => {
        res.json(data);
    });
});
app.get('/api/movies/:name', async (req, res) => {//add fuzzy searching

    const movieName = req.params.name;
    await Movie.find({ title: movieName }).then((data) => {
        res.json(data);
    });
}); 
app.post('/api/register',async (req,res)=>{
    const {userName,password,type} = req.body;
    const newUser = new User({
        username:userName,
        password:password,
        role:type
    })
    await newUser.save();
    res.status(200).json({
        succes:"User registered"
    })
})

app.post('/api/login', async (req, res) => { // add bcrypt later for password hashing..
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ username: userName });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },'secret',
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});