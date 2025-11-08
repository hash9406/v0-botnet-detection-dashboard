# ========================================================
# BOTNET DETECTION - XGBOOST MODEL TRAINING
# Dataset: CTU-13 (Attack + Normal Traffic)
# ========================================================

# Install required libraries
!pip install xgboost scikit-learn pandas numpy matplotlib seaborn imbalanced-learn

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, roc_auc_score
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import pickle
import warnings
warnings.filterwarnings('ignore')

print("✅ Libraries installed successfully!")

# ========================================================
# STEP 1: LOAD YOUR DATA
# ========================================================

print("\n📥 Loading CTU-13 datasets...")

# Load both attack and normal traffic
attack_df = pd.read_csv('../data/CTU13_Attack_Traffic.csv')
normal_df = pd.read_csv('../data/CTU13_Attack_Traffic.csv')

print(f"Attack traffic shape: {attack_df.shape}")
print(f"Normal traffic shape: {normal_df.shape}")

# Add labels
attack_df['Label'] = 1  # Botnet
normal_df['Label'] = 0  # Normal

# Combine datasets
df = pd.concat([attack_df, normal_df], ignore_index=True)

print(f"\n✅ Combined dataset shape: {df.shape}")
print(f"\nClass distribution:")
print(df['Label'].value_counts())

# Display columns
print(f"\n📊 Available columns:")
print(df.columns.tolist())

# Show first few rows
print(f"\nFirst 5 rows:")
print(df.head())

# ========================================================
# STEP 2: DATA PREPROCESSING
# ========================================================

print("\n🔧 Preprocessing data...")

# Remove any unnamed columns
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# Identify numeric and categorical columns
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

# Remove Label from numeric columns
if 'Label' in numeric_cols:
    numeric_cols.remove('Label')

print(f"\nNumeric columns: {len(numeric_cols)}")
print(f"Categorical columns: {len(categorical_cols)}")

# Handle categorical columns (if any)
for col in categorical_cols:
    if col != 'Label':
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))

# Handle missing values
print(f"\nMissing values before cleaning:")
print(df.isnull().sum().sum())

df = df.fillna(0)

# Handle infinite values
df = df.replace([np.inf, -np.inf], 0)

print(f"Missing values after cleaning: {df.isnull().sum().sum()}")

# Select features (use all numeric columns)
feature_cols = numeric_cols[:20] if len(numeric_cols) > 20 else numeric_cols  # Use top 20 features
X = df[feature_cols].copy()
y = df['Label'].copy()

print(f"\n✅ Feature matrix shape: {X.shape}")
print(f"✅ Labels shape: {y.shape}")

# ========================================================
# STEP 3: HANDLE CLASS IMBALANCE
# ========================================================

print("\n⚖️ Checking class balance...")

class_counts = y.value_counts()
print(f"Class 0 (Normal): {class_counts[0]}")
print(f"Class 1 (Botnet): {class_counts[1]}")
imbalance_ratio = class_counts.min() / class_counts.max()
print(f"Imbalance ratio: {imbalance_ratio:.3f}")

if imbalance_ratio < 0.5:
    print("\n⚖️ Applying SMOTE to balance dataset...")
    smote = SMOTE(random_state=42, k_neighbors=5)
    X, y = smote.fit_resample(X, y)
    print(f"After SMOTE:")
    print(f"Class 0: {(y==0).sum()}")
    print(f"Class 1: {(y==1).sum()}")

# ========================================================
# STEP 4: TRAIN-TEST SPLIT
# ========================================================

print("\n✂️ Splitting data into train/test sets (80/20)...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42, 
    stratify=y
)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# ========================================================
# STEP 5: FEATURE SCALING
# ========================================================

print("\n📏 Scaling features with StandardScaler...")

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Save scaler
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("✅ Scaler saved as 'scaler.pkl'")

# ========================================================
# STEP 6: TRAIN XGBOOST MODEL
# ========================================================

print("\n🚀 Training XGBoost model...")
print("This may take 2-5 minutes depending on dataset size...")

model = XGBClassifier(
    n_estimators=100,          # Number of trees
    max_depth=6,               # Max tree depth
    learning_rate=0.1,         # Step size
    subsample=0.8,             # Row sampling
    colsample_bytree=0.8,      # Column sampling
    objective='binary:logistic',
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss',
    tree_method='hist'         # Faster training
)

# Train model
model.fit(X_train_scaled, y_train, verbose=True)

print("\n✅ Model training complete!")

# ========================================================
# STEP 7: EVALUATE MODEL
# ========================================================

print("\n📈 Evaluating model performance...\n")

# Predictions
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]

# Metrics
accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_pred_proba)

print("="*50)
print("MODEL PERFORMANCE METRICS")
print("="*50)
print(f"🎯 Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"🎯 F1-Score:  {f1:.4f}")
print(f"🎯 ROC-AUC:   {auc:.4f}")
print("="*50)

# Classification report
print("\n📊 Detailed Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Normal', 'Botnet']))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print("\n📊 Confusion Matrix:")
print(cm)
print(f"\nTrue Negatives:  {cm[0][0]}")
print(f"False Positives: {cm[0][1]}")
print(f"False Negatives: {cm[1][0]}")
print(f"True Positives:  {cm[1][1]}")

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Normal', 'Botnet'],
            yticklabels=['Normal', 'Botnet'],
            cbar_kws={'label': 'Count'})
plt.title('Confusion Matrix', fontsize=16, fontweight='bold')
plt.ylabel('True Label', fontsize=12)
plt.xlabel('Predicted Label', fontsize=12)
plt.tight_layout()
plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
plt.show()
print("\n✅ Confusion matrix saved as 'confusion_matrix.png'")

# ========================================================
# STEP 8: FEATURE IMPORTANCE
# ========================================================

print("\n📊 Top 10 Most Important Features:")

feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance.head(10))

# Plot feature importance
plt.figure(figsize=(10, 6))
top_features = feature_importance.head(15)
plt.barh(range(len(top_features)), top_features['importance'])
plt.yticks(range(len(top_features)), top_features['feature'])
plt.xlabel('Importance Score', fontsize=12)
plt.title('Top 15 Feature Importances', fontsize=16, fontweight='bold')
plt.gca().invert_yaxis()
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
plt.show()
print("✅ Feature importance plot saved as 'feature_importance.png'")

# ========================================================
# STEP 9: SAVE MODEL
# ========================================================

print("\n💾 Saving trained model...")

# Save model
with open('xgboost_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model saved as 'xgboost_model.pkl'")

# Save feature names
with open('feature_names.pkl', 'wb') as f:
    pickle.dump(feature_cols, f)

print("✅ Feature names saved as 'feature_names.pkl'")

# ========================================================
# STEP 10: TEST MODEL WITH SAMPLE
# ========================================================

print("\n🧪 Testing model with sample prediction...")

# Take one sample from test set
sample = X_test_scaled[0:1]
sample_true_label = y_test.iloc[0]

# Predict
pred = model.predict(sample)[0]
pred_proba = model.predict_proba(sample)[0]

print(f"\nSample prediction:")
print(f"True label:    {'Botnet' if sample_true_label == 1 else 'Normal'}")
print(f"Predicted:     {'Botnet' if pred == 1 else 'Normal'}")
print(f"Confidence:    Normal: {pred_proba[0]:.2%}, Botnet: {pred_proba[1]:.2%}")

# ========================================================
# STEP 11: MODEL SUMMARY
# ========================================================

print("\n" + "="*50)
print("MODEL TRAINING COMPLETE!")
print("="*50)
print(f"✅ Model accuracy: {accuracy*100:.2f}%")
print(f"✅ F1-Score: {f1:.4f}")
print(f"✅ Features used: {len(feature_cols)}")
print(f"✅ Training samples: {len(X_train)}")
print(f"✅ Test samples: {len(X_test)}")
print("\n📦 Files generated:")
print("   - xgboost_model.pkl (trained model)")
print("   - scaler.pkl (feature scaler)")
print("   - feature_names.pkl (feature list)")
print("   - confusion_matrix.png (visualization)")
print("   - feature_importance.png (visualization)")
print("\n🚀 Copy 'xgboost_model.pkl' to backend/models/ folder")
print("="*50)
