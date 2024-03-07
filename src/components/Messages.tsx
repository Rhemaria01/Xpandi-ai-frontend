import React, { useRef, useEffect } from "react";
import { useContext } from "react";
import { MessageContext } from "../context/messageContext";
import Message from "./Message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import MaxWidthWrapper from "./MaxWidthWrapper";
import StartingCards from "./StartingCards";

const Messages = () => {
  const { output, messages, generating } = useContext(MessageContext);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (lastItemRef) {
      lastItemRef.current?.scrollIntoView();
    }
  }, [output, messages]);

  return (
    <>
      {messages.length <= 0 ? (
        <StartingCards />
      ) : (
        <div className="overflow-y-auto  scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch pt-12 pb-8 px-4">
          <MaxWidthWrapper>
            {messages.map((message) => {
              return <Message key={message.id} message={message} />;
            })}
            {generating || output ? (
              <div className="flex gap-x-4 items-start py-4 text-white">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=Cookie" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="transition-all prose whitespace-pre-wrap text-lg flex flex-col pt-2">
                  <span className="text-xl font-medium pb-2 text-white">
                    Xpandi
                  </span>
                  <span>
                    {generating ? (
                      <span className="animate-ping text-white">|</span>
                    ) : (
                      <>
                        {output}
                        <span className="animate-ping text-white">|</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            ) : null}
            <div ref={lastItemRef} className="h-28"></div>
          </MaxWidthWrapper>
        </div>
      )}
    </>
  );
};

export default Messages;
