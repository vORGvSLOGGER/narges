import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const CUSTOMER_REPLIES = [
  'شكراً، في انتظارك',
  'كم الوقت المتوقع؟',
  'من فضلك تصل بسرعة',
  'أنا في البيت',
  'اتصل بي عند الوصول',
];

export default function ChatWidget({ customerName = 'العميل' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'customer', text: 'متى تصل؟', time: new Date(Date.now() - 120000) },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg = { id: Date.now(), from: 'driver', text, time: new Date() };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setTimeout(() => {
      const reply = CUSTOMER_REPLIES[Math.floor(Math.random() * CUSTOMER_REPLIES.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'customer', text: reply, time: new Date() }]);
    }, 1200 + Math.random() * 1500);
  };

  const formatTime = (d) => d.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-4 z-50 w-14 h-14 bg-narjis-green rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
      >
        <MessageCircle size={24} className="text-white" />
        {messages.filter(m => m.from === 'customer').length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {messages.filter(m => m.from === 'customer').length}
          </span>
        )}
      </button>

      {/* Chat Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-t-3xl max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-narjis-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {customerName[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{customerName}</p>
                  <p className="text-xs text-green-500">متصل الآن</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-narjis-bg flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'driver' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    msg.from === 'driver'
                      ? 'bg-narjis-bg text-narjis-text rounded-tr-sm'
                      : 'bg-narjis-green text-white rounded-tl-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-0.5 ${msg.from === 'driver' ? 'text-narjis-text-secondary' : 'text-white/60'}`}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {['في الطريق', 'وصلت للمتجر', 'سأصل خلال 5 دقائق'].map(r => (
                  <button
                    key={r}
                    onClick={() => setInput(r)}
                    className="flex-shrink-0 text-xs bg-narjis-bg text-narjis-text px-3 py-1.5 rounded-full border border-gray-100"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 pb-6 pt-2 border-t">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب رسالة..."
                className="flex-1 bg-narjis-bg rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-narjis-green rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              >
                <Send size={18} className="text-white" style={{ transform: 'scaleX(-1)' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
