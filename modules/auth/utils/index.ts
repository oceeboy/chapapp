const customMessages = {
  string: {
    min: (min: number) => `Must be at least ${min} characters long.`,
    max: (max: number) => `Must be at most ${max} characters long.`,
    email: "Invalid email format.",
    regex: "Invalid format.",
    otp: "Enter the 6 digit",
  },
  date: "Date must be a valid ISO string in the format YYYY-MM-DDTHH:mm:ss.sssZ.",
};

export { customMessages };
