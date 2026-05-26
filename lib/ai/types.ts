export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export type AiCompletionOptions = {
  messages: AiMessage[];
  maxTokens?: number;
  temperature?: number;
};

export interface AiProvider {
  readonly name: string;
  readonly isMock: boolean;
  complete(options: AiCompletionOptions): Promise<string>;
}
