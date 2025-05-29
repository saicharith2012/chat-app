import { useEffect, useRef, useState } from "react";
import "./App.css";
import SendIcon from "./components/icons/SendIcon";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    const ws = new WebSocket(import.meta.env.VITE_APP_WEBSOCKET_SERVER_URL);

    // can't send until the websocket connection is open.
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "123",
          },
        })
      );
    };

    ws.onmessage = (e) => {
      setMessages((m) => [...m, e.data]);
    };

    wsRef.current = ws;

    // cleanup
    return () => {
      ws.close();
    };
  }, []);
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="h-[95vh] bg-dun-300 py-10 px-4">
        {messages.map((message) => (
          <div className="bg-white px-4 py-2 text-black rounded-full w-fit shadow m-2">
            {message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-4 focus:outline-none"
          placeholder="Enter your message here..."
          ref={inputRef}
        ></input>
        <button
          onClick={() => {
            wsRef.current?.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  message: inputRef.current?.value,
                },
              })
            );
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          className="bg-ultra-violet-500 text-white px-10 py-4 cursor-pointer hover:bg-ultra-violet-600 focus:bg-english-violet-600 transition-all duration-300"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default App;
