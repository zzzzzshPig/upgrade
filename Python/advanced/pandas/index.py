import pandas as pd

titanic = pd.read_csv("../data/train.csv", index_col="Name")

# print(titanic.head())

print(titanic.loc[titanic["Sex"] == "male", "Age"].mean())
