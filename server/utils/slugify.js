const slugify = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')        // spaces -> hyphen
    .replace(/-+/g, '-')         // multiple hyphens -> one
    .replace(/^-+|-+$/g, '') // remove - at start & end
}

export default slugify
