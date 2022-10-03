# %%
import pandas as pd

df = pd.read_csv('./02_zstore_drinks.csv')

# %%
df['price']=pd.to_numeric(df['price'].str[1:])

# %%
import re
df.insert(1, 'brand', df['product_name'].apply(lambda x: re.findall('(.*?)\s+-', x)[0]))
df['brand']

# %%
import re
df['product_name']=df['product_name'].apply(lambda x: re.findall('.*\s+-\s+(.*)', x)[0])

# %%
import re
df = df[df['product_name'].str.contains('原箱') == False]
# (df['product_name'].apply(lambda x: re.search('原箱', x))) == None

# %%
df.info()

# %%
df['product_name'].value_counts()

# %%
df.head()
df.to_csv('02_donki_drinks.csv')

# %%
df.groupby('product_name').sum().sort_values('price', ascending=False)
df.groupby('product_name').agg({"release_year":"mean", "duration":"sum"}).sort_values('price', ascending=False)
df[df['product_name'].str.contains('原箱') == True]