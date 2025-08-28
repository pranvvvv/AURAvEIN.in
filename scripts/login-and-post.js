(async ()=>{
  try{
    const login = await fetch('http://localhost:3000/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@auravein.com', password: 'admin123' })
    })
    console.log('LOGIN STATUS', login.status)
    const sc = login.headers.get('set-cookie')
    console.log('SET-COOKIE', sc)
    const cookie = sc ? sc.split(';')[0] : ''
    const product = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
      body: JSON.stringify({ name: 'Product via server-login', price: 199, category: 'test', images: ['/placeholder.svg'], isFeatured: false })
    })
    console.log('PRODUCT STATUS', product.status)
    console.log(await product.text())
  }catch(e){console.error(e)}
})()
