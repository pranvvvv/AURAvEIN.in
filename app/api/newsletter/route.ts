import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface NewsletterSubscriber {
  email: string
  subscribedAt: string
  id: string
}

const NEWSLETTER_FILE = path.join(process.cwd(), 'data', 'newsletter-subscribers.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read existing subscribers
function readSubscribers(): NewsletterSubscriber[] {
  ensureDataDirectory()
  
  if (!fs.existsSync(NEWSLETTER_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(NEWSLETTER_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading newsletter file:', error)
    return []
  }
}

// Write subscribers to file
function writeSubscribers(subscribers: NewsletterSubscriber[]) {
  ensureDataDirectory()
  
  try {
    fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify(subscribers, null, 2))
  } catch (error) {
    console.error('Error writing newsletter file:', error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const subscribers = readSubscribers()
    
    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase())
    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Email already subscribed', existing: true },
        { status: 200 }
      )
    }

    // Add new subscriber
    const newSubscriber: NewsletterSubscriber = {
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    }

    subscribers.push(newSubscriber)
    writeSubscribers(subscribers)

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter',
        subscriber: newSubscriber
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const subscribers = readSubscribers()
    
    return NextResponse.json({
      total: subscribers.length,
      subscribers: subscribers.map(sub => ({
        email: sub.email,
        subscribedAt: sub.subscribedAt,
        id: sub.id
      }))
    })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}