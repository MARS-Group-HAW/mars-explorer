class NotImplemented extends Error {
  constructor(message = "") {
    super(message);
    this.name = "Not implemented";
    this.message = `${message} has not been implemented yet`;
  }
}

export default NotImplemented;
