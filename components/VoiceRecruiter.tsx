
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

interface VoiceRecruiterProps {
  resumeText: string;
  jobDescription?: string;
  onClose: () => void;
}

// Manual base64 encoding/decoding as per instructions
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceRecruiter: React.FC<VoiceRecruiterProps> = ({ resumeText, jobDescription, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        
        audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const systemInstruction = `You are a professional, high-energy executive recruiter. 
        I am a candidate. You have just read my resume and the job description I'm targeting.
        
        RESUME:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription || 'Not provided - general career guidance.'}
        
        Start the conversation by greeting me warmly and giving a brief 30-second summary of your impressions. 
        Then, walk me through 2 major strengths you saw and 2 areas where I could improve. 
        Be conversational, use industry jargon appropriately, and encourage me to ask follow-up questions about how to beat the ATS or improve my bullet points. 
        Talk naturally as if we are on a quick discovery call.`;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setIsConnecting(false);
              setIsActive(true);
              
              const source = audioContextInRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encode(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextInRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64EncodedAudioString && audioContextOutRef.current) {
                const ctx = audioContextOutRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  ctx,
                  24000,
                  1
                );
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => console.error('Live API Error:', e),
            onclose: () => setIsActive(false),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction,
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error('Failed to start voice recruiter:', err);
        alert('Could not start voice session. Please ensure microphone access is granted.');
        onClose();
      }
    };

    startSession();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextInRef.current) audioContextInRef.current.close();
      if (audioContextOutRef.current) audioContextOutRef.current.close();
    };
  }, [resumeText, jobDescription, onClose]);

  const waveColors = ['bg-indigo-400', 'bg-pink-400', 'bg-cyan-400', 'bg-amber-400', 'bg-teal-400', 'bg-purple-400'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)] border border-white relative animate-slide-up">
        <div className="bg-slate-950 p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-600/30 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3">
               {isConnecting ? (
                 <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
               ) : (
                 <div className="flex gap-1.5 items-end h-12">
                   {[0.5, 0.9, 0.6, 1.0, 0.4, 0.8, 0.5].map((h, i) => (
                     <div 
                       key={i} 
                       className={`w-2 ${waveColors[i % waveColors.length]} rounded-full animate-bounce shadow-sm`} 
                       style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}
                     ></div>
                   ))}
                 </div>
               )}
            </div>
            <div className="space-y-3">
              <h3 className="text-white text-2xl font-black tracking-tight uppercase">
                {isConnecting ? 'Initializing Call' : 'Session Active'}
              </h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                {isConnecting 
                  ? 'Connecting with your executive career strategist...' 
                  : 'Speak naturally. Ask about your top strengths, keyword gaps, or interview strategy.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Target Context</p>
            <p className="text-base text-slate-700 font-bold leading-relaxed italic">
              {jobDescription 
                ? `Tailoring feedback for the provided Role Description.` 
                : `General professional audit and strategy session.`
              }
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-pink-50 text-pink-600 font-black rounded-3xl hover:bg-pink-100 transition-all border-2 border-pink-100 uppercase tracking-widest text-xs"
          >
            End Discovery Call
          </button>
        </div>

        <div className="absolute top-6 right-6 print:hidden">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecruiter;
