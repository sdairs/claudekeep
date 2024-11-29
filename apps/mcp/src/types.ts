export interface Message {
    text: string;
    fromUser: boolean;
}

export interface Chat {
    id?: string;
    chat: Message[];
    created_at?: Date;
    owner: string;
    public: boolean;
    chat_session_id?: string;
}