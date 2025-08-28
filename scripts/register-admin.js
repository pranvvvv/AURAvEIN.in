(async ()=>{
  try{
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin Test', email: 'admin@auravein.com', password: 'admin123', role: 'admin' })
    })
    console.log('STATUS', res.status)
    console.log(await res.text())
  }catch(e){console.error(e)}
})()
