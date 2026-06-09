import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.utils import resample

def main():
    # Set paths
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, 'data', 'Students Performance Dataset.csv')
    model_dir = os.path.join(base_dir, 'models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'student_behavior_model.joblib')

    # Load data
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)
    
    # Map 'Grade' to 'Class' (Remedial, Standard, Advanced)
    def map_grade(grade):
        if grade in ['F', 'D']: return 'Remedial'
        elif grade in ['C', 'B']: return 'Standard'
        elif grade == 'A': return 'Advanced'
        return 'Standard'

    df['Class'] = df['Grade'].apply(map_grade)
    
    # We will use ALL academic, behavioral, and demographic metrics relevant to student profiling
    columns_to_keep = [
        'Age', 'Gender', 'Department', 'Internet_Access_at_Home', 'Family_Income_Level',
        'Parent_Education_Level', 'Extracurricular_Activities',
        'Attendance (%)', 'Assignments_Avg', 'Quizzes_Avg', 
        'Participation_Score', 'Study_Hours_per_Week', 
        'Stress_Level (1-10)', 'Sleep_Hours_per_Night', 'Class'
    ]
    df = df[columns_to_keep].dropna()

    # --- OVERSAMPLING MANUALLY ---
    # The 'Advanced' class has extremely low representation (less than 1%)
    # We need to oversample 'Advanced' to match the 'Standard' or 'Remedial' count
    df_remedial = df[df['Class'] == 'Remedial']
    df_standard = df[df['Class'] == 'Standard']
    df_advanced = df[df['Class'] == 'Advanced']

    # We will oversample 'Advanced' to match the count of 'Standard'
    target_count = len(df_standard)
    print(f"Original Class distribution:\nRemedial: {len(df_remedial)}\nStandard: {target_count}\nAdvanced: {len(df_advanced)}")
    
    if len(df_advanced) > 0 and len(df_advanced) < target_count:
        df_advanced_oversampled = resample(df_advanced, 
                                           replace=True,     # sample with replacement
                                           n_samples=target_count,    # to match majority class
                                           random_state=42)  # reproducible results
        
        # Combine back
        df = pd.concat([df_remedial, df_standard, df_advanced_oversampled])
        print(f"Balanced Class distribution (After Oversampling):\n{df['Class'].value_counts()}")
    else:
        print("Skipping oversampling: Advanced class missing or already balanced.")

    # Target and features
    X = df.drop('Class', axis=1)
    y = df['Class']

    # Identify numeric and categorical columns
    numeric_features = [
        'Age', 'Attendance (%)', 'Assignments_Avg', 'Quizzes_Avg', 
        'Participation_Score', 'Study_Hours_per_Week', 
        'Stress_Level (1-10)', 'Sleep_Hours_per_Night'
    ]
    categorical_features = [
        'Gender', 'Department', 'Internet_Access_at_Home', 
        'Family_Income_Level', 'Parent_Education_Level', 'Extracurricular_Activities'
    ]

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # Model pipeline (Added class_weight='balanced' and tuned hyperparameters)
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=200, max_depth=15, min_samples_split=5, class_weight='balanced', random_state=42))
    ])

    # Split data (ensure stratify)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Train
    print("\nTraining Advanced Random Forest Classifier on fully balanced dataset...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nModel Evaluation:")
    print(f"Accuracy: {acc:.4f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    joblib.dump(pipeline, model_path)
    print(f"Advanced Model saved to {model_path}")

if __name__ == "__main__":
    main()
