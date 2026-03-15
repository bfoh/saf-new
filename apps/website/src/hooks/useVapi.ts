import { useEffect, useRef, useCallback, useState } from 'react';
import Vapi from '@vapi-ai/web';

const VAPI_KEY       = (import.meta as any).env?.VITE_VAPI_API_KEY     ?? '';
const ASSISTANT_ID   = (import.meta as any).env?.VITE_VAPI_ASSISTANT_ID ?? '';
const API_URL        = ((import.meta as any).env?.VITE_API_URL ?? 'http://localhost:3001') + '/api';

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ending';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  ts: number;
}

export interface UseVapiReturn {
  callStatus: CallStatus;
  isMuted: boolean;
  isSpeaking: boolean;
  messages: ChatMessage[];
  startCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  sendTextMessage: (content: string) => Promise<void>;
}

export function useVapi(): UseVapiReturn {
  const vapiRef      = useRef<Vapi | null>(null);
  const textSession  = useRef<string | null>(null);

  const [callStatus, setCallStatus]   = useState<CallStatus>('idle');
  const [isMuted,    setIsMuted]      = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [messages,   setMessages]     = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm SAF Institute's AI assistant. Ask me anything about our German courses, visa support, or tap the mic to speak with me directly!",
      ts: Date.now(),
    },
  ]);

  // ── Initialise Vapi once ─────────────────────────────────────────────────
  useEffect(() => {
    if (!VAPI_KEY) return;
    const vapi = new Vapi(VAPI_KEY);
    vapiRef.current = vapi;

    vapi.on('call-start',   () => setCallStatus('active'));
    vapi.on('call-end',     () => { setCallStatus('idle'); setIsSpeaking(false); setIsMuted(false); });
    vapi.on('speech-start', () => setIsSpeaking(true));
    vapi.on('speech-end',   () => setIsSpeaking(false));
    vapi.on('error',        (e: any) => { console.error('[VAPI]', e); setCallStatus('idle'); });

    vapi.on('message', async (msg: any) => {
      // ── Show transcript lines in chat ──────────────────────────────────
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        setMessages(prev => [...prev, {
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.transcript,
          ts: Date.now(),
        }]);
      }

      // ── Handle tool calls (VAPI fires 'tool-calls' or 'function-call') ─
      const isToolCalls    = msg.type === 'tool-calls';
      const isFunctionCall = msg.type === 'function-call';

      if (isToolCalls || isFunctionCall) {
        // Normalise to a list — VAPI uses different field names across SDK versions
        const list: any[] = isToolCalls
          ? (msg.toolCallList ?? msg.toolCalls ?? [])
          : (msg.functionCall ? [{ id: msg.functionCall.id ?? 'fn', function: { name: msg.functionCall.name, arguments: msg.functionCall.parameters ?? msg.functionCall.arguments } }] : []);

        for (const tc of list) {
          const fnName = tc.function?.name ?? tc.name;
          if (fnName !== 'book_appointment') continue;

          let resultContent: string;
          try {
            const rawArgs = tc.function?.arguments ?? tc.parameters ?? tc.arguments ?? '{}';
            const args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;

            await fetch(`${API_URL}/appointments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...args, source: 'voice_agent' }),
            });

            resultContent = JSON.stringify({ success: true, message: 'Appointment booked successfully.' });
          } catch (err) {
            console.error('[VAPI] booking error', err);
            resultContent = JSON.stringify({ success: false, message: 'Booking failed, please try again.' });
          }

          // Return result — VAPI requires 'add-message' with role 'tool'
          try {
            vapi.send({
              type: 'add-message',
              message: {
                role: 'tool',
                tool_call_id: tc.id ?? tc.function?.id ?? 'fn',
                content: resultContent,
              },
            } as any);
          } catch {
            // Fallback: function-call response format (older SDK versions)
            vapi.send({
              type: 'add-message',
              message: {
                role: 'function',
                name: fnName,
                content: resultContent,
              },
            } as any);
          }
        }
      }
    });

    return () => { vapi.stop(); };
  }, []);

  // ── Voice call controls ──────────────────────────────────────────────────
  const startCall = useCallback(() => {
    if (!vapiRef.current || callStatus !== 'idle') return;
    setCallStatus('connecting');
    vapiRef.current.start(ASSISTANT_ID);
  }, [callStatus]);

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;
    setCallStatus('ending');
    vapiRef.current.stop();
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current || callStatus !== 'active') return;
    const next = !isMuted;
    vapiRef.current.setMuted(next);
    setIsMuted(next);
  }, [isMuted, callStatus]);

  // ── Text-only chat (no active voice call) ────────────────────────────────
  const sendTextMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content, ts: Date.now() }]);

    // If a voice call is active, inject text into the ongoing call
    if (callStatus === 'active' && vapiRef.current) {
      vapiRef.current.send({
        type: 'add-message',
        message: { role: 'user', content },
      } as any);
      return;
    }

    // Text-only mode: use VAPI chat REST endpoint
    try {
      const body: Record<string, any> = { assistantId: ASSISTANT_ID, input: content };
      if (textSession.current) body.sessionId = textSession.current;

      const res = await fetch('https://api.vapi.ai/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`VAPI chat ${res.status}`);
      const data = await res.json();

      if (data.sessionId) textSession.current = data.sessionId;

      // Extract assistant reply — VAPI may return messages array or output field
      const reply: string =
        data.output ??
        data.messages?.findLast?.((m: any) => m.role === 'assistant')?.content ??
        data.reply ??
        '';

      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
      }

      // Handle any tool calls returned in text mode
      const toolCalls: any[] = data.toolCalls ?? data.tool_calls ?? [];
      for (const tc of toolCalls) {
        if (tc.function?.name === 'book_appointment') {
          try {
            const args = typeof tc.function.arguments === 'string'
              ? JSON.parse(tc.function.arguments)
              : tc.function.arguments;
            await fetch(`${API_URL}/appointments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...args, source: 'text_agent' }),
            });
          } catch { /* silent */ }
        }
      }
    } catch (err) {
      console.error('[VAPI chat]', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try the voice call or contact us at +233 24 450 6301.",
        ts: Date.now(),
      }]);
    }
  }, [callStatus]);

  return { callStatus, isMuted, isSpeaking, messages, startCall, endCall, toggleMute, sendTextMessage };
}
