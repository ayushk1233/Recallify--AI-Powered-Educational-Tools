import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Recallify - AI-Powered Learning Tools'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
          }}
        >
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            R
          </span>
        </div>
        
        {/* Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 20px 0',
            textAlign: 'center',
          }}
        >
          Recallify
        </h1>
        
        {/* Subtitle */}
        <p
          style={{
            fontSize: '28px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          AI-Powered Learning & Memory Tools
        </p>
        
        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '20px',
            }}
          >
            <span>🃏</span>
            <span>Flashcards</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '20px',
            }}
          >
            <span>📝</span>
            <span>Quizzes</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '20px',
            }}
          >
            <span>🤖</span>
            <span>Study Buddy</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
