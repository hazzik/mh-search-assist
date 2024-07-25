export function slug(name) {
  return name.toLowerCase().replace(/\W+/gu, "-").replace(/-web-site$/, "");
}
