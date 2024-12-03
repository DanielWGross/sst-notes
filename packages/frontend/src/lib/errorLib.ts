export function onError(error: unknown) {
  let message = String(error);

  if (error instanceof Error) {
    message = error.message;
  }

  alert(message);
}
