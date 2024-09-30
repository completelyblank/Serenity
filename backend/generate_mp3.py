import sys
from pydub import AudioSegment
import random
import os

# Define the length of the final MP3 file (in milliseconds)
FINAL_LENGTH_MS = 40 * 1000  # 40 seconds

# Folder paths for each tag (adjust number of folders as needed)
tag_folders = [f'./tag{i+1}/' for i in range(7)]

def load_samples(tag_folder):
    """Load all MP3 samples from the given folder."""
    if not os.path.isdir(tag_folder):
        raise FileNotFoundError(f"The folder {tag_folder} does not exist.")
    return [os.path.join(tag_folder, f) for f in os.listdir(tag_folder) if f.endswith('.mp3')]

def extract_segment(audio_segment, position, segment_duration):
    """Extract a segment from an audio segment based on position (start, middle, end)."""
    duration = len(audio_segment)
    if position == 'start':
        return audio_segment[:segment_duration]
    elif position == 'middle':
        start = (duration - segment_duration) // 2
        return audio_segment[start:start + segment_duration]
    elif position == 'end':
        return audio_segment[-segment_duration:]
    else:
        raise ValueError("Position must be 'start', 'middle', or 'end'.")

def create_mp3_with_tags(tag_percentages):
    # Ensure percentages add up to 100
    assert sum(tag_percentages) == 100, "Percentages must add up to 100."
    
    # Load all samples for each tag
    tag_samples = []
    for tag_folder in tag_folders:
        try:
            samples = load_samples(tag_folder)
            if not samples:
                raise ValueError(f"No MP3 files found in folder {tag_folder}.")
            tag_samples.append(samples)
        except (FileNotFoundError, ValueError) as e:
            print(e)
            return

    # Check if the number of tag folders matches the number of tag percentages
    if len(tag_samples) != len(tag_percentages):
        raise ValueError("Number of tag folders does not match number of tag percentages.")

    # Calculate the duration for each tag based on percentages
    tag_durations = [int((percentage / 100) * FINAL_LENGTH_MS) for percentage in tag_percentages]
    
    # Mix tracks according to specified tag percentages
    final_mix = AudioSegment.silent(duration=0)  # Start with silence
    
    overlap_duration = 2000  # 2 seconds overlap
    current_position = 0  # Start position for final mix
    
    for i, duration in enumerate(tag_durations):
        tag_folder_samples = tag_samples[i]
        current_segment = AudioSegment.silent(duration=0)  # Silence for the current tag
        
        # Define segment position based on where this tag falls in the final mix
        if current_position == 0:
            segment_position = 'start'
        elif current_position + duration >= FINAL_LENGTH_MS:
            segment_position = 'end'
        else:
            segment_position = 'middle'
        
        while len(current_segment) < duration:
            # Randomly pick a sample and add it
            sample_path = random.choice(tag_folder_samples)
            sample_segment = AudioSegment.from_mp3(sample_path)
            
            # Extract the desired segment of the sample
            sample_segment = extract_segment(sample_segment, segment_position, min(duration - len(current_segment), len(sample_segment)))
            
            # Overlap the segments if needed
            if len(current_segment) > 0 and len(sample_segment) > overlap_duration:
                overlap_segment = sample_segment[:overlap_duration]
                current_segment = current_segment.append(overlap_segment, crossfade=overlap_duration)
                sample_segment = sample_segment[overlap_duration:]
            
            current_segment += sample_segment
        
        # Add the current segment to the final mix with careful crossfade handling
        if len(final_mix) > 0 and len(current_segment) > overlap_duration:
            final_mix = final_mix.append(current_segment, crossfade=overlap_duration)
        else:
            final_mix += current_segment
        
        # Update the current position
        current_position += duration
    
    # Truncate the final mix to exactly 40 seconds if it's longer
    final_mix = final_mix[:FINAL_LENGTH_MS]
    
    # Export the final mix as an MP3 file
    final_mix.export("final_mix.mp3", format="mp3")
    print("MP3 file created: final_mix.mp3")

if __name__ == '__main__':
    # Get tag percentages from command-line arguments
    tag_percentages = [int(arg) for arg in sys.argv[1:]]
    create_mp3_with_tags(tag_percentages)