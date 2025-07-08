import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'quizzling_db',
  password: 'durgamma',
  port: 5432,
});

// Sample API route
app.get('/api/questions', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM questions');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));