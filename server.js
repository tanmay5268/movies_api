import express from 'express';
import { Movie,db_connect,User} from './db.js';
import cors from 'cors';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
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
app.get('/api/movies/:name', async (req, res) => {

    const movieName = req.params.name;
    await Movie.find({ title: { $regex: movieName, $options: 'i' } }).then((data) => {
        res.json(data);
    });
}); 
app.post('/api/register',async (req,res)=>{
    const {userName,password,type} = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({
        username:userName,
        password:hash,
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
        const hash = bcrypt.hashSync(password, 10);
        const user = await User.findOne({ username: userName });
        if (!user) {
            return res.status(401).json({ error: 'userAuthentication failed' });
        }
        if (!bcrypt.compareSync(password, hash)) {
            return res.status(401).json({ error: 'passAuthentication failed' });
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