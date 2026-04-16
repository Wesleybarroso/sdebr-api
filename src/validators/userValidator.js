import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  quer_ser_ponto: z.boolean().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6)
});