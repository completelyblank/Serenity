![d](https://github.com/completelyblank/DreamCatcher/assets/105001837/1bffa066-b0f4-4b4c-b2ea-3254b1efcb3d)

# Dreamcatcher: Unlocking the Secrets of Lucid Dreaming

## Project Overview

Dreamcatcher is a comprehensive platform designed to help users record, analyze, and understand their lucid dreaming experiences. By leveraging a robust database schema and incorporating features like dream journaling, mood tracking, and data visualization, Dreamcatcher provides a holistic approach to exploring the subconscious mind.

## Key Features

- **Dream Journaling**: Record and edit dreams with tags and categories.
- **Mood and Emotion Tracking**: Monitor emotions and moods associated with dreams.
- **Reality Checking Reminders**: Receive reminders to practice reality checking.
- **Dream Sign Tracking**: Identify recurring dream signs and their frequencies.
- **Community Sharing and Discussion**: Share dreams and engage with others in the community.
- **Data Visualization and Insights**: Analyze dream patterns and emotions through visual representations.
- **ROBERTA Model Sentiment Analysis**: Utilize natural language processing (NLP) to analyze dream sentiments.

## Database Schema

- **Users**: 
  - `user_id`
  - `name`
  - `email`
  
- **Dreams**: 
  - `dream_id`
  - `user_id`
  - `date`
  - `content`
  - `tags`
  - `emotions`
  
- **Dream_Signs**: 
  - `dream_sign_id`
  - `user_id`
  - `sign`
  - `frequency`
  
- **Reality_Checks**: 
  - `check_id`
  - `user_id`
  - `date`
  - `result`
  
- **Moods**: 
  - `mood_id`
  - `user_id`
  - `date`
  - `mood`

## Getting Started

### Prerequisites

- Node.js
- npm (or yarn)
- MySQL

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/dreamcatcher.git

2. Navigate to the project directory:
    ```sh
    cd dreamcatcher

3. Install dependencies:
   ```sh
    npm install

4. Set up the database:

   Create a MySQL database and update the database configuration in config/database.js.

5. Run the application:
    ```sh
   npm start

# Usage:
-Access the application at http://localhost:3000.
-Register a new user or log in with an existing account.
-Start recording your dreams and track your emotions and dream signs.
-Use the analysis tools to gain insights into your dream patterns.

# Contributing:
-Fork the repository.
-Create your feature branch (git checkout -b feature/AmazingFeature).
-Commit your changes (git commit -m 'Add some AmazingFeature').
-Push to the branch (git push origin feature/AmazingFeature).
-Open a pull request.

# License:
-Distributed under the MIT License. See LICENSE for more information.


