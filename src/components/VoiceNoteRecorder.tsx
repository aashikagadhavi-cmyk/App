import React, { useState, useRef, useEffect } from 'react';

interface VoiceNoteRecorderProps {
  audioUrl: string | null;
  onAudioChange: (dataUrl: string | null, duration: number) => void;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  audioUrl,
  onAudioChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('आपके ब्राउज़र में ऑडियो रिकॉर्डिंग समर्थित नहीं है। कृपया ऑडियो फ़ाइल अपलोड करें।');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          onAudioChange(base64Data, recordingTime);
        };

        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access issue:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'माइक्रोफ़ोन अनुमति नहीं मिली। आप नीचे से ऑडियो/वॉइस नोट फ़ाइल अपलोड भी कर सकते हैं।'
          : 'माइक चालू नहीं हो सका। कृपया नीचे से वॉइस नोट फ़ाइल चुनें।'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onAudioChange(base64, 15);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAudio = () => {
    if (isPlaying && audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
    onAudioChange(null, 0);
    setRecordingTime(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-[#f0f4ff] rounded-2xl p-3.5 border border-[#c4d0f5] flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1a237e] text-[20px]">mic</span>
          <span className="text-xs font-bold text-[#181c21]">
            बोलकर बताएं (वॉइस नोट रिकॉर्ड करें)
          </span>
        </div>
        <span className="text-[10px] text-[#454652] bg-white px-2 py-0.5 rounded-full border border-[#dfe2e9]">
          वैकल्पिक
        </span>
      </div>

      <p className="text-[11px] text-[#454652] leading-normal">
        अगर लिखने का समय नहीं है, तो माइक दबाकर बोलें कि पोस्टर में क्या-क्या लिखवाना है और कैसा डिज़ाइन चाहिए।
      </p>

      {/* When audio is not yet recorded */}
      {!audioUrl && !isRecording && (
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            type="button"
            onClick={startRecording}
            className="w-full sm:flex-1 bg-[#1a237e] hover:bg-[#000666] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
            <span>माइक दबाकर रिकॉर्ड करें</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto bg-white border border-[#c4d0f5] text-[#1a237e] py-2 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#e0e0ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            <span>वॉइस नोट चुनें</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioFileUpload}
          />
        </div>
      )}

      {/* When actively recording */}
      {isRecording && (
        <div className="bg-white p-3 rounded-xl border border-[#ff897d] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#ba1a1a] animate-ping"></span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#ba1a1a]">रिकॉर्डिंग जारी है...</span>
              <span className="text-[11px] font-mono font-bold text-[#181c21]">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="bg-[#ba1a1a] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">stop</span>
            <span>रिकॉर्डिंग रोकें</span>
          </button>
        </div>
      )}

      {/* When audio is recorded & ready */}
      {audioUrl && !isRecording && (
        <div className="bg-white p-3 rounded-xl border border-[#a3f69c] flex items-center justify-between gap-2">
          <audio
            ref={audioElementRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[#1b6d24] text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold text-[#1b6d24] truncate">
                ✓ वॉइस नोट सेव हो गया
              </span>
              <span className="text-[10px] text-[#767683]">
                {isPlaying ? 'ऑडियो बज रहा है...' : 'सुनने के लिए प्ले बटन दबाएं'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteAudio}
            className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors"
            title="वॉइस नोट हटाएं"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="text-[11px] text-[#ba1a1a] font-medium mt-0.5 leading-snug">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
