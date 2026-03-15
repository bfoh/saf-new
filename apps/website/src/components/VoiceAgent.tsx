import { useState, useRef, useEffect } from 'react';
import { useVapi, type CallStatus } from '../hooks/useVapi';

/* ─── Waveform bars (animated when assistant is speaking) ─────────────────── */
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-6">
      {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#0F6B3E]"
          style={{
            height: active ? `${h * 24}px` : '6px',
            transition: 'height 0.15s ease',
            animationDelay: `${i * 60}ms`,
            ...(active ? {
              animation: 'vapi-wave 0.7s ease-in-out infinite alternate',
              animationDelay: `${i * 70}ms`,
            } : {}),
          }}
        />
      ))}
      <style>{`
        @keyframes vapi-wave {
          0%   { transform: scaleY(0.4); }
          100% { transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Status pill ─────────────────────────────────────────────────────────── */
function StatusPill({ status, isSpeaking }: { status: CallStatus; isSpeaking: boolean }) {
  const map: Record<CallStatus, { label: string; color: string; dot: string }> = {
    idle:       { label: 'Ask me anything',   color: 'text-gray-500',    dot: 'bg-gray-300' },
    connecting: { label: 'Connecting…',       color: 'text-amber-600',   dot: 'bg-amber-400 animate-pulse' },
    active:     { label: isSpeaking ? 'Speaking…' : 'Listening…', color: 'text-[#0F6B3E]', dot: isSpeaking ? 'bg-[#0F6B3E] animate-pulse' : 'bg-emerald-400' },
    ending:     { label: 'Ending call…',      color: 'text-gray-400',    dot: 'bg-gray-300' },
  };
  const { label, color, dot } = map[status];
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function VoiceAgent() {
  const { callStatus, isMuted, isSpeaking, messages, startCall, endCall, toggleMute, sendTextMessage } = useVapi();
  const [open,  setOpen]  = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef    = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendTextMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isCallActive = callStatus === 'active' || callStatus === 'connecting';

  return (
    <>
      {/* ── Floating trigger button (bottom-left) ───────────────────────── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open SAF AI Assistant"
          className="fixed bottom-6 left-5 sm:bottom-8 sm:left-7 z-50 group flex items-center gap-3 bg-[#0F6B3E] text-white pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl shadow-[#0F6B3E]/40 hover:bg-[#0a5530] hover:scale-105 active:scale-100 transition-all duration-200"
        >
          {/* Pulse ring */}
          <span className="relative flex h-8 w-8 items-center justify-center flex-shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping" />
            {/* Bold mic icon */}
            <svg className="relative w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 7a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z"/>
            </svg>
          </span>
          <div className="text-left leading-tight">
            <div className="text-sm font-bold tracking-wide whitespace-nowrap">AI Assistant</div>
            <div className="text-[11px] text-white/75 whitespace-nowrap">Ask • Voice • Book</div>
          </div>
        </button>
      )}

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-5 left-4 sm:bottom-8 sm:left-7 z-50 w-[340px] sm:w-[380px] max-h-[600px] flex flex-col rounded-3xl shadow-2xl shadow-[#0F6B3E]/20 overflow-hidden border border-[#0F6B3E]/15 bg-white">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F6B3E] to-[#4CAF50] px-5 py-4 flex items-center gap-3 flex-shrink-0">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 7a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm leading-tight">SAF AI Assistant</div>
              <StatusPill status={callStatus} isSpeaking={isSpeaking} />
            </div>
            <button
              onClick={() => { if (isCallActive) endCall(); setOpen(false); }}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Waveform bar (visible only during active call) */}
          {callStatus === 'active' && (
            <div className="bg-[#F6F9F3] border-b border-[#0F6B3E]/10 px-5 py-3 flex items-center justify-between">
              <Waveform active={isSpeaking} />
              <div className="flex items-center gap-2">
                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isMuted
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-[#0F6B3E]/10 text-[#0F6B3E] hover:bg-[#0F6B3E]/20'
                  }`}
                >
                  {isMuted ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 7a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z"/></svg>
                  )}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                {/* End call */}
                <button
                  onClick={endCall}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                  End Call
                </button>
              </div>
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F9FBF8]" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#0F6B3E] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm7 10a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z"/></svg>
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#0F6B3E] text-white rounded-br-sm'
                      : 'bg-white text-[#1E1E1E] border border-[#E5EDE0] rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom controls */}
          <div className="border-t border-[#E5EDE0] bg-white px-3 py-3 flex-shrink-0">
            {/* Voice call button (when not in call) */}
            {callStatus === 'idle' && (
              <button
                onClick={startCall}
                className="w-full flex items-center justify-center gap-2.5 bg-[#0F6B3E] hover:bg-[#0a5530] text-white font-semibold text-sm py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mb-2.5 shadow-md shadow-[#0F6B3E]/25"
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 animate-ping" />
                  <svg className="relative w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm7 7a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z"/></svg>
                </span>
                Start Voice Call
              </button>
            )}
            {callStatus === 'connecting' && (
              <div className="w-full flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-semibold text-sm py-2.5 rounded-xl mb-2.5">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity={0.25}/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                Connecting…
              </div>
            )}

            {/* Text input — always visible */}
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isCallActive ? 'Type a message or speak…' : 'Type your question…'}
                className="flex-1 px-3.5 py-2.5 text-sm border border-[#E5EDE0] rounded-xl bg-[#F9FBF8] focus:outline-none focus:ring-2 focus:ring-[#0F6B3E]/25 focus:border-[#0F6B3E] transition-all placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0F6B3E] hover:bg-[#0a5530] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">Powered by SAF Institute AI · Speak or type</p>
          </div>
        </div>
      )}
    </>
  );
}
