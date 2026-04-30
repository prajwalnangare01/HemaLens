# HemaLens - AI Blood Report Analyzer

HemaLens is a clinical-grade web application designed to help patients understand their laboratory data with clarity and precision. By leveraging advanced AI, HemaLens extracts data from blood report images and translates complex medical jargon into easy-to-understand insights.

## ✨ Features
- **Biomarker Extraction**: Automatically identifies key parameters like RBC, Hemoglobin, Glucose, etc., directly from uploaded images.
- **AI-Powered Analysis**: Utilizes Google's Gemini Flash AI model for rapid and accurate extraction.
- **Bilingual Insights**: Provides plain English summaries as well as Hindi translations for better accessibility.
- **Actionable Advice**: Suggests dietary and lifestyle changes based on your specific findings.
- **Risk Assessment**: Highlights critical values that require immediate medical attention.

## 🛠️ Tech Stack
- **Frontend**: HTML5, Vanilla CSS (with modern glassmorphism UI), and Vanilla Javascript.
- **Backend**: Node.js with Express.js.
- **AI Integration**: `@google/generative-ai` (Gemini Flash).
- **File Handling**: `multer` (with memory storage for fast processing and serverless compatibility).

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prajwalnangare01/HemaLens.git
   cd "Blood Report Analyzer"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a file named `.env` in the root directory.
   - Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).
   - Add your API key to the `.env` file:
     ```env
     GEMINI_API_KEY=your_api_key_here
     PORT=3000
     ```

## 📖 How to Use

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   *(This uses `nodemon` to automatically restart the server if you make changes).*

2. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

3. **Analyze a Report:**
   - Click the upload area or drag-and-drop an image of your blood test report (JPG, PNG, etc.).
   - Wait a few seconds for the AI to process and analyze the document.
   - Review your personalized health dashboard, complete with your biomarker readings, translated summaries, and dietary plans!

---
🚨 **Disclaimer**: This is an AI analysis for educational and informational purposes only. This is **NOT** a medical diagnosis. Please consult a registered medical practitioner immediately for critical health decisions or proper medical advice.
