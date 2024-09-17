export interface APIError {
  response: {
    data: {
      error: string;
      message: string;
    };
  };
}

export interface RepoInfo {
  name: string;
  tsv_exists: boolean;
  json_exists: boolean;
  annotated: boolean;
}

// Using this type guard to catch errors of type APIError when sending requests
export function isErrorWithResponse(error: unknown): error is APIError {
  const e = error as APIError;
  return (
    e.response !== undefined &&
    e.response.data !== undefined &&
    typeof e.response.data.error === 'string'
  );
}
