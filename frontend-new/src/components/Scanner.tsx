
import React, { useRef, useEffect } from 'react';

interface ScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Camera access denied or unavailable.");
        onClose();
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const simulateScan = () => {
    // In a real app, we'd use a library like html5-qrcode here.
    // We simulate capturing whatever text the user "sees".
    const mockSerial = "SN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    onScan(mockSerial);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg aspect-video bg-slate-900 rounded-3xl overflow-hidden border-2 border-indigo-500 shadow-2xl">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-32 border-2 border-indigo-400 border-dashed animate-pulse"></div>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold">Cancel</button>
        <button onClick={simulateScan} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Capture Serial</button>
      </div>
      <p className="text-slate-500 mt-4 text-sm">Position barcode or QR code within the dashed frame.</p>
    </div>
  );
};

export default Scanner;
