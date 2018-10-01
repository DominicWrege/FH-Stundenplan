export const fetcher = async (url: string) => {
    try {
        const promise = await fetch(url);
        return await promise.json();
    } catch (err) {
        console.log(`Could not load data from ${url}`);
    }
}
