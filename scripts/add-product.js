(async ()=>{
  try{
    // Login as admin
    const login = await fetch('http://localhost:3000/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@auravein.com', password: 'admin123' })
    })
    if (!login.ok) {
      console.error('Login failed', await login.text())
      return
    }
    const sc = login.headers.get('set-cookie')
    const cookie = sc ? sc.split(';')[0] : ''

    const timestamp = Date.now()
    const productPayload = {
      name: `Admin Added Product ${timestamp}`,
      price: 1299,
      originalPrice: 1599,
      discount: 19,
      category: 'test-products',
      description: 'Automatically added test product',
      images: ['/placeholder.svg'],
      sizes: ['S','M','L'],
      colors: ['black'],
      stock: 100,
      isFeatured: false,
      isActive: true,
      quantity: 100
    }

    const post = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify(productPayload)
    })
    console.log('POST STATUS', post.status)
    console.log(await post.text())

    // Fetch product list to confirm
    const list = await fetch('http://localhost:3000/api/products')
    console.log('PRODUCTS STATUS', list.status)
    const listText = await list.text()
    // Print last 5 items for brevity
    try{
      const arr = JSON.parse(listText)
      const tail = arr.slice(-5)
      console.log('LAST ITEMS', JSON.stringify(tail, null, 2))
    }catch(e){
      console.log('PRODUCTS RAW', listText)
    }
  }catch(e){console.error('ERR', e)}
})()
