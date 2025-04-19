import os
import pandas as pd

true_labels = ['true', 'mostly-true', 'half-true']
false_labels = ['false', 'barely-true',]

# ✅ Create output folder
os.makedirs('datasets/processed', exist_ok=True)

def clean_and_save(input_path, output_path):
    df = pd.read_csv(input_path, sep='\t')
    df_clean = df.iloc[:, [1, 2]].copy()
    df_clean.columns = ['label', 'text']
    df_clean['label'] = df_clean['label'].apply(
        lambda x: 1 if str(x).lower().strip() in true_labels else 0
    )
    df_clean.to_csv(output_path, index=False)
    print(f"✅ Saved cleaned data to {output_path}")

# ✅ Use the new 'datasets' folder
clean_and_save('datasets/train.tsv', 'datasets/processed/train_clean.csv')
clean_and_save('datasets/valid.tsv', 'datasets/processed/valid_clean.csv')
clean_and_save('datasets/test.tsv',  'datasets/processed/test_clean.csv')
