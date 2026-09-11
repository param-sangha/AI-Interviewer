# InterviewAI

InterviewAI is an AI-powered mock interview platform that simulates a real technical or behavioral interview using real-time voice communication.

The platform allows candidates to configure an interview based on their role, experience, difficulty, interview type, duration, and job description. An AI interviewer then asks questions, listens to responses, asks relevant follow-up questions, and provides performance feedback.

## Features

- AI-powered mock interviews
- Real-time voice interview
- AI interviewer with natural follow-up questions
- Technical, behavioral, and mixed interviews
- Multiple job roles
- Easy, Medium, and Hard difficulty levels
- Experience-based interview configuration
- Custom interview duration
- Optional job description
- Live interview transcript
- Microphone mute/unmute
- Automatic interview timer
- Automatic interview completion
- AI-generated interview score and feedback
- Responsive modern UI
- Real-time communication using Agora

## Tech Stack

### Frontend

- Next.js
- React
- CSS Modules
- Tailwind CSS

### Real-Time Communication

- Agora RTC
- Agora RTM
- Agora Conversational AI

### AI / Backend

- Next.js API Routes
- Agora Agents
- Deepgram STT
- MiniMax TTS
- OpenAI LLM
- DeepSeek for interview scoring

## Project Structure

```text
app/
├── api/
│   ├── invite-agent/
│   │   └── route.js
│   ├── score/
│   │   └── route.js
│   ├── stop-agent/
│   │   └── route.js
│   └── token/
│       └── route.js
│
├── components/
│   ├── LandingPage.js
│   ├── LandingPage.module.css
│   ├── InterviewSetup.js
│   ├── InterviewSetup.module.css
│   ├── InterviewScreen.js
│   ├── InterviewScreen.module.css
│   ├── ResultsScreen.js
│   └── ResultsScreen.module.css
│
├── globals.css
└── page.js
```

## How It Works

The application follows this flow:

Landing Page
    ↓
Interview Setup
    ↓
Select Role / Type / Difficulty / Experience
    ↓
Set Interview Duration
    ↓
Optional Job Description
    ↓
Start Interview
    ↓
Connect to Agora RTC
    ↓
Connect to Agora RTM
    ↓
Start AI Interviewer
    ↓
AI asks a question
    ↓
Candidate answers through microphone
    ↓
Speech is converted to text
    ↓
AI evaluates the response
    ↓
AI asks a relevant follow-up
    ↓
Interview continues
    ↓
Interview ends or timer expires
    ↓
Transcript is sent for scoring
    ↓
Score + Feedback

## Interview Configuration

Candidates can customize the interview using the following options:

Role:
- Backend Engineer
- Frontend Engineer
- Full Stack Engineer
- Software Engineer

Interview Type:
- Technical
- Behavioral
- Mixed

Difficulty:
- Easy
- Medium
- Hard

Experience:
- 0–1 years
- 1–3 years
- 3–5 years
- 5+ years

Duration:
- 15 minutes
- 30 minutes
- 45 minutes

Job Description:
- Optional custom job description

The selected configuration is passed to the AI interviewer so that questions can be adapted to the candidate and role.

## AI Interviewer

The AI interviewer is designed to behave like a real interviewer.

It follows several rules:

- Ask one question at a time
- Wait for the candidate's response
- Keep responses short and focused
- Ask follow-up questions based on the candidate's actual answer
- Avoid inventing information
- Avoid unnecessarily repeating questions
- Increase difficulty when appropriate
- Simplify questions when the candidate struggles
- Maintain a professional and friendly tone
- Focus on evaluating the candidate instead of giving answers

## Real-Time Communication

Agora is used to handle the real-time interview experience.

Agora RTC provides:

- Microphone access
- Audio publishing
- AI interviewer audio
- Real-time voice communication

Agora RTM provides:

- Real-time messaging
- Interview transcript updates
- Communication between the client and AI interviewer

## API Routes

### POST /api/token

Generates Agora RTC and RTM tokens required by the client.

### POST /api/invite-agent

Creates and starts the AI interviewer agent.

Example request:

{
  "channel": "interview-room",
  "config": {
    "role": "Backend Engineer",
    "type": "Technical",
    "difficulty": "Medium",
    "experience": "0–1 years",
    "duration": "30 min",
    "jobDescription": ""
  }
}

### POST /api/stop-agent

Stops the active AI interviewer session.

### POST /api/score

Sends the completed interview transcript to the scoring model.

The scoring API returns a result similar to:

{
  "score": 85,
  "feedback": "Strong technical fundamentals and clear communication."
}

## Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/interview-ai.git

cd interview-ai

### 2. Install dependencies

npm install

### 3. Configure environment variables

Create a `.env.local` file in the project root.

NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id

NEXT_AGORA_APP_CERTIFICATE=your_agora_app_certificate

OPENAI_API_KEY=your_openai_api_key

Never commit `.env.local` or API keys to GitHub.

### 4. Start the development server

npm run dev

Open the application at:

http://localhost:3000

## Required Services

### Agora

Agora is required for the real-time interview experience.

You need:

- Agora App ID
- Agora App Certificate

These values should be stored in `.env.local`.

### Deepgram

Deepgram is used for Speech-to-Text.

The candidate's voice is converted into text so the AI interviewer can understand the response.

### MiniMax

MiniMax is used for Text-to-Speech.

The AI interviewer's generated responses are converted into spoken audio.

### OpenAI

OpenAI is used as the LLM provider through the Agora AI agent configuration.

OpenAI is used to analyze the final interview transcript and generate:

- Overall score
- Performance feedback

## Security

- API keys are stored in environment variables
- Agora App Certificate is never exposed to the frontend
- OpenAI API key is only used server-side
- Sensitive API operations are handled through Next.js API routes
- `.env.local` should never be committed to GitHub

## Development

Run development server:

npm run dev

Build the application:

npm run build

Start production server:

npm start

## Current Limitations

- Interview scoring requires a valid OpenAI API key
- The quality of the interview depends on the configured AI services
- Interview history is not currently persisted
- User authentication is not currently implemented
- The current implementation uses a predefined interview channel
- Production deployment requires properly configured Agora credentials

## Future Improvements

- User authentication
- User profiles
- Interview history
- Performance dashboard
- Question-level scoring
- Technical and behavioral score breakdown
- Resume-based interview generation
- Job-description-based question generation
- More AI interviewer personalities
- Interview analytics
- Persistent database
- Production monitoring
- Rate limiting
- Anti-cheating features
- Personalized interview preparation

## License

This project is built for learning, experimentation, and portfolio purposes.

---

Built with Next.js, Agora, and AI to make interview practice more realistic.
