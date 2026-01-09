export type CreateLinkResponse =
  | { success: true; redirectUrl: string }
  | { success: false; message: string };
