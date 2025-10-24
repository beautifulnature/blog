// Listen for Ctrl+K / Cmd+K shortcut
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const input = document.getElementById('search-input')
    if (input) {
      input.focus()
      input.select()
    } else {
      window.location.href = '/search/'
    }
  }
})

fetch('/index.json')
  .then(response => response.json())
  .then(pages => {
    const index = lunr(function() {
      this.ref('url')
      this.field('title', { boost: 10 })
      this.field('content')
      pages.forEach(doc => this.add(doc))
    })

    document.getElementById('search-input').addEventListener('input', e => {
      const results = index.search(e.target.value)
      const resultList = document.getElementById('search-results')
      resultList.innerHTML = results.map(r => {
        const page = pages.find(p => p.url === r.ref)
        return `<li><a href="${page.url}">${page.title}</a></li>`
      }).join('')
    })
  })