import minimatch from 'minimatch'

export function matchMines(contentType: string, mines: string[]) {
  let result = false;
  for (const mine of mines) {
    result = minimatch(contentType, mine)
    if (result) break;
  }
  return result;
}
