import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function useCameraRecorder() {
  const { notify } = useAppContext();
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const videoRef = useRef(null);
  const mediaRecorder = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startCamera = async (mode = facingMode) => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      return mediaStream;
    } catch (err) {
      notify("Kamera erişim hatası!", "error");
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const startRecording = () => {
    chunksRef.current = [];
    setPreviewUrl(null);
    setDuration(0);
    
    const types = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'];
    const selectedType = types.find(t => MediaRecorder.isTypeSupported(t)) || '';

    mediaRecorder.current = new MediaRecorder(stream, { mimeType: selectedType });
    mediaRecorder.current.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: selectedType });
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
    };

    mediaRecorder.current.start(100);
    setIsRecording(true);
    timerRef.current = setInterval(() => setDuration(p => p + 1), 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state !== 'inactive') mediaRecorder.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
  };

  useEffect(() => {
    if (countdown === 4 && !stream) startCamera();
    if (countdown === 0) { setCountdown(null); startRecording(); }
    else if (countdown !== null) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return {
    stream, videoRef, facingMode, isRecording, duration, countdown, previewUrl, isSaving, setIsSaving,
    startCamera, stopCamera, toggleCamera, setCountdown, stopRecording, setPreviewUrl, setDuration
  };
}
