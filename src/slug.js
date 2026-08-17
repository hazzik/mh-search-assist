export function slug(name) {
    return name.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/-web-site$/, '');
}
