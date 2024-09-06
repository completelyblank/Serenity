from pydub import AudioSegment
import random
import os

# Define the length of the final MP3 file (in milliseconds)
FINAL_LENGTH_MS = 40 * 1000  # 40 seconds

# Folder paths for each tag
tag_folders = [f'./tag{i+1}/' for i in range(7)]

def load_samples(tag_folder):
    """Load all MP3 samples from the given folder."""
    return [os.path.join(tag_folder, f) for f in os.listdir(tag_folder) if f.endswith('.mp3')]

def create_mp3_with_tags(tag_percentages):
    # Ensure percentages add up to 100
    assert sum(tag_percentages) == 100, "Percentages must add up to 100."
    
    # Load all samples for each tag
    tag_samples = [load_samples(tag_folder) for tag_folder in tag_folders]
    
    # Calculate the duration for each tag based on percentages
    tag_durations = [int((percentage / 100) * FINAL_LENGTH_MS) for percentage in tag_percentages]
    
    # Mix tracks according to specified tag percentages
    final_mix = AudioSegment.silent(duration=0)  # Start with silence
    
    for i, duration in enumerate(tag_durations):
        tag_folder_samples = tag_samples[i]
        current_segment = AudioSegment.silent(duration=0)  # Silence for the current tag
        
        while len(current_segment) < duration:
            # Randomly pick a sample and add it
            sample_path = random.choice(tag_folder_samples)
            sample_segment = AudioSegment.from_mp3(sample_path)
            
            # Only add enough to reach the desired duration
            if len(current_segment) + len(sample_segment) > duration:
                sample_segment = sample_segment[:duration - len(current_segment)]
            
            current_segment += sample_segment
        
        # Add the current segment to the final mix
        final_mix += current_segment
    
    # Truncate the final mix to exactly 40 seconds if it's longer
    final_mix = final_mix[:FINAL_LENGTH_MS]
    
    # Export the final mix as an MP3 file
    final_mix.export("final_mix.mp3", format="mp3")
    print("MP3 file created: final_mix.mp3")

# Example usage:
tag_percentages = [10, 20, 10, 10, 10, 10, 10, 10, 5, 5]  # Percentages for 10 tags
create_mp3_with_tags(tag_percentages)
