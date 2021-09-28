type ParseMessage = {
  name: string;
};

export type ParseCompleteNotification = ParseMessage & {
  aborted: boolean;
};

export type ParseResultMessage = ParseMessage & {
  data: unknown[];
};
