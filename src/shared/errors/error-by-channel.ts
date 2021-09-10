type ErrorByChannel<Channel extends string, ErrorCode extends number> = {
  [channel in Channel]: {
    [error in ErrorCode]: string;
  };
};

export default ErrorByChannel;
