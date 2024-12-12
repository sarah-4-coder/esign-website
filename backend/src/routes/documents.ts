// @ts-nocheck
import express from 'express';
import Document from '../models/Document';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { fileName, fileUrl, signaturePositions } = req.body;
    const document = new Document({
      userId: req.user.userId,
      fileName,
      fileUrl,
      signaturePositions,
    });
    await document.save();
    res.status(201).json({ message: 'Document uploaded successfully', documentId: document._id });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading document' });
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

export default router;

