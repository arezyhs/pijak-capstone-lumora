import pandas as pd
import os

def run_eda():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, 'data', 'xAPI-Edu-Data.csv')
    
    if not os.path.exists(data_path):
        print("Data not found. Run train.py or download data first.")
        return
        
    df = pd.read_csv(data_path)
    print("=== xAPI-Edu-Data EDA ===")
    print(f"Shape: {df.shape}")
    print("\nClass Distribution:")
    print(df['Class'].value_counts(normalize=True))
    
    print("\nFeature means by Class:")
    numeric_df = df[['raisedhands', 'VisITedResources', 'AnnouncementsView', 'Discussion', 'Class']]
    print(numeric_df.groupby('Class').mean())

if __name__ == "__main__":
    run_eda()
