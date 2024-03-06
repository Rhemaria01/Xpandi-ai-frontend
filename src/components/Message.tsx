import { cn } from "../lib/utils";
import { message } from "../context/messageContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Message = ({ message }: { message: message }) => {
  return (
    <div className="flex gap-x-4 items-start py-4 text-white">
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/7.x/${
            message.isUserMessage
              ? "personas/svg?seed=Bella"
              : "bottts/svg?seed=Cookie"
          }`}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          " transition-all prose whitespace-pre-wrap text-lg flex flex-col pt-2"
        )}>
        <span className="text-xl font-medium pb-2">
          {message.isUserMessage ? "User" : "Xpandi"}
        </span>
        <span>{message.text}</span>
      </div>
    </div>
  );
};

export default Message;
