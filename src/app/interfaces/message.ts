import { MessageType } from "../enums/message-type";

export interface Message{
  type : MessageType;
  info: string;
}
