export type TokenType = 'text' | 'progress' | 'link' | 'error' | 'success';

export interface Token {
  type: TokenType;
  content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

// Regex Patterns
const PROGRESS_REGEX = /\ \[([=->\s]+)\]\s*(\d+)%/;
// const URL_REGEX = /(https?:\/\/[^\s]+)/g;
// const FILE_PATH_REGEX = /((?:[a-zA-Z]:\\|\/)[a-zA-Z0-9_\\-\\/.]+\.[a-zA-Z0-9]+)/g;
const ERROR_REGEX = /(?:error|fail|exception|fatal):/i;
const SUCCESS_REGEX = /(?:success|done|completed)[s!.]/i;

export const parseOutput = (text: string): Token[] => {
  const tokens: Token[] = [];
  const lines = text.split('\n');

  lines.forEach((line) => {
    // 1. Check for Progress Bar
    const progressMatch = line.match(PROGRESS_REGEX);
    if (progressMatch) {
      tokens.push({
        type: 'progress',
        content: line,
        metadata: { percent: parseInt(progressMatch[2], 10) }
      });
      return;
    }

    // 2. Check for Error
    if (ERROR_REGEX.test(line)) {
      tokens.push({ type: 'error', content: line });
      return;
    }

    // 3. Check for Success
    if (SUCCESS_REGEX.test(line)) {
      tokens.push({ type: 'success', content: line });
      return;
    }

    // 4. Default Text (with potential links inside)
    tokens.push({ type: 'text', content: line });
  });

  return tokens;
};