type Setting = {
  rootNode: string;
  hostname: string;
  configs: Array<{
    node: string;
    type: string;
    value: string;
  }>;
};

export { Setting };
