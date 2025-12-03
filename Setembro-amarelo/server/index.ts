
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { ACOLHEBOT_SYSTEM_PROMPT } from './prompts.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, history, sessionId } = req.body;

  try {
    const baseUrl = 'https://api.groq.com/openai/v1/chat/completions'; // endpoint oficial
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.MODEL || 'openai/gpt-oss-120b';

    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY não configurada' });
    }

    console.log('[Groq] Session:', sessionId);
    console.log('[Groq] URL:', baseUrl);
    console.log('[Groq] Model:', model);
    console.log('[Groq] Key prefix:', apiKey.slice(0, 8) + '...');

    // Constrói mensagens: histórico + mensagem atual
    const messages: any[] = [
      { role: 'system', content: ACOLHEBOT_SYSTEM_PROMPT }
    ];

    // Adiciona histórico se fornecido
    if (Array.isArray(history) && history.length > 0) {
      messages.push(
        ...history.map((msg: any) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))
      );
    }

    // Adiciona mensagem atual
    messages.push({ role: 'user', content: message ?? '' });

    console.log('[Groq] Messages:', JSON.stringify(messages, null, 2));

    const response = await axios.post(
      baseUrl,
      {
        model,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content ?? '';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Erro ao chamar Groq:');
    console.error('message:', err?.message);
    if (err?.response) {
      console.error('status:', err.response.status);
      console.error('data:', err.response.data);
    }
    return res.status(err?.response?.status || 500).json({
      error: 'Falha ao chamar Groq',
      status: err?.response?.status,
      detail: err?.response?.data || err?.message || String(err),
    });
  }
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`✅ Server on http://localhost:${PORT}`);
});
