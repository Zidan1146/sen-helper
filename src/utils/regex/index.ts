export function combineRegex(...regexes: RegExp[]): RegExp {
    const pattern = regexes.map(r => r.source).join("|");
    return new RegExp(pattern, 'i'); // Ensure case insensitivity
}