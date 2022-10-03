import requests
import json
import pandas as pd

dfs = []
for i in range(9):
  r = requests.get("https://api.parknshop.com/api/v2/pnshk/products/search?fields=FULL&query=%3AbestSeller%3Acategory%3A04010200&pageSize=18&currentPage=" + str(i) + "&sort=bestSeller&lang=zh_HK&curr=HKD")
  data = json.loads(r.text)
  dfs.append(data["products"])


fixed = []
for products in dfs:
  for data in products:
    fixed.append({
        "product_name":data["name"],
        "description":data["contentSizeUnit"],
        "brand":data["masterBrand"]["name"],
        "price":data["price"]["value"],
        "market":"PK_shop",
        "category":"drinks",
    })
df_fixed = pd.DataFrame(fixed)
df_fixed.to_csv("PK_shop_drinks.csv")
