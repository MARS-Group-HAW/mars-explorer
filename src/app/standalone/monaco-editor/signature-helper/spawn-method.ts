import registerSignatureHelper from "./register-signature-helper";

export default registerSignatureHelper({
  signatureHelpTriggerCharacters: ["spawn"],
  provideSignatureHelp(model, position, context, token) {
    console.log(model, position, context, token);
    return {
      value: {
        activeParameter: 0,
        activeSignature: 0,
        signatures: [
          {
            label: "string substr(string $string, int $start [, int $length])",
            parameters: [
              {
                label: "string $string",
                documentation:
                  "The input string. Must be one character or longer.",
              },
              {
                label: "int $start",
                documentation:
                  "If $start is non-negative, the returned string will start at the $start'th position in string, counting from zero. For instance, in the string 'abcdef', the character at position 0 is 'a', the character at position 2 is 'c', and so forth.\r\nIf $start is negative, the returned string will start at the $start'th character from the end of string. If $string is less than $start characters long, FALSE will be returned.",
              },
              {
                label: "int $length",
                documentation:
                  "If $length is given and is positive, the string returned will contain at most $length characters beginning from $start (depending on the length of $string) If $length is given and is negative, then that many characters will be omitted from the end of $string (after the start position has been calculated when a start is negative). If $start denotes the position of this truncation or beyond, FALSE will be returned. If $length is given and is 0, FALSE or NULL, an empty string will be returned. If $length is omitted, the substring starting from $start until the end of the string will be returned.",
              },
            ],
          },
        ],
      },
      dispose: () => {},
    };
  },
});
