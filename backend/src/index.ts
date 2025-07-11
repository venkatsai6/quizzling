import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from "openai";

// Initialize OpenAI client
dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
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

(async () => {
  const response = await client.responses.create({
      model: "gpt-4o",
      input: "Write a one-sentence bedtime story about a unicorn."
  });

  console.log(response.output_text);
})();

// // New AI endpoint
// app.post('/api/generate-questions', async (req: Request, res: Response) => {
//   const { topic, count } = req.body; // e.g., { topic: "history", count: 5 }
//   if (!topic || !count) {
//     return res.status(400).json({ error: 'Topic and count are required' });
//   }

//   try {
//     const completion = await client.chat.completions.create({
//       model: 'gpt-4o-mini', // Or 'gpt-4o' for better quality (costs more)
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a quiz generator. Create multiple-choice questions with 4 options and one correct answer.',
//         },
//         {
//           role: 'user',
//           content: `Generate ${count} quiz questions on "${topic}". Each question should have:
// - text: The question text
// - options: Array of 4 strings
// - correct_answer: The correct option string
// Output as JSON array of objects.`,
//         },
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     const generatedQuestions = JSON.parse(completion.choices[0].message.content || '[]');
//     // Optionally save to PostgreSQL
//     for (const q of generatedQuestions) {
//       await pool.query(
//         'INSERT INTO questions (text, options, correct_answer) VALUES ($1, $2, $3)',
//         [q.text, q.options, q.correct_answer]
//       );
//     }

//     res.json(generatedQuestions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to generate questions' });
//   }
// });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));