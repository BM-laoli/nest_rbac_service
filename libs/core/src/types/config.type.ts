type Setting = {
  rootNode: string;
  hostname: string;
  configs: Array<{
    node: string;
    type: string;
    value: string;
  }>;
};

type AuthInfo = {
  secret: string;
  expiresIn: string;
};

export { Setting, AuthInfo };
