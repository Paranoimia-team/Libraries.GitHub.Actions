import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildProject = path.resolve(__dirname, "build-project.ts");
const tsconfig = path.resolve(__dirname, "tsconfig.json");
const command = `pnpm -r --workspace-concurrency=1 -filter !@github/utilities exec tsx ${buildProject} --tsconfig ${tsconfig}`;

try 
{
    execSync(command, { stdio: 'inherit' });
} 
catch (error) 
{
    console.error('Error occurred:', error);
    process.exit(1);
}

export {}
