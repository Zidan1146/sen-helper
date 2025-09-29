export function filterEntries(arr: string[], filters: string[], include: boolean = true): string[] {
    const filterSet = new Set(filters);

    let result = arr.filter(item => {
        return include ? filterSet.has(item) : !filterSet.has(item);
    });

    result = result.sort((a, b) => a.localeCompare(b));

    return result;
}
