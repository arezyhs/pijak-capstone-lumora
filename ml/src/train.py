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
    
    # We will only use academic and behavioral metrics relevant to Lumora MVP
    # Drop IDs, target leakage (Final, Midterm, Total), and demographics
    columns_to_keep = [
        'Department', 'Attendance (%)', 'Assignments_Avg', 'Quizzes_Avg', 
        'Participation_Score', 'Study_Hours_per_Week', 'Class'
    ]
    df = df[columns_to_keep].dropna()
    
    # Target and features
    X = df.drop('Class', axis=1)
    y = df['Class']

    # Identify numeric and categorical columns
    numeric_features = ['Attendance (%)', 'Assignments_Avg', 'Quizzes_Avg', 'Participation_Score', 'Study_Hours_per_Week']
    categorical_features = ['Department']

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # Model pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42))
    ])

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Train
    print("Training Random Forest Classifier on new massive dataset...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    main()
