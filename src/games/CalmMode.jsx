import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, Radio as RadioIcon, Music, Wind } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CalmMode() {
  const { language, t } = useApp();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [station, setStation] = useState(1); // 1: NER Folk, 2: Classical Drone, 3: Nature
  
  const audioCtxRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const gainNodeRef = useRef(null);

  const STATIONS = [
    { id: 1, name: 'NER Folk Flute', icon: <Music size={18} />, color: '#1D9B5F', freqs: [261.63, 293.66, 329.63, 392.00, 440.00] }, // C, D, E, G, A
    { id: 2, name: 'Classical Raag', icon: <RadioIcon size={18} />, color: '#C9930B', freqs: [130.81, 138.59, 164.81, 196.00, 220.00, 246.94] }, // Lower drone scale
    { id: 3, name: 'Nature Rain', icon: <Wind size={18} />, color: '#2980B9', isNoise: true }
  ];

  const startTherapy = (stationId) => {
    if (isPlaying) stopTherapy();
    
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    
    // Master volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 4); // Fade in
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    const currentStation = STATIONS.find(s => s.id === stationId);

    if (currentStation.isNoise) {
      // Generate Rain (Pink Noise approximation using brownian noise logic)
      const bufferSize = 2 * ctx.sampleRate; // 2 seconds
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for low volume
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      
      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start(0);
      oscillatorsRef.current.push(noiseNode);
    } else {
      // Create soft drone
      const drone = ctx.createOscillator();
      drone.type = stationId === 1 ? 'sine' : 'triangle';
      drone.frequency.value = currentStation.freqs[0]; 
      
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.4;
      drone.connect(droneGain);
      droneGain.connect(masterGain);
      drone.start();
      oscillatorsRef.current.push(drone);

      // Create algorithmic melody
      let time = ctx.currentTime + 1;
      for (let i = 0; i < 40; i++) { 
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        noteOsc.type = stationId === 1 ? 'triangle' : 'sine';
        
        // Random note from station scale
        const f = currentStation.freqs[Math.floor(Math.random() * currentStation.freqs.length)];
        noteOsc.frequency.value = f;
        
        // Envelopes for smooth attacks
        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.15, time + (stationId === 1 ? 0.5 : 1.5));
        noteGain.gain.linearRampToValueAtTime(0, time + (stationId === 1 ? 2 : 4));
        
        noteOsc.connect(noteGain);
        noteGain.connect(masterGain);
        
        noteOsc.start(time);
        noteOsc.stop(time + 4.5);
        
        oscillatorsRef.current.push(noteOsc);
        time += Math.random() * (stationId === 1 ? 1.5 : 3) + 1; // Random gap
      }
    }
    
    setStation(stationId);
    setIsPlaying(true);
  };

  const stopTherapy = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      // Fade out
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      setTimeout(() => {
        oscillatorsRef.current.forEach(osc => {
          try { osc.stop(); } catch (e) { /* ignore already stopped */ }
        });
        oscillatorsRef.current = [];
        setIsPlaying(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (isPlaying) stopTherapy();
    };
  }, [isPlaying]);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/patient')} className="btn btn-outline" style={{ minWidth: 48, padding: 12 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>📻 Smriti Radio</h2>
          <p>Nostalgic algorithmic music therapy for calming and sundowning relief.</p>
        </div>
      </div>
      
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '65vh' }}>
        <div style={{ 
          background: '#2C1810', 
          border: '8px solid #5A3B22',
          padding: '40px 30px', 
          borderRadius: 32, 
          textAlign: 'center',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.5)',
          position: 'relative',
        }}>
          
          {/* Radio Speaker Grill Effect */}
          <div style={{
            background: '#1A0F0A',
            borderRadius: 16,
            height: 120,
            marginBottom: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.8)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Visualizer animation when playing */}
            <div style={{
              display: 'flex',
              gap: 8,
              height: 60,
              alignItems: 'center'
            }}>
              {[...Array(9)].map((_, i) => (
                <div key={i} style={{
                  width: 12,
                  height: isPlaying ? 20 + Math.random() * 40 : 10,
                  background: isPlaying ? STATIONS.find(s=>s.id===station).color : '#333',
                  borderRadius: 6,
                  transition: 'height 0.2s ease',
                  boxShadow: isPlaying ? `0 0 10px ${STATIONS.find(s=>s.id===station).color}` : 'none'
                }} />
              ))}
            </div>
          </div>

          {/* Station Tuning Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 30 }}>
            {STATIONS.map(s => (
              <button
                key={s.id}
                onClick={() => startTherapy(s.id)}
                style={{
                  background: station === s.id && isPlaying ? s.color : '#4A2F1D',
                  border: '2px solid',
                  borderColor: station === s.id && isPlaying ? '#FFF' : '#3A2012',
                  padding: '12px 16px',
                  borderRadius: 12,
                  color: '#FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  flex: 1,
                  boxShadow: station === s.id && isPlaying ? `0 0 15px ${s.color}` : '0 4px 6px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {s.icon}
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.name}</span>
              </button>
            ))}
          </div>

          {/* Play/Stop Button */}
          <button 
            onClick={isPlaying ? stopTherapy : () => startTherapy(station)}
            style={{ 
              background: isPlaying ? '#E53935' : '#43A047',
              color: 'white',
              border: '4px solid #FFF',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              margin: '0 auto',
              transition: 'transform 0.1s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Square size={32} fill="white" /> : <Play size={36} fill="white" style={{ marginLeft: 6 }} />}
          </button>
          
          <div style={{ marginTop: 16, color: '#A08070', fontSize: '0.85rem', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            {isPlaying ? 'Playing...' : 'Power Off'}
          </div>
        </div>
      </div>
    </>
  );
}
