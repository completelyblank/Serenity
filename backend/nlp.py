from transformers import pipeline
import sys
import json
import os
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

# Load the sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def analyze_sentiment(description):
    # Perform sentiment analysis on the input string
    sentiment = sentiment_analyzer(description)
    # Extract the sentiment label, convert it to lowercase, then capitalize the first letter
    sentiment_label = sentiment[0]['label'].capitalize()
    return sentiment_label

if __name__ == "__main__":
    # Expecting a JSON input with a single mood description
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    # Get the mood description from JSON
    description = data.get('MOOD_DESCRIPTION', '')

    # Perform sentiment analysis
    sentiment_result = analyze_sentiment(description)
    
    # Prepare the result in JSON format
    output = {"SENTIMENT": sentiment_result}
    
    # Output the result as JSON
    print(json.dumps(output))
