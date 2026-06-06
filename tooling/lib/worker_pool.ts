export const runWorkerPool = <T>(items: T[], worker: (item: T) => Promise<void>) => {
    let index = 0;
    
    async function next() {
        while (index < items.length) {
            const current = index++;
            const item = items[current];
            if (item) {
                await worker(item);
            }
        }
    }

    const workers = Array.from({ length: 20 }, () => next());
    
    return Promise.all(workers);
}
