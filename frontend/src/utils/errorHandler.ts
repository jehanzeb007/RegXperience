export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const err = error as any;

    // Check for backend error message
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    if (err.response?.data?.error) {
      return err.response.data.error;
    }

    if (err.message) {
      return err.message;
    }
  }

  return "Something went wrong";
}

export function getSuccessMessage(data: unknown): string {
  if (typeof data === "object" && data !== null) {
    const d = data as any;
    if (d.message) {
      return d.message;
    }
  }
  return "Success";
}
