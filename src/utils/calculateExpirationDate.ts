export function calculateExpirationDate(expirationTime: string): string {
  const now = new Date();
  let expirationDate: Date;

  switch (expirationTime) {
    case "one-time":
      return "one-time";
    case "1 minute": // Added option for testing (expires in 1 minute)
      expirationDate = new Date(now.getTime() + 60 * 1000);
      break;
    case "1day":
      expirationDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
      break;
    case "3days":
      expirationDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      break;
    case "7days":
      expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      throw new Error("Invalid expiration time");
  }

  return expirationDate.toISOString();
}
