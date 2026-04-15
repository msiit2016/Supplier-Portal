import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import connectionRoutes from './routes/connectionRoutes';
import poRoutes from './routes/poRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import productRoutes from './routes/productRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/pos', poRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
const server = app.listen(Number(port), '0.0.0.0', () => {
  console.log(`[server]: USP Backend is running at http://0.0.0.0:${port}`);
  console.log(`[server]: Health check available at http://0.0.0.0:${port}/health`);
});

// Handle Railway/Cloud graceful shutdowns and random crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('[server]: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[server]: Uncaught Exception:', error);
  // Optional: Graceful shutdown
  // server.close(() => process.exit(1));
});
