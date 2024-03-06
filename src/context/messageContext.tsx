import { apiUrl } from "../lib/constants";
import cuid from "cuid";
import { ReactNode, createContext, useState } from "react";
import { toast } from "sonner";
export type message = {
  id: string;
  isUserMessage: boolean;
  text: string;
};
type MessageContextType = {
  query: string;
  handleQueryChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  output: string;
  sendMessage: () => void;
  messages: message[];
  generating: boolean;
  handleCardClick: (query: string) => void;
  aiTyping: boolean;
};

export const MessageContext = createContext<MessageContextType>({
  query: "",
  handleQueryChange: () => {},
  output: "",
  sendMessage: () => {},
  messages: [],
  generating: false,
  handleCardClick: () => {},
  aiTyping: false,
});

async function* streamGenerator(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;

    const chunkvalue = decoder.decode(value);

    for (let i = 0; i < chunkvalue.length; i++) {
      yield chunkvalue[i];
    }

    if (done) {
      yield null; // Signal the end of the stream
    }
  }
}

export const MessageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [query, setQuery] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const [output, setOutput] = useState<string>("");
  const aiTyping = output.length > 0;
  const [messages, setMessages] = useState<message[]>([]);

  const addMessage = async (query: string) => {
    setGenerating(true);
    setMessages((prev) => [
      ...prev,
      { id: cuid(), isUserMessage: true, text: query },
    ]);

    const formattedPrevMessages = messages.slice(-6).map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

    let prompt = `
    PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
          if (message.role === "user") return `User: ${message.content}\n`;
          return `Assistant: ${message.content}\n`;
        })}
    \n----------------\n
        USER INPUT: ${query}
        
      \n----------------\n
    `;
    setQuery("");
    const response = await fetch(apiUrl + "stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: prompt }),
    });
    if (!response.ok) {
      setGenerating(false);
      toast("Failed to send message");
      return;
    }
    if (!response.body) {
      setGenerating(false);
      toast("Failed to send message");
      return;
    }
    setGenerating(false);
    const messageGenerator = streamGenerator(response.body);
    let char = await messageGenerator.next();
    let accRes = "";
    while (!char.done) {
      const { value } = char;
      if (value !== null) {
        setOutput((prev) => prev + value);
        accRes += value;
      }
      char = await messageGenerator.next();
      await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust delay as needed
    }
    setQuery("");
    setOutput("");

    setMessages((prev) => [
      ...prev,
      { id: cuid(), isUserMessage: false, text: accRes },
    ]);
  };

  const sendMessage = () => addMessage(query);
  const handleCardClick = (cardQuery: string) => {
    addMessage(cardQuery);
  };
  return (
    <MessageContext.Provider
      value={{
        query,
        handleQueryChange,
        output,
        sendMessage,
        messages,
        generating,
        handleCardClick,
        aiTyping,
      }}>
      {children}
    </MessageContext.Provider>
  );
};
