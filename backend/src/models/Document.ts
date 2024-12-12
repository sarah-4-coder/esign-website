import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  signaturePositions: [{ x: Number, y: Number, page: Number }],
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);

