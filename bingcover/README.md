# MusicStore customisation with coverage image searched from Bing

This is the second customisation experiment on MusicStore. The original MusicStore did not have a cover for any album. Each time an album is shown in the details page, this custom code use an image obtained from Bing Image Search as the cover of the album.

Azure DocumentDB is used to cache the obtained cover images, in order to save the calls to the bing service (1000 calls per month for 3 months).

#Deployment

Create an HTTPTrigger-CSharp function, copy the two files into the web-based editor.

# Register
[
  {
    "tenantRegId": 0,
    "userName": "hui.song@sintef.no",
    "originalFunction": "MusicStore.Controllers.StoreController.Details",
    "endpoint": "<AzureFunction Endpoint>"
  }
]

