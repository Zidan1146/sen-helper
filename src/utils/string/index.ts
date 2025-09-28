export function filterEntries(arr: string[], filters: string[], sort: boolean = false): string[] {
    const filterSet = new Set(filters);

    let result = arr.filter(item => !filterSet.has(item));

    if (sort) {
        result = result.sort((a, b) => a.localeCompare(b));
    }

    return result;
}
