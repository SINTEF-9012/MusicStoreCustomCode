# The Buy-and-donate customisation of MusicStore

Every time you buy an album, we ask you to donation some money (up to the price of the album). The donation will be added to the total price as shown in your shopping cart.

# Techniques to run the custom code
- Node.js
- MongoDB
- Docker

# Deploy

```bash
cd ./src
docker-compose up -d
```

# Register customisation

POST to http://<MusicStoreUrl>/Tenant/RegisterItem
with the following body
```json
[
  {
    "tenantRegId": 0,
    "userName": "hui.song@sintef.no",
    "originalFunction": "MusicStore.Models.ShoppingCart.GetTotal",
    "endpoint": "http://localhost:8080/api/shoppingcartx/gettotal"
  },
  {
    "tenantRegId": 0,
    "userName": "hui.song@sintef.no",
    "originalFunction": "MusicStore.Controllers.ShoppingCartController.AddToCart",
    "endpoint": "http://localhost:8080/api/shoppingcartcontrollerx/additem"
  }
]
```