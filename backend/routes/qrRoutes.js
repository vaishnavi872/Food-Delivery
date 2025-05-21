// routes/qrRoutes.js
import express from 'express';
import QRCode from 'qrcode';

const router = express.Router();

// Route: Generate QR for a food item
router.get('/food/:id', async (req, res) => {
  const { id } = req.params;
  const link = `http://localhost:5173/food/${id}`; // Adjust this for your frontend

  try {
    const qrCode = await QRCode.toDataURL(link);
    res.json({ success: true, qrCode }); // returns base64 image
  } catch (err) {
    res.status(500).json({ success: false, message: 'QR code generation failed' });
  }
});

// Route: Generate QR for a table view
router.get('/table/:tableId', async (req, res) => {
  const { tableId } = req.params;
  const link = `http://localhost:5173/menu?table=${tableId}`;

  try {
    const qrCode = await QRCode.toDataURL(link);
    res.json({ success: true, qrCode });
  } catch (err) {
    res.status(500).json({ success: false, message: 'QR code generation failed' });
  }
});

export default router;
