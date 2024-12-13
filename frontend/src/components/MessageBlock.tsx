import { FC } from "react";
import avatar from "../assets/sonic.png";
import { useAppSelector } from "../hooks/redux-hoock";

import "../css/message_container.css";
import NewMessage from "./NewMessage";

interface MessageProps {
  children?: React.ReactNode;
  Blockid: string;
  messageBlock: string;
}

const MessageBlock: FC<MessageProps> = ({ messageBlock, Blockid }) => {
  const me = useAppSelector((state) => state.auth.user);
  const NoMe = useAppSelector((state) => state.chats.users);
  const newMesage = useAppSelector((state) => state.chats.newMessage);

  return (
    <>
      <div
        className={
          messageBlock == me.uuid || me.uuid == "" || undefined
            ? "message my-message"
            : "message"
        }
      >
        <div
          className={
            messageBlock == me.uuid || me.uuid == "" || undefined
              ? "chat-message-new"
              : "chat-message-new"
          }
        >
          <div className="avatar-message">
            {messageBlock == me.uuid ? (
              me.avatar == "" ? (
                <img src={"http://localhost:5173/" + avatar} alt="" />
              ) : (
                <img src={"http://localhost:5173/public/" + me.avatar} alt="" />
              )
            ) : NoMe.avatar ? (
              <img src={"http://localhost:5173/" + avatar} alt="" />
            ) : NoMe.avatar == "" ? (
              <img src={"http://localhost:5173/" + avatar} alt="" />
            ) : (
              <img src={"http://localhost:5173/public/" + NoMe.avatar} alt="" />
            )}
            <div className="login-message">
              {messageBlock == me.uuid ? (
                <p className="title">{me.login}</p>
              ) : (
                <p className="title">{NoMe.login}</p>
              )}
              <div className="boreder"></div>
            </div>
          </div>

          {newMesage[Blockid] &&
            newMesage[Blockid].map((message) => (
              <NewMessage
                blockId={Blockid}
                uuid={message.uuid}
                key={message.uuid}
                content={message.content}
                media={message.media}
                classUser={message.from_user_id}
                time={message.timestamp}
                hasRead={message.has_read}
              ></NewMessage>
            ))}
        </div>
      </div>
    </>
  );
};

export default MessageBlock;
