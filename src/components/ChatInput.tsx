import React from "react";
import { Textarea } from "./ui/textarea";
import { useContext } from "react";
import { MessageContext } from "../context/messageContext";
import { toast } from "sonner";

const ChatInput = () => {
  const { query, handleQueryChange, sendMessage } = useContext(MessageContext);
  return (
    <Textarea
      rows={1}
      maxRows={4}
      value={query}
      onChange={handleQueryChange}
      placeholder="Enter Your Message"
      autoFocus={true}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (!query) {
            toast("Please Enter a message..");
          } else {
            sendMessage();
          }
        }
      }}
      className="resize-none pr-12 text-base py-3"
    />
  );
};

export default ChatInput;
