
import React, { useRef, useEffect, useState } from 'react';

interface CameraModalProps {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(err => {
        alert("Camera failed: " + err.message);
        onClose();
      });

    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        onCapture(canvasRef.current.toDataURL('image/jpeg'));
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video bg-black">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="p-6 flex justify-between items-center bg-slate-950">
          <button onClick={onClose} className="px-6 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={capture} className="bg-indigo-600 px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 text-white">Capture Photo</button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
