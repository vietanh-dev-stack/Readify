const slugify = (text = '') => {
  return text
    .toString()
    .normalize('NFD') // tách dấu ra khỏi chữ
    .replace(/[\u0300-\u036f]/g, '') // xoá dấu
    .toLowerCase()
    .trim()
    .replace(/đ/g, 'd') // riêng chữ đ
    .replace(/[^a-z0-9\s-]/g, '') 
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default slugify