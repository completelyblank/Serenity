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
