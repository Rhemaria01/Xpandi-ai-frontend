import React from "react";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import MaxWidthWrapper from "./MaxWidthWrapper";

const ChatPage = () => {
  return (
    <div className="bg-zinc-800 relative py-2">
      <div className="fixed top-0  w-full  z-20 ">
        <div className="text-3xl text-white ps-6 bg-primary text-center rounded-md py-2 mx-auto shadow-md shadow-primary">
          Xpandi's AI
        </div>
      </div>
      <Messages />
      <div className="fixed bottom-0 w-full bg-zinc-800 h-28">
        <MaxWidthWrapper>
          <ChatInput />
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default ChatPage;
