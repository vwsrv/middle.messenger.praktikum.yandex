import { resolve as pathResolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    const relativePath = specifier.slice(2);
    const resolvedPath = pathResolve(__dirname, 'src', relativePath);
    const fileURL = pathToFileURL(resolvedPath).href;
    return next(fileURL, context);
  }
  return next(specifier, context);
}
