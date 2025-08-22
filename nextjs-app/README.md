# Recallify - AI-Powered Educational Tools

Recallify is an interactive learning platform that uses AI to create flashcards, quizzes, and provide study assistance. The application has been successfully migrated from using local Ollama models to Together AI's cloud-based API.

## Features

- **🃏 Flashcard Maker**: Generate flashcards from study notes using AI
- **📝 Quiz Creator**: Create multiple-choice quizzes from any text content
- **🤖 Study Buddy**: Ask questions and get detailed, educational responses
- **📊 Progress Tracking**: Track daily learning goals and streaks
- **🎨 Modern UI**: Beautiful, responsive interface with dark/light theme support

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Integration**: Together AI API (meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo)
- **Styling**: Custom CSS with CSS variables for theming

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nextjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## API Integration

The application uses Together AI's API for all AI-powered features:

- **API Key**: Configured in `lib/together-ai.ts`
- **Model**: `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo` (serverless)
- **Features**:
  - Chat completions for study buddy responses
  - Structured JSON generation for flashcards and quizzes
  - Error handling and fallback responses

## API Endpoints

- `POST /api/flashcards` - Generate flashcards from notes
- `POST /api/quiz` - Create quizzes from text content
- `POST /api/study-buddy` - Get educational responses to questions

## Key Changes Made

1. **Replaced Ollama Integration**: 
   - Removed local model dependencies
   - Integrated Together AI SDK
   - Updated all API routes to use cloud-based AI

2. **Enhanced Error Handling**:
   - Added proper error handling for API failures
   - Implemented fallback responses
   - Added JSON parsing utilities

3. **Improved User Experience**:
   - Faster response times with cloud AI
   - More reliable model availability
   - Better formatting for AI responses

## Usage

### Creating Flashcards
1. Navigate to the Flashcards tab
2. Paste your study notes in the text area
3. Click "Generate Flashcards"
4. Review and study the generated cards

### Creating Quizzes
1. Navigate to the Quiz tab
2. Paste the content you want to quiz on
3. Click "Create Quiz"
4. Answer the multiple-choice questions
5. Review your results and explanations

### Using Study Buddy
1. Navigate to the Study Buddy tab
2. Type your question in the input field
3. Click "Ask" or press Enter
4. Get detailed, educational responses
5. Save important notes for later reference

## Development

### Project Structure
```
nextjs-app/
├── app/
│   ├── api/           # API routes
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main application
├── components/        # React components
├── lib/              # Utility functions
│   └── together-ai.ts # Together AI configuration
└── package.json      # Dependencies
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue in the repository.
