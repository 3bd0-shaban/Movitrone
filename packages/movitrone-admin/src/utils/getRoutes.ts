import fs from 'fs';
import path from 'path';

// Base directory for routes (adjust according to your project structure)
const baseDir = path.join(process.cwd(), 'app');

type Route = {
  path?: string;
  children?: Route[];
};

// Function to generate routes based on directory structure
export function getRoutes(dir: string, parentPath: string = ''): Route[] {
  const routes: Route[] = [];

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const subRoutes = getRoutes(filePath, path.join(parentPath, file));
      if (subRoutes.length) {
        routes.push({
          path: path.join(parentPath, file).replace(/\\/g, '/'),
          children: subRoutes,
        });
      }
    } else if (stats.isFile() && file.endsWith('page.tsx')) {
      routes.push({
        path: path
          .join(parentPath, file.replace('.tsx', ''))
          .replace(/\\/g, '/'),
      });
    }
  });

  return routes;
}

function cleanPath(p: string): string {
  return p
    .replace(/\([^)]*\)/g, '') // Remove folders with parentheses
    .replace(/\[(.*?)\]/g, '~') // Replace folders with square brackets with '~'
    .replace(/\/{2,}/g, '/') // Remove any double slashes
    .replace(/\/$/, '') // Remove trailing slash
    .replace(/^\//, '') // Remove leading slash
    .replace(/\//g, ':'); // Replace slashes with colons
}

// Function to format and clean routes for output
export function formatRoutes(routes: Route[]): string[] {
  let formattedRoutes: string[] = [];

  routes.forEach((route) => {
    // Clean the current path
    const cleanedPath = cleanPath(route.path || '');

    if (cleanedPath.endsWith('page')) {
      const finalPath = cleanedPath.replace(/:?page$/, '');
      if (finalPath) {
        formattedRoutes.push(finalPath);
      }
    }

    if (route.children) {
      formattedRoutes = formattedRoutes.concat(formatRoutes(route.children));
    }
  });

  return formattedRoutes;
}
