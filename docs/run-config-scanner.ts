import { ConfigScanner } from '@nestjs-library/config';

/**
 * @description script to use the ConfigScanner class to scan the source code of a project.
 * @example
 * ```sh
 * $ npx ts-node run-config-scanner.ts repo/app1/src,repo/app2/src docs/
 * ```
 */
async function run() {
    const args = process.argv.slice(2);
    if (args.length === 0) return;
    const sourceRoots = args[0].split(',');
    const outputDirectory = args[1] || '';

    for await (const sourceRoot of sourceRoots) {
        const configScanner = new ConfigScanner({ sourceRoot, outputDirectory, filename: 'env.json' });
        await configScanner.execute();
    }
}

run()
    .then(() => {
        console.log('\u001B[35m', 'Done');
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
