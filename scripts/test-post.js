(async ()=>{
  try {
    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'admin_session=1'
      },
      body: JSON.stringify({ name: 'Test Product from API', price: 999, category: 'test', description: 'added via test', images: ['/placeholder.svg'], isFeatured: true })
    })
    console.log('STATUS', res.status)
    const txt = await res.text()
    console.log(txt)
  } catch (e) {
    console.error('ERR', e)
  }
})()
