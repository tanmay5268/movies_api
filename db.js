import mongoose  from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export function db_connect() {
    async function connect() {
        try {
            await mongoose.connect(process.env.MONGODB_URL).then(()=>{
                console.log("Connected to mongoDB successfully");
                
                console.log(Movie);
            });
            
            
        }
        catch (err) {
            console.log("Error while connecting to mongoDB", err);
        }
    }
    connect();
    
}
const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rating: String,
    genre: Array,
    director: String
});
export const Movie = mongoose.model('Movie', movieSchema);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'viewer' }
});
export const User = mongoose.model('User',userSchema);